from datetime import date, timedelta
from rest_framework import status, permissions, views
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, UserGamificationProfile, UserSkill, SkillMaster
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    UserDetailSerializer,
    OnboardingSerializer,
    UserSkillSerializer,
    ChangePasswordSerializer,
)

User = get_user_model()


def get_tokens_for_user(user):
    """Generate JWT Access and Refresh tokens for a given user."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def update_user_streak(gamification_profile):
    """Update user daily login streak and active date."""
    today = date.today()
    last_active = gamification_profile.last_active_date

    if last_active is None:
        gamification_profile.current_streak_days = 1
        gamification_profile.longest_streak_days = max(gamification_profile.longest_streak_days, 1)
    elif last_active == today - timedelta(days=1):
        gamification_profile.current_streak_days += 1
        gamification_profile.longest_streak_days = max(
            gamification_profile.longest_streak_days,
            gamification_profile.current_streak_days
        )
    elif last_active < today - timedelta(days=1):
        gamification_profile.current_streak_days = 1

    gamification_profile.last_active_date = today
    gamification_profile.save(update_fields=['current_streak_days', 'longest_streak_days', 'last_active_date'])


class RegisterView(views.APIView):
    """
    POST /api/auth/register/
    Registers a new candidate/user account and returns auth tokens + initial profile.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            user = User.objects.select_related('profile', 'gamification').get(id=user.id)
            user_data = UserDetailSerializer(user).data
            return Response({
                'message': 'Registration successful. Welcome to DAKSH!',
                'tokens': tokens,
                'user': user_data,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    """
    POST /api/auth/login/
    Authenticates user with email and password, returning JWT tokens and profile.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)

            # Update gamification streak
            gamification, _ = UserGamificationProfile.objects.get_or_create(user=user)
            update_user_streak(gamification)

            user = User.objects.select_related('profile', 'gamification').get(id=user.id)
            user_data = UserDetailSerializer(user).data
            return Response({
                'message': 'Login successful.',
                'tokens': tokens,
                'user': user_data,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(views.APIView):
    """
    GET /api/auth/me/
    Returns the currently authenticated user's profile, gamification stats, and onboarding status.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = User.objects.select_related('profile', 'gamification').prefetch_related('user_skills__skill').get(id=request.user.id)
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserProfileView(views.APIView):
    """
    GET /api/auth/profile/ - Retrieve current user profile
    PUT / PATCH /api/auth/profile/ - Update current user profile
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully.',
                'profile': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        return self.patch(request)


class OnboardingStatusView(views.APIView):
    """
    GET /api/auth/onboarding/status/
    Retrieves the candidate's onboarding progress and step breakdown.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        user_skills = UserSkill.objects.filter(user=request.user)
        skills_data = UserSkillSerializer(user_skills, many=True).data

        steps = {
            'personal_info': {
                'completed': bool(profile.first_name and profile.last_name),
                'data': {
                    'first_name': profile.first_name,
                    'last_name': profile.last_name,
                    'phone_number': profile.phone_number,
                }
            },
            'academic_info': {
                'completed': bool(profile.college_name and profile.degree and profile.graduation_year),
                'data': {
                    'college_name': profile.college_name,
                    'college_tier': profile.college_tier,
                    'degree': profile.degree,
                    'branch_discipline': profile.branch_discipline,
                    'graduation_year': profile.graduation_year,
                    'current_semester': profile.current_semester,
                    'current_status': profile.current_status,
                }
            },
            'career_goals': {
                'completed': bool(profile.target_role),
                'data': {
                    'target_role': profile.target_role,
                    'target_company_types': profile.target_company_types,
                    'experience_months': profile.experience_months,
                    'bio': profile.bio,
                }
            },
            'skills': {
                'completed': user_skills.exists(),
                'count': user_skills.count(),
                'data': skills_data,
            },
            'links_and_resume': {
                'completed': bool(profile.github_url or profile.linkedin_url or profile.portfolio_url or profile.raw_resume_url),
                'data': {
                    'github_url': profile.github_url,
                    'linkedin_url': profile.linkedin_url,
                    'portfolio_url': profile.portfolio_url,
                    'raw_resume_url': profile.raw_resume_url,
                }
            }
        }

        return Response({
            'is_onboarded': profile.is_onboarded,
            'completion_percentage': profile.onboarding_completion_percentage,
            'steps': steps
        }, status=status.HTTP_200_OK)


class OnboardingSubmitView(views.APIView):
    """
    POST /api/auth/onboarding/
    Submits onboarding payload (academic info, career targets, socials, skills).
    Can be called for multi-step progress or single full onboarding submit.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = OnboardingSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save(user=request.user)
            user = User.objects.select_related('profile', 'gamification').prefetch_related('user_skills__skill').get(id=request.user.id)
            user_data = UserDetailSerializer(user).data
            return Response({
                'message': 'Onboarding details saved successfully.',
                'is_onboarded': profile.is_onboarded,
                'completion_percentage': profile.onboarding_completion_percentage,
                'user': user_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSkillsManagementView(views.APIView):
    """
    GET /api/auth/skills/ - List authenticated user's skills
    POST /api/auth/skills/ - Add or update a user skill
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_skills = UserSkill.objects.filter(user=request.user)
        serializer = UserSkillSerializer(user_skills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        skill_id = request.data.get('skill_id')
        skill_name = request.data.get('skill_name')
        proficiency = request.data.get('proficiency', 'beginner')
        source = request.data.get('source', 'self')
        category = request.data.get('category', 'technical')

        skill_obj = None
        if skill_id:
            skill_obj = SkillMaster.objects.filter(id=skill_id).first()
            if not skill_obj:
                return Response({'error': 'Skill not found with given skill_id.'}, status=status.HTTP_404_NOT_FOUND)
        elif skill_name:
            skill_name = skill_name.strip()
            skill_obj, _ = SkillMaster.objects.get_or_create(
                canonical_name__iexact=skill_name,
                defaults={
                    'canonical_name': skill_name,
                    'category': category
                }
            )
        else:
            return Response({'error': 'Either skill_id or skill_name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user_skill, created = UserSkill.objects.update_or_create(
            user=request.user,
            skill=skill_obj,
            defaults={
                'proficiency': proficiency,
                'source': source
            }
        )

        serializer = UserSkillSerializer(user_skill)
        msg = 'Skill added to profile.' if created else 'Skill updated.'
        return Response({'message': msg, 'skill': serializer.data}, status=status.HTTP_200_OK)


class UserSkillDeleteView(views.APIView):
    """
    DELETE /api/auth/skills/<skill_id>/
    Removes a skill from the candidate's profile.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, skill_id):
        deleted_count, _ = UserSkill.objects.filter(user=request.user, skill_id=skill_id).delete()
        if deleted_count > 0:
            return Response({'message': 'Skill removed successfully.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Skill not found in your profile.'}, status=status.HTTP_404_NOT_FOUND)


class LogoutView(views.APIView):
    """
    POST /api/auth/logout/
    Blacklists the provided refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'message': 'Logged out.'}, status=status.HTTP_200_OK)


class ChangePasswordView(views.APIView):
    """
    POST /api/auth/change-password/
    Allows an authenticated user to change their account password.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': ['Incorrect current password.']}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
