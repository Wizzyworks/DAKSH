from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import (
    RegisterView,
    LoginView,
    CurrentUserView,
    UserProfileView,
    OnboardingStatusView,
    OnboardingSubmitView,
    UserSkillsManagementView,
    UserSkillDeleteView,
    LogoutView,
    ChangePasswordView,
)

app_name = 'accounts'

urlpatterns = [
    # Core Authentication Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Profile & Current User
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('profile/', UserProfileView.as_view(), name='profile'),

    # Candidate Onboarding Endpoints
    path('onboarding/', OnboardingSubmitView.as_view(), name='onboarding_submit'),
    path('onboarding/status/', OnboardingStatusView.as_view(), name='onboarding_status'),

    # User Skills Management
    path('skills/', UserSkillsManagementView.as_view(), name='user_skills'),
    path('skills/<uuid:skill_id>/', UserSkillDeleteView.as_view(), name='user_skill_delete'),
]
