from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.http import HttpResponse
import pandas as pd
import io

from .models import Lead, Customer, Contact, Todo, Call, Meeting, Message, EODReport
from .serializers import (
    LeadSerializer, CustomerSerializer, ContactSerializer,
    TodoSerializer, CallSerializer, MeetingSerializer, MessageSerializer,
    EODReportSerializer
)

class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    def get_queryset(self):
        qs = Lead.objects.all().order_by('-created_at')
        if getattr(self.request.user, 'role', None) != 'Admin':
            qs = qs.filter(ae_assigned=self.request.user)
        return qs
        
    def perform_create(self, serializer):
        if getattr(self.request.user, 'role', None) != 'Admin' or not self.request.data.get('ae_assigned'):
            serializer.save(ae_assigned=self.request.user)
        else:
            serializer.save()

    def perform_update(self, serializer):
        if getattr(self.request.user, 'role', None) != 'Admin':
            serializer.save(ae_assigned=self.request.user)
        else:
            serializer.save()



    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        if getattr(request.user, 'role', None) != 'Admin':
            return Response({'error': 'Only Admins can delete all leads.'}, status=status.HTTP_403_FORBIDDEN)
        Lead.objects.all().delete()
        return Response({'message': 'All leads deleted successfully.'})

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    def get_queryset(self):
        qs = Customer.objects.all().order_by('-created_at')
        if getattr(self.request.user, 'role', None) != 'Admin':
            qs = qs.filter(customer_owner=self.request.user)
        return qs
        
    def perform_create(self, serializer):
        if getattr(self.request.user, 'role', None) != 'Admin' or not self.request.data.get('customer_owner'):
            serializer.save(customer_owner=self.request.user)
        else:
            serializer.save()

class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    def get_queryset(self):
        qs = Contact.objects.all().order_by('-created_at')
        # Allow viewing all contacts for simplicity, or restrict by customer owner
        return qs

class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    def get_queryset(self):
        qs = Todo.objects.all().order_by('due_date')
        if getattr(self.request.user, 'role', None) != 'Admin':
            # Todos where they are the owner or assigned to
            from django.db.models import Q
            qs = qs.filter(Q(owner=self.request.user) | Q(assigned_to=self.request.user))
        return qs
        
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CallViewSet(viewsets.ModelViewSet):
    serializer_class = CallSerializer
    def get_queryset(self):
        qs = Call.objects.all().order_by('-start_date')
        if getattr(self.request.user, 'role', None) != 'Admin':
            qs = qs.filter(call_owner=self.request.user)
        return qs
        
    def perform_create(self, serializer):
        if getattr(self.request.user, 'role', None) != 'Admin' or not self.request.data.get('call_owner'):
            serializer.save(call_owner=self.request.user)
        else:
            serializer.save()

class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    def get_queryset(self):
        qs = Meeting.objects.all().order_by('-from_date')
        if getattr(self.request.user, 'role', None) != 'Admin':
            qs = qs.filter(meeting_owner=self.request.user)
        return qs
        
    def perform_create(self, serializer):
        if getattr(self.request.user, 'role', None) != 'Admin' or not self.request.data.get('meeting_owner'):
            serializer.save(meeting_owner=self.request.user)
        else:
            serializer.save()

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    def get_queryset(self):
        return Message.objects.all().order_by('-sent_at')

class ImportLeadsView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file provided"}, status=400)
        
        try:
            df = pd.read_excel(file_obj)
            df = df.fillna('')
            
            created_count = 0
            duplicate_count = 0
            duplicates = []
            
            for index, row in df.iterrows():
                row_dict = {str(k).strip().lower(): str(v).strip() for k, v in row.to_dict().items()}
                
                # Cleanup potential string 'nan' from pandas
                for k, v in row_dict.items():
                    if v.lower() == 'nan':
                        row_dict[k] = ''
                
                # Broaden the key checks to accommodate different Excel formats
                contact_email = row_dict.get('email address', row_dict.get('email', row_dict.get('email id', '')))
                contact_number = row_dict.get('contact no', row_dict.get('number', row_dict.get('mobile', row_dict.get('phone', row_dict.get('contact', '')))))
                contact_name = row_dict.get('contact name', row_dict.get('name', row_dict.get('client name', row_dict.get('first name', ''))))
                company_name = row_dict.get('company name', row_dict.get('company', row_dict.get('organization', row_dict.get('account', ''))))
                industry = row_dict.get('industry', row_dict.get('sector', row_dict.get('vertical', '')))
                designation = row_dict.get('designation', row_dict.get('title', row_dict.get('role', '')))
                address = row_dict.get('address', row_dict.get('location', row_dict.get('city', '')))
                
                # Skip if totally empty
                if not contact_email and not contact_number and not contact_name:
                    continue
                
                # Check for duplicates by email or number
                is_duplicate = False
                if contact_email and Lead.objects.filter(email_address=contact_email).exists():
                    is_duplicate = True
                if not is_duplicate and contact_number and Lead.objects.filter(contact_no=contact_number).exists():
                    is_duplicate = True
                
                if is_duplicate:
                    duplicate_count += 1
                    duplicates.append(contact_email or contact_number or f"Row {index+1}")
                    continue
                
                ae_name = row_dict.get('ae assigned', row_dict.get('owner', row_dict.get('assignee', '')))
                ae_user = request.user
                if ae_name:
                    from authentication.models import CustomUser
                    found_user = CustomUser.objects.filter(name__icontains=ae_name, is_approved=True).first()
                    if found_user:
                        ae_user = found_user

                Lead.objects.create(
                    industry=industry,
                    contact_name=contact_name,
                    company_name=company_name,
                    email_address=contact_email,
                    contact_no=contact_number,
                    address=address,
                    designation=designation,
                    meeting_date=row_dict.get('meeting date', ''),
                    status=row_dict.get('status', ''),
                    outcome=row_dict.get('call outcome', row_dict.get('outcome', '')),
                    linkedin_connect=row_dict.get('linkedin connect', ''),
                    demo_call=row_dict.get('demo call', ''),
                    proposal_sent=row_dict.get('proposal sent', ''),
                    closures=row_dict.get('closures', ''),
                    source=row_dict.get('source', ''),
                    call_interaction_time=row_dict.get('call interaction time', ''),
                    call_status=row_dict.get('call status', ''),
                    remark=row_dict.get('remark', ''),
                    meeting_type=row_dict.get('meeting type', ''),
                    call_outcome=row_dict.get('call outcome', row_dict.get('outcome', '')),
                    ae_assigned=ae_user
                )
                created_count += 1
                
            msg = f"Successfully imported {created_count} leads."
            if duplicate_count > 0:
                dup_str = ", ".join(duplicates[:3])
                if len(duplicates) > 3:
                    dup_str += " and more"
                msg += f" Skipped {duplicate_count} duplicates ({dup_str})."
                
            return Response({"message": msg})
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class ExportLeadsView(APIView):
    def get(self, request, *args, **kwargs):
        leads = Lead.objects.all().values(
            'id', 'industry', 'contact_name', 'company_name', 'email_address', 'contact_no', 'address',
            'designation', 'meeting_date', 'status', 'call_outcome', 'linkedin_connect',
            'demo_call', 'proposal_sent', 'closures', 'source', 'call_interaction_time',
            'call_status', 'remark', 'meeting_type'
        )
        df = pd.DataFrame(list(leads))
        if not df.empty:
            df.rename(columns={
                'id': 'Sr. No.',
                'industry': 'Industry',
                'contact_name': 'Contact Name',
                'company_name': 'Company Name',
                'email_address': 'Email Address',
                'contact_no': 'Contact No',
                'address': 'Address',
                'designation': 'Designation',
                'meeting_date': 'Meeting Date',
                'status': 'Status',
                'call_outcome': 'Call Outcome',
                'linkedin_connect': 'LinkedIn Connect',
                'demo_call': 'Demo Call',
                'proposal_sent': 'Proposal Sent',
                'closures': 'Closures',
                'source': 'Source',
                'call_interaction_time': 'Call Interaction Time',
                'call_status': 'Call Status',
                'remark': 'Remark',
                'meeting_type': 'Meeting Type'
            }, inplace=True)
        
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Leads')
        
        output.seek(0)
        response = HttpResponse(
            output, 
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=leads.xlsx'
        return response

class DownloadLeadTemplateView(APIView):
    def get(self, request, *args, **kwargs):
        headers = [
            'Industry', 'Contact Name', 'Company Name', 'Email Address', 
            'Contact No', 'Address', 'Designation', 'Meeting Date', 
            'Status', 'Call Outcome', 'LinkedIn Connect', 'Demo Call', 
            'Proposal Sent', 'Closures', 'Source', 'Call Interaction Time',
            'Call Status', 'Remark', 'Meeting Type', 'AE Assigned'
        ]
        df = pd.DataFrame(columns=headers)
        
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Template')
        
        output.seek(0)
        response = HttpResponse(
            output, 
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=lead_template.xlsx'
        return response

class EODReportViewSet(viewsets.ModelViewSet):
    serializer_class = EODReportSerializer
    def get_queryset(self):
        qs = EODReport.objects.all().order_by('-created_at')
        if getattr(self.request.user, 'role', None) != 'Admin':
            qs = qs.filter(user=self.request.user)
        return qs
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



