from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import UserProfile, UserGamificationProfile, UserSkill
from ..skills.models import SkillMaster, SkillCategoryEnum

User = get_user_model()


class AuthAndOnboardingTests(APITestCase):
    def setUp(self):
        # Create a sample skill in taxonomy
        self.python_skill = SkillMaster.objects.create(
            canonical_name="Python",
            slug="python",
            category=SkillCategoryEnum.TECHNICAL,
            description="Python Programming Language"
        )
        self.django_skill = SkillMaster.objects.create(
            canonical_name="Django",
            slug="django",
            category=SkillCategoryEnum.TECHNICAL,
            description="Django Web Framework"
        )

        # Standard test registration payload
        self.register_data = {
            "email": "candidate@example.com",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!",
            "first_name": "Aarav",
            "last_name": "Sharma",
            "phone_number": "+919876543210",
            "role": "candidate"
        }

    def test_registration_success(self):
        url = reverse('auth:register')
        response = self.client.post(url, self.register_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], "candidate@example.com")
        self.assertEqual(response.data['user']['profile']['first_name'], "Aarav")
        self.assertEqual(response.data['user']['profile']['last_name'], "Sharma")

        # Verify DB records
        user = User.objects.get(email="candidate@example.com")
        self.assertTrue(user.check_password("SecurePassword123!"))
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
        self.assertTrue(UserGamificationProfile.objects.filter(user=user).exists())

    def test_registration_duplicate_email_fails(self):
        url = reverse('auth:register')
        self.client.post(url, self.register_data, format='json')
        response = self.client.post(url, self.register_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_login_success(self):
        # Register first
        self.client.post(reverse('auth:register'), self.register_data, format='json')

        # Login
        url = reverse('auth:login')
        login_data = {
            "email": "candidate@example.com",
            "password": "SecurePassword123!"
        }
        response = self.client.post(url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['email'], "candidate@example.com")

        # Gamification streak check
        user = User.objects.get(email="candidate@example.com")
        self.assertEqual(user.gamification.current_streak_days, 1)

    def test_login_invalid_credentials(self):
        url = reverse('auth:login')
        response = self.client.post(url, {"email": "wrong@example.com", "password": "wrong"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_current_user_and_profile(self):
        # Register and extract token
        reg_res = self.client.post(reverse('auth:register'), self.register_data, format='json')
        token = reg_res.data['tokens']['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(reverse('auth:current_user'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], "candidate@example.com")
        self.assertEqual(response.data['profile']['first_name'], "Aarav")
        self.assertFalse(response.data['profile']['is_onboarded'])

    def test_onboarding_status_and_complete_submission(self):
        # Register user
        reg_res = self.client.post(reverse('auth:register'), self.register_data, format='json')
        token = reg_res.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # 1. Check initial onboarding status
        status_url = reverse('auth:onboarding_status')
        status_res = self.client.get(status_url)
        self.assertEqual(status_res.status_code, status.HTTP_200_OK)
        self.assertFalse(status_res.data['is_onboarded'])
        self.assertIn('steps', status_res.data)

        # 2. Submit complete onboarding
        onboarding_payload = {
            "college_name": "Indian Institute of Technology",
            "college_tier": "Tier-1",
            "degree": "B.Tech",
            "branch_discipline": "Computer Science & Engineering",
            "graduation_year": 2025,
            "current_semester": "7th",
            "current_status": "Final Year Student",
            "experience_months": 6,
            "target_role": "Backend Engineer",
            "target_company_types": ["Product MNC", "High Growth Startup"],
            "github_url": "https://github.com/aaravsharma",
            "linkedin_url": "https://linkedin.com/in/aaravsharma",
            "bio": "Passionate backend engineer with expertise in distributed systems and Python.",
            "skills": [
                {
                    "skill_name": "Python",
                    "proficiency": "intermediate",
                    "source": "self"
                },
                {
                    "skill_id": str(self.django_skill.id),
                    "proficiency": "intermediate",
                    "source": "self"
                }
            ]
        }

        onboard_url = reverse('auth:onboarding_submit')
        onboard_res = self.client.post(onboard_url, onboarding_payload, format='json')
        self.assertEqual(onboard_res.status_code, status.HTTP_200_OK)
        self.assertTrue(onboard_res.data['is_onboarded'])
        self.assertEqual(onboard_res.data['completion_percentage'], 100)

        # Verify user gained 50 XP for onboarding
        user = User.objects.get(email="candidate@example.com")
        self.assertEqual(user.gamification.total_xp, 50)
        self.assertEqual(user.user_skills.count(), 2)

    def test_user_skills_endpoints(self):
        reg_res = self.client.post(reverse('auth:register'), self.register_data, format='json')
        token = reg_res.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        skills_url = reverse('auth:user_skills')

        # Add a skill
        add_res = self.client.post(skills_url, {
            "skill_name": "React.js",
            "proficiency": "advanced",
            "category": "technical"
        }, format='json')
        self.assertEqual(add_res.status_code, status.HTTP_200_OK)

        # List skills
        list_res = self.client.get(skills_url)
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 1)
        skill_id = list_res.data[0]['skill_id']

        # Delete skill
        del_url = reverse('auth:user_skill_delete', kwargs={'skill_id': skill_id})
        del_res = self.client.delete(del_url)
        self.assertEqual(del_res.status_code, status.HTTP_200_OK)

        # Verify empty
        list_res_after = self.client.get(skills_url)
        self.assertEqual(len(list_res_after.data), 0)

    def test_change_password(self):
        reg_res = self.client.post(reverse('auth:register'), self.register_data, format='json')
        token = reg_res.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        change_pwd_url = reverse('auth:change_password')
        response = self.client.post(change_pwd_url, {
            "old_password": "SecurePassword123!",
            "new_password": "BrandNewPassword2026!",
            "confirm_new_password": "BrandNewPassword2026!"
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify login with new password works
        self.client.credentials()  # Clear auth header
        login_res = self.client.post(reverse('auth:login'), {
            "email": "candidate@example.com",
            "password": "BrandNewPassword2026!"
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
