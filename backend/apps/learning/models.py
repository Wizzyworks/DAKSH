import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class ContentTypeEnum(models.TextChoices):
    VIDEO = 'video', _('Video')
    PDF = 'pdf', _('PDF')
    LAB = 'lab', _('Lab')


class CourseDifficultyLevelEnum(models.TextChoices):
    BEGINNER = 'beginner', _('Beginner')
    INTERMEDIATE = 'intermediate', _('Intermediate')
    ADVANCED = 'advanced', _('Advanced')


class RoadmapStatusEnum(models.TextChoices):
    ACTIVE = 'active', _('Active')
    COMPLETED = 'completed', _('Completed')
    PAUSED = 'paused', _('Paused')


class StageTypeEnum(models.TextChoices):
    COURSE = 'course', _('Course')
    QUIZ = 'quiz', _('Quiz')
    LAB = 'lab', _('Lab')
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
    Courses repository matching daksh.courses.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    provider = models.CharField(max_length=100, blank=True, null=True)
    content_type = models.CharField(
        max_length=20,
        choices=ContentTypeEnum.choices,
        default=ContentTypeEnum.VIDEO
    )
    video_embed_url = models.TextField(blank=True, null=True)
    pdf_material_url = models.TextField(blank=True, null=True)
    difficulty_level = models.CharField(
        max_length=20,
        choices=CourseDifficultyLevelEnum.choices,
        default=CourseDifficultyLevelEnum.BEGINNER
    )
    duration_minutes = models.IntegerField(blank=True, null=True)
    xp_reward = models.IntegerField(default=50)
    tags = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'courses'
        verbose_name = _('Course')
        verbose_name_plural = _('Courses')
        ordering = ['title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class DynamicLearningRoadmap(models.Model):
    """
    Dynamic personalized learning roadmaps matching daksh.dynamic_learning_roadmaps.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='roadmaps',
        db_column='user_id'
    )
    gap_report = models.ForeignKey(
        'jobs.SkillGapReport',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        db_column='gap_report_id'
    )
    title = models.CharField(max_length=255)
    target_role_goal = models.CharField(max_length=150, blank=True, null=True)
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

    def __str__(self):
        return f"{self.title} ({self.user.email})"


class RoadmapStage(models.Model):
    """
    Roadmap stages matching daksh.roadmap_stages.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    roadmap = models.ForeignKey(
        DynamicLearningRoadmap,
        on_delete=models.CASCADE,
        related_name='stages',
        db_column='roadmap_id'
    )
    stage_number = models.IntegerField()
    title = models.CharField(max_length=255)
    stage_type = models.CharField(
        max_length=20,
        choices=StageTypeEnum.choices,
        default=StageTypeEnum.COURSE
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        db_column='course_id'
    )
    target_skill = models.ForeignKey(
        'skills.SkillMaster',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        db_column='target_skill_id'
    )
    xp_points = models.IntegerField(default=100)
    status = models.CharField(
        max_length=20,
        choices=StageStatusEnum.choices,
        default=StageStatusEnum.LOCKED
    )
    unlocked_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'roadmap_stages'
        verbose_name = _('Roadmap Stage')
        verbose_name_plural = _('Roadmap Stages')
        ordering = ['stage_number']

    def __str__(self):
        return f"Stage {self.stage_number}: {self.title}"


class UserCourseProgress(models.Model):
    """
    User course progression matching daksh.user_course_progress.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='course_progress',
        db_column='user_id'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='user_progress',
        db_column='course_id'
    )
    roadmap_stage = models.ForeignKey(
        RoadmapStage,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        db_column='roadmap_stage_id'
    )
    watch_time_seconds = models.IntegerField(default=0)
    progress_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    status = models.CharField(
        max_length=20,
        choices=CourseProgressStatusEnum.choices,
        default=CourseProgressStatusEnum.NOT_STARTED
    )
    last_accessed_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'user_course_progress'
        verbose_name = _('User Course Progress')
        verbose_name_plural = _('User Course Progress')

    def __str__(self):
        return f"{self.user.email} - {self.course.title} ({self.progress_percent}%)"


class SpacedRepetitionSchedule(models.Model):
    """
    Spaced repetition review schedules matching daksh.spaced_repetition_schedules.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='spaced_schedules',
        db_column='user_id'
    )
    concept_skill = models.ForeignKey(
        'skills.SkillMaster',
        on_delete=models.CASCADE,
        related_name='spaced_schedules',
        db_column='concept_skill_id'
    )
    current_interval_days = models.IntegerField(default=1)
    repetition_count = models.IntegerField(default=0)
    ease_factor = models.DecimalField(max_digits=3, decimal_places=2, default=2.50)
    last_reviewed_at = models.DateTimeField(blank=True, null=True)
    next_review_due_at = models.DateTimeField()
    retention_streak = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'spaced_repetition_schedules'
        verbose_name = _('Spaced Repetition Schedule')
        verbose_name_plural = _('Spaced Repetition Schedules')

    def __str__(self):
        return f"{self.user.email} review {self.concept_skill.canonical_name} due {self.next_review_due_at}"
