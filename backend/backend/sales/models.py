from django.db import models
from django.conf import settings

class Lead(models.Model):
    industry = models.CharField(max_length=100, null=True, blank=True)
    contact_name = models.CharField(max_length=255, null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    email_address = models.EmailField(null=True, blank=True)
    contact_no = models.CharField(max_length=20, null=True, blank=True)
    designation = models.CharField(max_length=255, null=True, blank=True)
    meeting_date = models.CharField(max_length=100, null=True, blank=True)
    ae_assigned = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    status = models.CharField(max_length=100, null=True, blank=True)
    outcome = models.CharField(max_length=100, null=True, blank=True)
    linkedin_connect = models.CharField(max_length=255, null=True, blank=True)
    demo_call = models.CharField(max_length=100, null=True, blank=True)
    proposal_sent = models.CharField(max_length=100, null=True, blank=True)
    closures = models.CharField(max_length=100, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.contact_name or 'Unknown Contact'} ({self.company_name or 'No Company'})"

class Customer(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Closed', 'Closed'),
    )
    customer_owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='customers')
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100, null=True, blank=True)
    lead = models.ForeignKey(Lead, on_delete=models.SET_NULL, null=True, blank=True, related_name='customers')
    mobile = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    gst_number = models.CharField(max_length=50, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, null=True, blank=True)
    
    # Address Info
    street = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    
    description = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Contact(models.Model):
    name = models.CharField(max_length=255)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True, related_name='contacts')
    job_title = models.CharField(max_length=100, null=True, blank=True)
    mobile = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    lead_source = models.CharField(max_length=100, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Todo(models.Model):
    PRIORITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    )
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
    )
    title = models.CharField(max_length=255)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='todos_owned')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='todos_assigned')
    due_date = models.DateTimeField()
    reminder_time = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Call(models.Model):
    STATUS_CHOICES = (
        ('Scheduled', 'Scheduled'),
        ('In Progress', 'In Progress'),
        ('Closed', 'Closed'),
    )
    title = models.CharField(max_length=255)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, null=True, blank=True, related_name='calls')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True, related_name='calls')
    call_owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='calls_owned')
    start_date = models.DateTimeField()
    reminder_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    call_outcome = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Meeting(models.Model):
    STATUS_CHOICES = (
        ('Scheduled', 'Scheduled'),
        ('In Progress', 'In Progress'),
        ('Closed', 'Closed'),
    )
    title = models.CharField(max_length=255)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, null=True, blank=True, related_name='meetings')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True, related_name='meetings')
    meeting_owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='meetings_owned')
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    meeting_outcome = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Message(models.Model):
    DIRECTION_CHOICES = (
        ('Inbound', 'Inbound'),
        ('Outbound', 'Outbound'),
    )
    PLATFORM_CHOICES = (
        ('WhatsApp', 'WhatsApp'),
        ('Email', 'Email'),
    )
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    direction = models.CharField(max_length=10, choices=DIRECTION_CHOICES)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    message_body = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.platform} message"


class EODReport(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='eod_reports')
    
    # Evening Report (Actuals)
    calls_done = models.CharField(max_length=255, null=True, blank=True)
    emails_sent = models.CharField(max_length=255, null=True, blank=True)
    follow_ups_done = models.CharField(max_length=255, null=True, blank=True)
    meetings_fixed = models.CharField(max_length=255, null=True, blank=True)
    meetings_attended = models.CharField(max_length=255, null=True, blank=True)
    pipeline_added = models.CharField(max_length=255, null=True, blank=True)
    key_highlights = models.TextField(null=True, blank=True)
    
    # Objective Daily Reporting (Targets)
    target_calls = models.CharField(max_length=255, null=True, blank=True)
    target_emails = models.CharField(max_length=255, null=True, blank=True)
    target_follow_ups = models.CharField(max_length=255, null=True, blank=True)
    target_meetings = models.CharField(max_length=255, null=True, blank=True)
    key_deals_focus = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"EOD Report - {self.user.name} - {self.created_at.strftime('%Y-%m-%d')}"
