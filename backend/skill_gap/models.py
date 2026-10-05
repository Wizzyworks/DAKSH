"""
Models for Skill Gap Analysis domain matching PostgreSQL 'daksh' schema.
"""

import uuid
from django.db import models
from django.conf import settings


# Text Choices matching PostgreSQL ENUM types
class SkillCategory(models.TextChoices):
    TECHNICAL = 'technical', 'Technical'
    DOMAIN = 'domain', 'Domain'
    SOFT = 'soft', 'Soft'
    TOOL = 'tool', 'Tool'


class SkillImportance(models.TextChoices):
    MANDATORY = 'mandatory', 'Mandatory'
    PREFERRED = 'preferred', 'Preferred'


class Proficiency(models.TextChoices):
    BEGINNER = 'beginner', 'Beginner'
    INTERMEDIATE = 'intermediate', 'Intermediate'
    ADVANCED = 'advanced', 'Advanced'


class SkillSource(models.TextChoices):
    CV = 'cv', 'CV/Resume'
    GITHUB = 'github', 'GitHub Analysis'
    QUIZ = 'quiz', 'Quiz Assessment'
    INTERVIEW = 'interview', 'Interview Evaluation'
    SELF = 'self', 'Self Identified'


class GapSeverity(models.TextChoices):
    LOW = 'Low', 'Low'
    MEDIUM = 'Medium', 'Medium'
    HIGH = 'High', 'High'
    CRITICAL = 'Critical', 'Critical'


class ReadinessLevel(models.TextChoices):
    JOB_READY = 'job_ready', 'Job Ready'
    MINOR_GAPS = 'minor_gaps', 'Minor Gaps'
    CRITICAL_GAPS = 'critical_gaps', 'Critical Gaps'


class UserRole(models.TextChoices):
    CANDIDATE = 'candidate', 'Candidate'
    MENTOR = 'mentor', 'Mentor'
    ADMIN = 'admin', 'Admin'


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.CharField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=UserRole.choices, default=UserRole.CANDIDATE)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'daksh.users' if not settings.USE_SQLITE else 'users'
        managed = False if not settings.USE_SQLITE else True

    def __str__(self):
        return self.email


class SkillMaster(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    canonical_name = models.CharField(max_length=150)
    slug = models.CharField(max_length=150, unique=True)
    category = models.CharField(max_length=50, choices=SkillCategory.choices)
    description = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daksh.skills_master' if not settings.USE_SQLITE else 'skills_master'
        managed = False if not settings.USE_SQLITE else True

    def __str__(self):
        return self.canonical_name


class JobRoleTaxonomy(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role_title = models.CharField(max_length=150)
    role_slug = models.CharField(max_length=150, unique=True)
    department_domain = models.CharField(max_length=100, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    seniority_level = models.CharField(max_length=50, blank=True, null=True)
    standard_required_skills = models.JSONField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daksh.job_roles_taxonomy' if not settings.USE_SQLITE else 'job_roles_taxonomy'
        managed = False if not settings.USE_SQLITE else True

    def __str__(self):
        return self.role_title


class RoleSkillRequirement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.ForeignKey(JobRoleTaxonomy, on_delete=models.CASCADE, related_name='skill_requirements')
    skill = models.ForeignKey(SkillMaster, on_delete=models.RESTRICT, related_name='role_requirements')
    importance = models.CharField(max_length=50, choices=SkillImportance.choices, default=SkillImportance.MANDATORY)
    benchmark_score_min = models.DecimalField(max_digits=5, decimal_places=2, default=70.00)
    weightage = models.DecimalField(max_digits=3, decimal_places=2, default=1.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daksh.role_skill_requirements' if not settings.USE_SQLITE else 'role_skill_requirements'
        managed = False if not settings.USE_SQLITE else True

    def __str__(self):
        return f"{self.role.role_title} - {self.skill.canonical_name}"


class UserSkill(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(SkillMaster, on_delete=models.RESTRICT, related_name='user_skills')
    proficiency = models.CharField(max_length=50, choices=Proficiency.choices, default=Proficiency.BEGINNER)
    source = models.CharField(max_length=50, choices=SkillSource.choices, default=SkillSource.SELF)
    verified = models.BooleanField(default=False)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'daksh.user_skills' if not settings.USE_SQLITE else 'user_skills'
        managed = False if not settings.USE_SQLITE else True

    def __str__(self):
        return f"User({self.user_id}) - Skill({self.skill.canonical_name}): {self.score}"


class SkillGapReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gap_reports')
    target_role = models.ForeignKey(JobRoleTaxonomy, on_delete=models.SET_NULL, null=True, blank=True, related_name='gap_reports')
    target_jd_id = models.UUIDField(null=True, blank=True)  # Reference to target_job_descriptions if applicable
    overall_match_score = models.DecimalField(max_digits=5, decimal_places=2)
    readiness_level = models.CharField(max_length=50, choices=ReadinessLevel.choices)
    total_required_skills = models.IntegerField()
    skills_matched_count = models.IntegerField()
    skills_gap_count = models.IntegerField()
    analysis_summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daksh.skill_gap_reports' if not settings.USE_SQLITE else 'skill_gap_reports'
        managed = False if not settings.USE_SQLITE else True

    def __str__(self):
        return f"GapReport({self.id}) - Match: {self.overall_match_score}%"


class SkillGapItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(SkillGapReport, on_delete=models.CASCADE, related_name='items')
    skill = models.ForeignKey(SkillMaster, on_delete=models.RESTRICT, related_name='gap_items')
    user_current_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    required_score = models.DecimalField(max_digits=5, decimal_places=2)
    gap_severity = models.CharField(max_length=50, choices=GapSeverity.choices)
    recommended_action = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daksh.skill_gap_items' if not settings.USE_SQLITE else 'skill_gap_items'
        managed = False if not settings.USE_SQLITE else True

    def __str__(self):
        return f"GapItem({self.skill.canonical_name}): Severity {self.gap_severity}"
