from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Sales Representative', 'Sales Representative'),
    )
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Sales Representative')
    is_approved = models.BooleanField(default=False)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    theme = models.CharField(max_length=20, default='system')
    email_notifications = models.BooleanField(default=True)

    def __str__(self):
        return self.name or self.username

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.otp}"
