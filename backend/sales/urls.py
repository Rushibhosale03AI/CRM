from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LeadViewSet, CustomerViewSet, ContactViewSet, 
    TodoViewSet, CallViewSet, MeetingViewSet, MessageViewSet,
    ImportLeadsView, ExportLeadsView, EODReportViewSet, DownloadLeadTemplateView
)

router = DefaultRouter()
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'todos', TodoViewSet, basename='todo')
router.register(r'calls', CallViewSet, basename='call')
router.register(r'meetings', MeetingViewSet, basename='meeting')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'eod-reports', EODReportViewSet, basename='eod-report')

urlpatterns = [
    path('leads/import/', ImportLeadsView.as_view(), name='import_leads'),
    path('leads/export/', ExportLeadsView.as_view(), name='export_leads'),
    path('leads/template/', DownloadLeadTemplateView.as_view(), name='lead_template'),
    path('', include(router.urls)),
]



