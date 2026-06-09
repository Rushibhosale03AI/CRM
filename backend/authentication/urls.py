from django.urls import path
from .views import RegisterView, LoginView, UserDetailView, PendingUsersView, ApproveUserView, UsersListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('pending-users/', PendingUsersView.as_view(), name='pending_users'),
    path('approve-user/<int:pk>/', ApproveUserView.as_view(), name='approve_user'),
    path('users/', UsersListView.as_view(), name='users_list'),
]
