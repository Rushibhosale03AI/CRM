from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'name', 'phone_number', 'role', 'is_approved', 'theme', 'email_notifications']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = 'Sales Representative'
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            name=validated_data.get('name', ''),
            password=validated_data['password'],
            role=role,
            is_approved=False
        )
        return user


