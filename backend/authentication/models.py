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

    def __str__(self):
        return self.name or self.username
