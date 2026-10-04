import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class JobTypeEnum(models.TextChoices):
    FULL_TIME = 'full_time', _('Full Time')
    PART_TIME = 'part_time', _('Part Time')
    INTERNSHIP = 'internship', _('Internship')
    CONTRACT = 'contract', _('Contract')


class AlertFrequencyEnum(models.TextChoices):
    INSTANT = 'instant', _('Instant')
    DAILY = 'daily', _('Daily')
    WEEKLY = 'weekly', _('Weekly')


class MatchStatusEnum(models.TextChoices):
    SUGGESTED = 'suggested', _('Suggested')
    SAVED = 'saved', _('Saved')
    APPLIED = 'applied', _('Applied')
    REJECTED = 'rejected', _('Rejected')


class EventTypeEnum(models.TextChoices):
    HACKATHON = 'hackathon', _('Hackathon')
    SPRINT = 'sprint', _('Sprint')
    WEBINAR = 'webinar', _('Webinar')
    HIRING_CHALLENGE = 'hiring_challenge', _('Hiring Challenge')


class DifficultyLevelEnum(models.TextChoices):
    BEGINNER = 'beginner', _('Beginner')
    INTERMEDIATE = 'intermediate', _('Intermediate')
    ADVANCED = 'advanced', _('Advanced')


class ReadinessLevelEnum(models.TextChoices):
    JOB_READY = 'job_ready', _('Job Ready')
    MINOR_GAPS = 'minor_gaps', _('Minor Gaps')
    CRITICAL_GAPS = 'critical_gaps', _('Critical Gaps')


class GapSeverityEnum(models.TextChoices):
    LOW = 'Low', _('Low')
    MEDIUM = 'Medium', _('Medium')
    HIGH = 'High', _('High')
    CRITICAL = 'Critical', _('Critical')


class JobRoleTaxonomy(models.Model):
    """
    Standard job roles taxonomy matching daksh.job_roles_taxonomy.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role_title = models.CharField(max_length=150)
    role_slug = models.SlugField(max_length=150, unique=True)
    department_domain = models.CharField(max_length=100, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    seniority_level = models.CharField(max_length=50, blank=True, null=True)
    standard_required_skills = models.JSONField(default=list, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'job_roles_taxonomy'
        verbose_name = _('Job Role Taxonomy')
        verbose_name_plural = _('Job Roles Taxonomy')
        ordering = ['role_title']

    def save(self, *args, **kwargs):
        if not self.role_slug:
            self.role_slug = slugify(self.role_title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.role_title} ({self.department_domain or 'General'})"


class JobListing(models.Model):
    """
    Aggregated/Scraped Job Listings matching daksh.job_listings.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    company_logo_url = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=150, blank=True, null=True)
    is_remote = models.BooleanField(default=False)
    job_type = models.CharField(
        max_length=20,
        choices=JobTypeEnum.choices,
        default=JobTypeEnum.FULL_TIME
    )
    experience_min_years = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    experience_max_years = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    salary_currency = models.CharField(max_length=10, default='INR')
    description_raw = models.TextField()
    extracted_skills = models.JSONField(default=list, blank=True, null=True)
    application_url = models.TextField()
    deadline_date = models.DateTimeField(blank=True, null=True)
    date_posted = models.DateTimeField(blank=True, null=True)
    source_platform = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    scraped_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'job_listings'
        verbose_name = _('Job Listing')
        verbose_name_plural = _('Job Listings')
        indexes = [
            models.Index(fields=['is_active'], name='idx_job_listings_active'),
        ]
        ordering = ['-date_posted', '-scraped_at']

    def __str__(self):
        return f"{self.title} @ {self.company_name}"


class JobAlertPreference(models.Model):
    """
    Candidate notification preferences for job alerts matching daksh.job_alert_preferences.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_alert_preferences',
        db_column='user_id'
    )
    role_keywords = models.JSONField(default=list, blank=True)
    preferred_locations = models.JSONField(default=list, blank=True)
    preferred_job_types = models.JSONField(default=list, blank=True)
    min_salary = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    frequency = models.CharField(
        max_length=20,
        choices=AlertFrequencyEnum.choices,
        default=AlertFrequencyEnum.DAILY
    )
    notification_channels = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    last_notified_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'job_alert_preferences'
        verbose_name = _('Job Alert Preference')
        verbose_name_plural = _('Job Alert Preferences')

    def __str__(self):
        return f"Alerts for {self.user.email} ({self.frequency})"


class UserJobMatch(models.Model):
    """
    Candidate-to-job match scores matching daksh.user_job_matches.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_matches',
        db_column='user_id'
    )
    job_listing = models.ForeignKey(
        JobListing,
        on_delete=models.CASCADE,
        related_name='user_matches',
        db_column='job_listing_id'
    )
    match_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    skill_match_ratio = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    experience_match = models.BooleanField(blank=True, null=True)
    match_breakdown_json = models.JSONField(default=dict, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=MatchStatusEnum.choices,
        default=MatchStatusEnum.SUGGESTED
    )
    applied_date = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_job_matches'
        verbose_name = _('User Job Match')
        verbose_name_plural = _('User Job Matches')
        indexes = [
            models.Index(fields=['user', '-match_percentage'], name='idx_user_job_matches_user'),
        ]

    def __str__(self):
        return f"{self.user.email} -> {self.job_listing.title} ({self.match_percentage}%)"


class EventHackathonListing(models.Model):
    """
    Hackathons, webinars and events matching daksh.event_hackathon_listings.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    organizer = models.CharField(max_length=255)
    event_type = models.CharField(
        max_length=30,
        choices=EventTypeEnum.choices,
        default=EventTypeEnum.HACKATHON
    )
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    registration_deadline = models.DateTimeField(blank=True, null=True)
    location_city = models.CharField(max_length=100, blank=True, null=True)
    is_online = models.BooleanField(default=True)
    themes_tags = models.JSONField(default=list, blank=True)
    difficulty_level = models.CharField(
        max_length=20,
        choices=DifficultyLevelEnum.choices,
        default=DifficultyLevelEnum.INTERMEDIATE
    )
    prize_pool = models.CharField(max_length=100, blank=True, null=True)
    registration_url = models.TextField()
    source_platform = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    scraped_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'event_hackathon_listings'
        verbose_name = _('Event & Hackathon Listing')
        verbose_name_plural = _('Event & Hackathon Listings')

    def __str__(self):
        return f"{self.title} ({self.organizer})"


class UserOpportunityBookmark(models.Model):
    """
    Saved jobs and hackathons matching daksh.user_opportunity_bookmarks.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookmarks',
        db_column='user_id'
    )
    job = models.ForeignKey(
        JobListing,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        db_column='job_id'
    )
    event = models.ForeignKey(
        EventHackathonListing,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        db_column='event_id'
    )
    user_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_opportunity_bookmarks'
        verbose_name = _('User Opportunity Bookmark')
        verbose_name_plural = _('User Opportunity Bookmarks')

    def __str__(self):
        target = self.job.title if self.job else (self.event.title if self.event else 'Item')
        return f"{self.user.email} bookmarked {target}"


class SkillGapReport(models.Model):
    """
    Skill gap analysis report matching daksh.skill_gap_reports.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='skill_gap_reports',
        db_column='user_id'
    )
    target_role = models.ForeignKey(
        JobRoleTaxonomy,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        db_column='target_role_id'
    )
    target_jd = models.ForeignKey(
        'resumes.TargetJobDescription',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        db_column='target_jd_id'
    )
    overall_match_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    readiness_level = models.CharField(
        max_length=20,
        choices=ReadinessLevelEnum.choices,
        blank=True,
        null=True
    )
    total_required_skills = models.IntegerField(blank=True, null=True)
    skills_matched_count = models.IntegerField(blank=True, null=True)
    skills_gap_count = models.IntegerField(blank=True, null=True)
    analysis_summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'skill_gap_reports'
        verbose_name = _('Skill Gap Report')
        verbose_name_plural = _('Skill Gap Reports')

    def __str__(self):
        return f"Gap Report for {self.user.email} ({self.overall_match_score}%)"


class SkillGapItem(models.Model):
    """
    Individual skill breakdown item matching daksh.skill_gap_items.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(
        SkillGapReport,
        on_delete=models.CASCADE,
        related_name='items',
        db_column='report_id'
    )
    skill = models.ForeignKey(
        'skills.SkillMaster',
        on_delete=models.RESTRICT,
        related_name='gap_items',
        db_column='skill_id'
    )
    user_current_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    required_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    gap_severity = models.CharField(
        max_length=20,
        choices=GapSeverityEnum.choices,
        blank=True,
        null=True
    )
    recommended_action = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'skill_gap_items'
        verbose_name = _('Skill Gap Item')
        verbose_name_plural = _('Skill Gap Items')
        unique_together = ('report', 'skill')

    def __str__(self):
        return f"{self.skill.canonical_name} gap ({self.gap_severity})"


class GithubPortfolioAnalysis(models.Model):
    """
    GitHub repository analysis results matching daksh.github_portfolio_analyses.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='github_analyses',
        db_column='user_id'
    )
    github_username = models.CharField(max_length=100, blank=True, null=True)
    analyzed_repos_count = models.IntegerField(default=0)
    detected_languages = models.JSONField(default=list, blank=True, null=True)
    detected_frameworks = models.JSONField(default=list, blank=True, null=True)
    inferred_skills = models.JSONField(default=list, blank=True, null=True)
    commit_activity_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    raw_insights = models.JSONField(default=dict, blank=True, null=True)
    scanned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'github_portfolio_analyses'
        verbose_name = _('GitHub Portfolio Analysis')
        verbose_name_plural = _('GitHub Portfolio Analyses')

    def __str__(self):
        return f"GitHub Scan: {self.github_username} ({self.user.email})"
