from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random
from .models import CustomUser, PasswordResetOTP
from .serializers import UserSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            if not user.is_approved:
                return Response({'error': 'Account pending admin approval'}, status=status.HTTP_403_FORBIDDEN)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class PendingUsersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only admins can see pending users
        if self.request.user.role == 'Admin':
            return CustomUser.objects.filter(is_approved=False)
        return CustomUser.objects.none()

class ApproveUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if getattr(request.user, 'role', None) != 'Admin':
            return Response({"error": "Only Admins can approve users."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = CustomUser.objects.get(pk=pk, is_approved=False)
            user.is_approved = True
            user.save()
            return Response({"message": "User approved successfully."})
        except CustomUser.DoesNotExist:
            return Response({"error": "Pending user not found."}, status=status.HTTP_404_NOT_FOUND)

class UsersListView(APIView):
    def get(self, request):
        users = CustomUser.objects.filter(is_approved=True)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        # Generate 6 digit OTP
        otp = str(random.randint(100000, 999999))
        
        # Clear old OTPs
        PasswordResetOTP.objects.filter(user=user).delete()
        
        # Save new OTP
        PasswordResetOTP.objects.create(user=user, otp=otp)
        
        # Send Email
        subject = "Password Reset OTP"
        message = f"Your OTP for password reset is {otp}. It is valid for 10 minutes."
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({"error": "Failed to send email. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response({"message": "OTP sent successfully to your email"})

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response({"error": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = CustomUser.objects.get(email=email)
            otp_record = PasswordResetOTP.objects.get(user=user, otp=otp)
            
            # Check expiry (10 mins)
            if timezone.now() > otp_record.created_at + timedelta(minutes=10):
                return Response({"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)
                
            return Response({"message": "OTP verified successfully"})
        except (CustomUser.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({"error": "Invalid email or OTP"}, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        
        if not all([email, otp, new_password]):
            return Response({"error": "Email, OTP and new password are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = CustomUser.objects.get(email=email)
            otp_record = PasswordResetOTP.objects.get(user=user, otp=otp)
            
            if timezone.now() > otp_record.created_at + timedelta(minutes=10):
                return Response({"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)
                
            user.set_password(new_password)
            user.save()
            
            otp_record.delete()
            return Response({"message": "Password reset successfully"})
            
        except (CustomUser.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({"error": "Invalid email or OTP"}, status=status.HTTP_400_BAD_REQUEST)
