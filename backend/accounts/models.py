import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from .managers import UserManager


class UserRole(models.TextChoices):
    CANDIDATE = 'candidate', _('Candidate')
    MENTOR = 'mentor', _('Mentor')
    ADMIN = 'admin', _('Admin')


class ProficiencyEnum(models.TextChoices):
    BEGINNER = 'beginner', _('Beginner')
    INTERMEDIATE = 'intermediate', _('Intermediate')
    ADVANCED = 'advanced', _('Advanced')


class SkillSourceEnum(models.TextChoices):
    CV = 'cv', _('CV')
    GITHUB = 'github', _('GitHub')
    QUIZ = 'quiz', _('Quiz')
    INTERVIEW = 'interview', _('Interview')
    SELF = 'self', _('Self')


class SkillCategoryEnum(models.TextChoices):
    TECHNICAL = 'technical', _('Technical')
    DOMAIN = 'domain', _('Domain')
    SOFT = 'soft', _('Soft')
    TOOL = 'tool', _('Tool')


class User(AbstractBaseUser, PermissionsMixin):
    """
    Core User model matching daksh.users table.
    Uses email as the unique identifier.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), max_length=255, unique=True, db_index=True)
    password = models.CharField(_('password'), max_length=255, db_column='password_hash')
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CANDIDATE,
        help_text=_('Designates role of the user (candidate, mentor, admin).')
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_('Designates whether this user should be treated as active.')
    )
    is_verified = models.BooleanField(
        _('verified'),
        default=False,
        help_text=_('Designates whether this user has verified their email/account.')
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into the Django admin site.')
    )
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.role})"


class UserProfile(models.Model):
    """
    Detailed Profile model matching daksh.user_profiles table.
    Stores candidate academic info, aspirations, career targets, and socials.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profile',
        db_column='user_id'
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    college_name = models.CharField(max_length=255, blank=True, null=True)
    college_tier = models.CharField(max_length=20, blank=True, null=True)
    degree = models.CharField(max_length=100, blank=True, null=True)
    branch_discipline = models.CharField(max_length=150, blank=True, null=True)
    current_status = models.CharField(max_length=50, blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    current_semester = models.CharField(max_length=20, blank=True, null=True)
    experience_months = models.IntegerField(default=0)
    target_role = models.CharField(max_length=150, blank=True, null=True)
    target_company_types = models.JSONField(default=list, blank=True)
    raw_resume_url = models.TextField(blank=True, null=True)
    github_url = models.CharField(max_length=255, blank=True, null=True)
    linkedin_url = models.CharField(max_length=255, blank=True, null=True)
    portfolio_url = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profiles'
        verbose_name = _('User Profile')
        verbose_name_plural = _('User Profiles')

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_onboarded(self):
        """
        Check if basic onboarding criteria are met:
        - Academic details (college, degree, graduation_year)
        - Career goals (target_role)
        - Skills added (at least 1 user skill)
        """
        has_academic = bool(self.college_name and self.degree and self.graduation_year)
        has_career = bool(self.target_role)
        has_skills = self.user.user_skills.exists()
        return bool(has_academic and has_career and has_skills)

    @property
    def onboarding_completion_percentage(self):
        """Calculates percentage of onboarding completion (0-100%)."""
        steps = [
            bool(self.first_name and self.last_name),
            bool(self.college_name and self.degree and self.graduation_year),
            bool(self.target_role),
            bool(self.user.user_skills.exists()),
            bool(self.github_url or self.linkedin_url or self.raw_resume_url or self.portfolio_url)
        ]
        completed = sum(1 for step in steps if step)
        return int((completed / len(steps)) * 100)

    @property
    def onboarding_breakdown(self):
        return {
            'personal_info': bool(self.first_name and self.last_name),
            'academic_info': bool(self.college_name and self.degree and self.graduation_year),
            'career_goals': bool(self.target_role),
            'skills_selected': self.user.user_skills.exists(),
            'links_and_resume': bool(self.github_url or self.linkedin_url or self.raw_resume_url or self.portfolio_url),
            'completion_percentage': self.onboarding_completion_percentage,
            'is_onboarded': self.is_onboarded,
        }


class UserGamificationProfile(models.Model):
    """
    Gamification profile model matching daksh.user_gamification_profile table.
    Tracks XP, daily streaks, tier badges, and active days.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='gamification',
        db_column='user_id'
    )
    total_xp = models.IntegerField(default=0)
    current_streak_days = models.IntegerField(default=0)
    longest_streak_days = models.IntegerField(default=0)
    last_active_date = models.DateField(blank=True, null=True)
    tier_badge = models.CharField(max_length=50, default='Bronze')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_gamification_profile'
        verbose_name = _('Gamification Profile')
        verbose_name_plural = _('Gamification Profiles')

    def __str__(self):
        return f"{self.user.email} - {self.tier_badge} ({self.total_xp} XP)"


class SkillMaster(models.Model):
    """
    Skills master taxonomy table matching daksh.skills_master.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    canonical_name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=150, unique=True)
    category = models.CharField(
        max_length=20,
        choices=SkillCategoryEnum.choices,
        default=SkillCategoryEnum.TECHNICAL
    )
    description = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'skills_master'
        verbose_name = _('Skill Master')
        verbose_name_plural = _('Skills Master')
        ordering = ['canonical_name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.canonical_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.canonical_name} ({self.category})"


class UserSkill(models.Model):
    """
    User skill relationship model matching daksh.user_skills table.
    Connects a user to master skills with proficiency and evaluation score.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_skills',
        db_column='user_id'
    )
    skill = models.ForeignKey(
        SkillMaster,
        on_delete=models.RESTRICT,
        related_name='user_skills',
        db_column='skill_id'
    )
    proficiency = models.CharField(
        max_length=20,
        choices=ProficiencyEnum.choices,
        default=ProficiencyEnum.BEGINNER
    )
    source = models.CharField(
        max_length=20,
        choices=SkillSourceEnum.choices,
        default=SkillSourceEnum.SELF
    )
    verified = models.BooleanField(default=False)
    score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_skills'
        verbose_name = _('User Skill')
        verbose_name_plural = _('User Skills')
        unique_together = ('user', 'skill')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.skill.canonical_name} ({self.proficiency})"
