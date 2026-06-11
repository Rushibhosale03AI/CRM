from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'name', 'role', 'is_approved']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'name', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.get('role', 'Sales Representative')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            name=validated_data.get('name', ''),
            password=validated_data['password'],
            role=role,
            is_approved=(role == 'Admin')
        )
        
        if role == 'Admin':
            user.is_staff = True
            user.is_superuser = True
            user.save()
            
        return user
