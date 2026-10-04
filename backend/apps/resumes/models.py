import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class ResumeModeEnum(models.TextChoices):
    REFORMAT = 'reformat', _('Reformat')
    GENERATE = 'generate', _('Generate')
    OPTIMIZE = 'optimize', _('Optimize')


class ResumeTemplateEnum(models.TextChoices):
    CLASSIC = 'classic', _('Classic')
    MODERN = 'modern', _('Modern')
    TECHNICAL = 'technical', _('Technical')


class CompilationStatusEnum(models.TextChoices):
    PENDING = 'pending', _('Pending')
    SUCCESS = 'success', _('Success')
    FAILED = 'failed', _('Failed')


class TargetJobDescription(models.Model):
    """
    Candidate target job description inputs matching daksh.target_job_descriptions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='target_jds',
        db_column='user_id'
    )
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200, blank=True, null=True)
    raw_jd_text = models.TextField()
    jd_source_url = models.TextField(blank=True, null=True)
    extracted_skills = models.JSONField(default=list, blank=True, null=True)
    experience_required_years = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    parsed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'target_job_descriptions'
        verbose_name = _('Target Job Description')
        verbose_name_plural = _('Target Job Descriptions')
        ordering = ['-parsed_at']

    def __str__(self):
        return f"{self.job_title} @ {self.company_name or 'Unknown'} ({self.user.email})"


class ResumeMaster(models.Model):
    """
    Candidate resume instances matching daksh.resumes_master.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes',
        db_column='user_id'
    )
    resume_title = models.CharField(max_length=200)
    version_number = models.IntegerField(default=1)
    mode = models.CharField(
        max_length=20,
        choices=ResumeModeEnum.choices,
        default=ResumeModeEnum.GENERATE
    )
    template_name = models.CharField(
        max_length=20,
        choices=ResumeTemplateEnum.choices,
        default=ResumeTemplateEnum.MODERN
    )
    target_jd = models.ForeignKey(
        TargetJobDescription,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        db_column='target_jd_id'
    )
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resumes_master'
        verbose_name = _('Resume Master')
        verbose_name_plural = _('Resumes Master')
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.resume_title} v{self.version_number} ({self.user.email})"


class ResumeStructuredContent(models.Model):
    """
    Parsed/structured resume content matching daksh.resume_structured_content.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resume = models.OneToOneField(
        ResumeMaster,
        on_delete=models.CASCADE,
        related_name='structured_content',
        db_column='resume_id'
    )
    contact_info = models.JSONField(default=dict, blank=True)
    professional_summary = models.TextField(blank=True, null=True)
    experience = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    publications_awards = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resume_structured_content'
        verbose_name = _('Resume Structured Content')
        verbose_name_plural = _('Resume Structured Contents')

    def __str__(self):
        return f"Structured content for resume {self.resume_id}"


class ResumeCompilation(models.Model):
    """
    LaTeX source and compiled PDF status matching daksh.resume_compilations.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resume = models.ForeignKey(
        ResumeMaster,
        on_delete=models.CASCADE,
        related_name='compilations',
        db_column='resume_id'
    )
    latex_source_code = models.TextField()
    compiled_pdf_url = models.TextField(blank=True, null=True)
    compilation_status = models.CharField(
        max_length=20,
        choices=CompilationStatusEnum.choices,
        default=CompilationStatusEnum.PENDING
    )
    compiler_log = models.TextField(blank=True, null=True)
    compiled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resume_compilations'
        verbose_name = _('Resume Compilation')
        verbose_name_plural = _('Resume Compilations')
        ordering = ['-compiled_at']

    def __str__(self):
        return f"Compilation for {self.resume.resume_title}: {self.compilation_status}"


class ResumeATSAudit(models.Model):
    """
    ATS score, audit metrics, and suggestions matching daksh.resume_ats_audits.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resume = models.ForeignKey(
        ResumeMaster,
        on_delete=models.CASCADE,
        related_name='ats_audits',
        db_column='resume_id'
    )
    target_jd = models.ForeignKey(
        TargetJobDescription,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        db_column='target_jd_id'
    )
    overall_ats_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    format_safety_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    section_headers_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    keyword_match_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    bullet_quant_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    matched_keywords = models.JSONField(default=list, blank=True)
    missing_keywords = models.JSONField(default=list, blank=True)
    actionable_recommendations = models.JSONField(default=list, blank=True)
    audited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resume_ats_audits'
        verbose_name = _('Resume ATS Audit')
        verbose_name_plural = _('Resume ATS Audits')
        ordering = ['-audited_at']

    def __str__(self):
        return f"ATS Audit: {self.overall_ats_score}% for {self.resume.resume_title}"
