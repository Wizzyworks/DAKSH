import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from accounts.models import SkillMaster
from skill_gap.models import SkillGapReport


class ContentTypeEnum(models.TextChoices):
    VIDEO = 'video', _('Video')
    PDF = 'pdf', _('PDF')
    LAB = 'lab', _('Lab')


class DifficultyLevelEnum(models.TextChoices):
    BEGINNER = 'beginner', _('Beginner')
    INTERMEDIATE = 'intermediate', _('Intermediate')
    ADVANCED = 'advanced', _('Advanced')


class RoadmapStatusEnum(models.TextChoices):
    ACTIVE = 'active', _('Active')
    COMPLETED = 'completed', _('Completed')
    ARCHIVED = 'archived', _('Archived')


class StageTypeEnum(models.TextChoices):
    COURSE = 'course', _('Course')
    ASSESSMENT = 'assessment', _('Assessment')


class StageStatusEnum(models.TextChoices):
    LOCKED = 'locked', _('Locked')
    UNLOCKED = 'unlocked', _('Unlocked')
    COMPLETED = 'completed', _('Completed')


class CourseProgressStatusEnum(models.TextChoices):
    NOT_STARTED = 'not_started', _('Not Started')
    IN_PROGRESS = 'in_progress', _('In Progress')
    COMPLETED = 'completed', _('Completed')


class Course(models.Model):
    """
    Catalog of educational courses, video lectures, and reading modules.
    Matches daksh.courses table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    provider = models.CharField(max_length=100, null=True, blank=True)  # e.g., NPTEL, YouTube, iGOT
    content_type = models.CharField(
        max_length=20,
        choices=ContentTypeEnum.choices,
        default=ContentTypeEnum.VIDEO
    )
    video_embed_url = models.TextField(null=True, blank=True)
    pdf_material_url = models.TextField(null=True, blank=True)
    difficulty_level = models.CharField(
        max_length=20,
        choices=DifficultyLevelEnum.choices,
        default=DifficultyLevelEnum.BEGINNER
    )
    duration_minutes = models.IntegerField(null=True, blank=True)
    xp_reward = models.IntegerField(default=50)
    tags = models.JSONField(null=True, blank=True, help_text=_('List of technology/competency tags'))
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'courses'
        verbose_name = _('Course')
        verbose_name_plural = _('Courses')
        ordering = ['title']

    def __str__(self):
        return f"{self.title} ({self.provider or 'DAKSH'})"


class DynamicLearningRoadmap(models.Model):
    """
    Personalized AI-generated multi-stage learning path derived from Skill Gap Analysis.
    Matches daksh.dynamic_learning_roadmaps table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='learning_roadmaps')
    gap_report = models.ForeignKey(SkillGapReport, on_delete=models.SET_NULL, null=True, blank=True, related_name='roadmaps')
    title = models.CharField(max_length=255)
    target_role_goal = models.CharField(max_length=150, null=True, blank=True)
    total_stages = models.IntegerField(default=8)
    completed_stages = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=RoadmapStatusEnum.choices,
        default=RoadmapStatusEnum.ACTIVE
    )
    generated_by_ai = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dynamic_learning_roadmaps'
        verbose_name = _('Dynamic Learning Roadmap')
        verbose_name_plural = _('Dynamic Learning Roadmaps')
        ordering = ['-created_at']

    def __str__(self):
        return f"Roadmap: {self.title} ({self.completed_stages}/{self.total_stages} completed)"


class RoadmapStage(models.Model):
    """
    Individual sequential stage (Course or Dynamic Quiz) in the gamified roadmap.
    Matches daksh.roadmap_stages table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    roadmap = models.ForeignKey(DynamicLearningRoadmap, on_delete=models.CASCADE, related_name='stages')
    stage_number = models.IntegerField()
    title = models.CharField(max_length=255)
    stage_type = models.CharField(
        max_length=20,
        choices=StageTypeEnum.choices,
        default=StageTypeEnum.COURSE
    )
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='roadmap_usages')
    target_skill = models.ForeignKey(SkillMaster, on_delete=models.SET_NULL, null=True, blank=True, related_name='roadmap_stages')
    xp_points = models.IntegerField(default=100)
    status = models.CharField(
        max_length=20,
        choices=StageStatusEnum.choices,
        default=StageStatusEnum.LOCKED
    )
    unlocked_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'roadmap_stages'
        verbose_name = _('Roadmap Stage')
        verbose_name_plural = _('Roadmap Stages')
        ordering = ['roadmap', 'stage_number']
        unique_together = ('roadmap', 'stage_number')

    def __str__(self):
        return f"Stage {self.stage_number}: {self.title} [{self.status}]"


class UserCourseProgress(models.Model):
    """
    Real-time progress tracking for candidate course engagement.
    Matches daksh.user_course_progress table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_progresses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='user_progresses')
    roadmap_stage = models.ForeignKey(RoadmapStage, on_delete=models.SET_NULL, null=True, blank=True, related_name='progress_records')
    watch_time_seconds = models.IntegerField(default=0)
    progress_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    status = models.CharField(
        max_length=20,
        choices=CourseProgressStatusEnum.choices,
        default=CourseProgressStatusEnum.NOT_STARTED
    )
    last_accessed_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'user_course_progress'
        verbose_name = _('User Course Progress')
        verbose_name_plural = _('User Course Progresses')
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.email} -> {self.course.title} ({self.progress_percent}%)"


class SpacedRepetitionSchedule(models.Model):
    """
    SuperMemo SM-2 memory retention engine for completed concepts.
    Matches daksh.spaced_repetition_schedules table.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='repetition_schedules')
    concept_skill = models.ForeignKey(SkillMaster, on_delete=models.CASCADE, related_name='repetition_schedules')
    current_interval_days = models.IntegerField(default=1)
    repetition_count = models.IntegerField(default=0)
    ease_factor = models.DecimalField(max_digits=3, decimal_places=2, default=2.50)
    last_reviewed_at = models.DateTimeField(null=True, blank=True)
    next_review_due_at = models.DateTimeField()
    retention_streak = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'spaced_repetition_schedules'
        verbose_name = _('Spaced Repetition Schedule')
        verbose_name_plural = _('Spaced Repetition Schedules')
        ordering = ['next_review_due_at']

    def __str__(self):
        return f"{self.user.email} - {self.concept_skill.canonical_name} (Due: {self.next_review_due_at.strftime('%Y-%m-%d')})"

class RoadmapStatusEnum(models.TextChoices):
    ACTIVE = 'active', _('Active')
    COMPLETED = 'completed', _('Completed')
    PAUSED = 'paused', _('Paused')  # <-- Change from 'archived' to 'paused'