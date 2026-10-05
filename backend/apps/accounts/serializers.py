from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, UserGamificationProfile, UserSkill, UserRole, ProficiencyEnum, SkillSourceEnum
from ..skills.models import SkillMaster

User = get_user_model()


class UserSkillSerializer(serializers.ModelSerializer):
    """
    Serializer for UserSkill items with nested skill metadata.
    """
    skill_id = serializers.UUIDField(source='skill.id', read_only=True)
    canonical_name = serializers.CharField(source='skill.canonical_name', read_only=True)
    category = serializers.CharField(source='skill.category', read_only=True)

    class Meta:
        model = UserSkill
        fields = [
            'id',
            'skill_id',
            'canonical_name',
            'category',
            'proficiency',
            'source',
            'verified',
            'score',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserGamificationProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for candidate gamification & streak records.
    """
    class Meta:
        model = UserGamificationProfile
        fields = [
            'total_xp',
            'current_streak_days',
            'longest_streak_days',
            'last_active_date',
            'tier_badge',
            'updated_at',
        ]
        read_only_fields = ['updated_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for full UserProfile details with onboarding metrics.
    """
    full_name = serializers.ReadOnlyField()
    is_onboarded = serializers.ReadOnlyField()
    onboarding_completion_percentage = serializers.ReadOnlyField()
    onboarding_breakdown = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = [
            'first_name',
            'last_name',
            'full_name',
            'phone_number',
            'college_name',
            'college_tier',
            'degree',
            'branch_discipline',
            'current_status',
            'graduation_year',
            'current_semester',
            'experience_months',
            'target_role',
            'target_company_types',
            'raw_resume_url',
            'github_url',
            'linkedin_url',
            'portfolio_url',
            'bio',
            'is_onboarded',
            'onboarding_completion_percentage',
            'onboarding_breakdown',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Comprehensive User Serializer returning user account, profile, gamification & skills.
    """
    profile = UserProfileSerializer(read_only=True)
    gamification = UserGamificationProfileSerializer(read_only=True)
    skills = UserSkillSerializer(source='user_skills', many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'role',
            'is_active',
            'is_verified',
            'profile',
            'gamification',
            'skills',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    """
    Registration serializer handling User creation, initial profile, and JWT token issuing.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(required=True, max_length=100)
    last_name = serializers.CharField(required=True, max_length=100)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=20)
    role = serializers.ChoiceField(choices=UserRole.choices, default=UserRole.CANDIDATE)

    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'confirm_password',
            'first_name',
            'last_name',
            'phone_number',
            'role',
        ]

    def validate(self, attrs):
        confirm_password = attrs.get('confirm_password')
        if confirm_password and attrs['password'] != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        phone_number = validated_data.pop('phone_number', None)

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', UserRole.CANDIDATE)
        )

        # Update profile with provided names and phone
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.first_name = first_name
        profile.last_name = last_name
        profile.phone_number = phone_number
        profile.save()
        user.profile = profile

        return user


class LoginSerializer(serializers.Serializer):
    """
    Login serializer validating email and password credentials.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email').strip().lower()
        password = attrs.get('password')

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("This user account is inactive.")

        attrs['user'] = user
        return attrs


class OnboardingSkillItemSerializer(serializers.Serializer):
    """
    Input serializer for individual skill in onboarding.
    Accepts either skill_id or skill_name.
    """
    skill_id = serializers.UUIDField(required=False)
    skill_name = serializers.CharField(required=False, max_length=150)
    category = serializers.ChoiceField(choices=['technical', 'domain', 'soft', 'tool'], default='technical')
    proficiency = serializers.ChoiceField(
        choices=ProficiencyEnum.choices,
        default=ProficiencyEnum.BEGINNER
    )
    source = serializers.ChoiceField(
        choices=SkillSourceEnum.choices,
        default=SkillSourceEnum.SELF
    )


class OnboardingSerializer(serializers.Serializer):
    """
    Multi-step or all-in-one Onboarding submission serializer.
    """
    # Personal & Academic
    first_name = serializers.CharField(required=False, max_length=100)
    last_name = serializers.CharField(required=False, max_length=100)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=20)
    college_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    college_tier = serializers.CharField(required=False, allow_blank=True, max_length=20)
    degree = serializers.CharField(required=False, allow_blank=True, max_length=100)
    branch_discipline = serializers.CharField(required=False, allow_blank=True, max_length=150)
    current_status = serializers.CharField(required=False, allow_blank=True, max_length=50)
    graduation_year = serializers.IntegerField(required=False, allow_null=True)
    current_semester = serializers.CharField(required=False, allow_blank=True, max_length=20)
    experience_months = serializers.IntegerField(required=False, default=0)

    # Career Aspirations
    target_role = serializers.CharField(required=False, allow_blank=True, max_length=150)
    target_company_types = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )
    bio = serializers.CharField(required=False, allow_blank=True)

    # Socials & Portfolios
    github_url = serializers.CharField(required=False, allow_blank=True, max_length=255)
    linkedin_url = serializers.CharField(required=False, allow_blank=True, max_length=255)
    portfolio_url = serializers.CharField(required=False, allow_blank=True, max_length=255)
    raw_resume_url = serializers.CharField(required=False, allow_blank=True)

    # Skills
    skills = OnboardingSkillItemSerializer(many=True, required=False, default=list)

    def save(self, user):
        profile, _ = UserProfile.objects.get_or_create(user=user)

        # Fields to update on profile
        profile_fields = [
            'first_name', 'last_name', 'phone_number', 'college_name', 'college_tier',
            'degree', 'branch_discipline', 'current_status', 'graduation_year',
            'current_semester', 'experience_months', 'target_role', 'target_company_types',
            'raw_resume_url', 'github_url', 'linkedin_url', 'portfolio_url', 'bio'
        ]

        for field in profile_fields:
            if field in self.validated_data:
                setattr(profile, field, self.validated_data[field])

        profile.save()

        # Process skills if supplied
        skills_data = self.validated_data.get('skills', [])
        for item in skills_data:
            skill_obj = None
            if item.get('skill_id'):
                skill_obj = SkillMaster.objects.filter(id=item['skill_id']).first()
            elif item.get('skill_name'):
                skill_name = item['skill_name'].strip()
                skill_obj, _ = SkillMaster.objects.get_or_create(
                    canonical_name__iexact=skill_name,
                    defaults={
                        'canonical_name': skill_name,
                        'category': item.get('category', 'technical')
                    }
                )

            if skill_obj:
                UserSkill.objects.update_or_create(
                    user=user,
                    skill=skill_obj,
                    defaults={
                        'proficiency': item.get('proficiency', ProficiencyEnum.BEGINNER),
                        'source': item.get('source', SkillSourceEnum.SELF)
                    }
                )

        # Reward initial onboarding XP if newly completed
        gamification, _ = UserGamificationProfile.objects.get_or_create(user=user)
        if profile.is_onboarded and gamification.total_xp == 0:
            gamification.total_xp += 50
            gamification.save()

        return profile


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for authenticated password change.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    confirm_new_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError({"confirm_new_password": "New passwords do not match."})
        return attrs
