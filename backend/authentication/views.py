from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import CustomUser
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
