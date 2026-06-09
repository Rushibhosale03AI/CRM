from rest_framework import serializers
from authentication.models import CustomUser
from .models import Lead, Customer, Contact, Todo, Call, Meeting, Message, EODReport

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'role']

class LeadSerializer(serializers.ModelSerializer):
    ae_assigned_details = UserSerializer(source='ae_assigned', read_only=True)

    class Meta:
        model = Lead
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    customer_owner_details = UserSerializer(source='customer_owner', read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class TodoSerializer(serializers.ModelSerializer):
    owner_details = UserSerializer(source='owner', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = Todo
        fields = '__all__'
        read_only_fields = ['owner']

class CallSerializer(serializers.ModelSerializer):
    call_owner_details = UserSerializer(source='call_owner', read_only=True)
    lead_details = LeadSerializer(source='lead', read_only=True)

    class Meta:
        model = Call
        fields = '__all__'
        read_only_fields = ['call_owner']

class MeetingSerializer(serializers.ModelSerializer):
    meeting_owner_details = UserSerializer(source='meeting_owner', read_only=True)
    lead_details = LeadSerializer(source='lead', read_only=True)

    class Meta:
        model = Meeting
        fields = '__all__'
        read_only_fields = ['meeting_owner']

class MessageSerializer(serializers.ModelSerializer):
    lead_details = LeadSerializer(source='lead', read_only=True)

    class Meta:
        model = Message
        fields = '__all__'

class EODReportSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = EODReport
        fields = '__all__'
        read_only_fields = ['user']

