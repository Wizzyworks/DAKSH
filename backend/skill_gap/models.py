import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from accounts.models import SkillMaster


class GapSeverityEnum(models.TextChoices):
    LOW = 'Low', _('Low')
    MEDIUM = 'Medium', _('Medium')
    HIGH = 'High', _('High')
    CRITICAL = 'Critical', _('Critical')


class ReadinessLevelEnum(models.TextChoices):
    READY = 'Ready', _('Ready')
    MINOR_GAPS = 'Minor Gaps', _('Minor Gaps')
    NEEDS_UP_SKILLING = 'Needs Upskilling', _('Needs Upskilling')
    SIGNIFICANT_GAPS = 'Significant Gaps', _('Significant Gaps')


class SkillImportanceEnum(models.TextChoices):
    MANDATORY = 'mandatory', _('Mandatory')
    PREFERRED = 'preferred', _('Preferred')


class JobRoleTaxonomy(models.Model):
    """
    Benchmark target roles (e.g., SDE-1 Fullstack, Backend Engineer, AI/ML Engineer).
    Matches daksh.job_roles_taxonomy table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role_title = models.CharField(max_length=150)
    role_slug = models.SlugField(max_length=150, unique=True)
    department_domain = models.CharField(max_length=100, null=True, blank=True)
    industry = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    seniority_level = models.CharField(max_length=50, null=True, blank=True)
    standard_required_skills = models.JSONField(null=True, blank=True, help_text=_('List of required canonical skill names'))
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'job_roles_taxonomy'
        verbose_name = _('Job Role Taxonomy')
        verbose_name_plural = _('Job Roles Taxonomy')
        ordering = ['role_title']

    def __str__(self):
        return self.role_title


class RoleSkillRequirement(models.Model):
    """
    Skill benchmarks per role with weightages and minimum scores.
    Matches daksh.role_skill_requirements table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.ForeignKey(JobRoleTaxonomy, on_delete=models.CASCADE, related_name='skill_requirements')
    skill = models.ForeignKey(SkillMaster, on_delete=models.CASCADE, related_name='role_requirements')
    importance = models.CharField(
        max_length=20,
        choices=SkillImportanceEnum.choices,
        default=SkillImportanceEnum.MANDATORY
    )
    benchmark_score_min = models.DecimalField(max_digits=5, decimal_places=2, default=70.00)
    weightage = models.DecimalField(max_digits=3, decimal_places=2, default=1.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'role_skill_requirements'
        verbose_name = _('Role Skill Requirement')
        verbose_name_plural = _('Role Skill Requirements')
        unique_together = ('role', 'skill')

    def __str__(self):
        return f"{self.role.role_title} -> {self.skill.canonical_name} ({self.importance})"


class TargetJobDescription(models.Model):
    """
    Custom user-pasted or URL-scraped Job Description.
    Matches daksh.target_job_descriptions table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='target_jds')
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200, null=True, blank=True)
    raw_jd_text = models.TextField()
    jd_source_url = models.TextField(null=True, blank=True)
    extracted_skills = models.JSONField(null=True, blank=True, help_text=_('JSON extracted skills from LLM'))
    experience_required_years = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    parsed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'target_job_descriptions'
        verbose_name = _('Target Job Description')
        verbose_name_plural = _('Target Job Descriptions')
        ordering = ['-parsed_at']

    def __str__(self):
        return f"{self.job_title} ({self.company_name or 'Custom JD'})"


class SkillGapReport(models.Model):
    """
    Comprehensive Skill Gap Analysis Audit summary report.
    Matches daksh.skill_gap_reports table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skill_gap_reports')
    target_role = models.ForeignKey(JobRoleTaxonomy, on_delete=models.SET_NULL, null=True, blank=True, related_name='gap_reports')
    target_jd = models.ForeignKey(TargetJobDescription, on_delete=models.SET_NULL, null=True, blank=True, related_name='gap_reports')
    overall_match_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    readiness_level = models.CharField(
        max_length=30,
        choices=ReadinessLevelEnum.choices,
        default=ReadinessLevelEnum.NEEDS_UP_SKILLING
    )
    total_required_skills = models.IntegerField(default=0)
    skills_matched_count = models.IntegerField(default=0)
    skills_gap_count = models.IntegerField(default=0)
    analysis_summary = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'skill_gap_reports'
        verbose_name = _('Skill Gap Report')
        verbose_name_plural = _('Skill Gap Reports')
        ordering = ['-created_at']

    def __str__(self):
        return f"Report {self.id} for {self.user.email} - Match: {self.overall_match_score}%"


class SkillGapItem(models.Model):
    """
    Granular per-skill gap breakdown.
    Matches daksh.skill_gap_items table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(SkillGapReport, on_delete=models.CASCADE, related_name='gap_items')
    skill = models.ForeignKey(SkillMaster, on_delete=models.CASCADE, related_name='gap_occurrences')
    user_current_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    required_score = models.DecimalField(max_digits=5, decimal_places=2, default=80.00)
    gap_severity = models.CharField(
        max_length=20,
        choices=GapSeverityEnum.choices,
        default=GapSeverityEnum.MEDIUM
    )
    recommended_action = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'skill_gap_items'
        verbose_name = _('Skill Gap Item')
        verbose_name_plural = _('Skill Gap Items')
        ordering = ['-gap_severity', 'skill__canonical_name']

    def __str__(self):
        return f"Gap in {self.skill.canonical_name} ({self.gap_severity})"
