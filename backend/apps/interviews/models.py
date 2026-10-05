import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class SessionTypeEnum(models.TextChoices):
    MOCK = 'mock', _('Mock')
    DOMAIN = 'domain', _('Domain')
    REMEDIATION = 'remediation', _('Remediation')


class InterviewStatusEnum(models.TextChoices):
    PENDING = 'pending', _('Pending')
    IN_PROGRESS = 'in_progress', _('In Progress')
    COMPLETED = 'completed', _('Completed')


class RoundFormatEnum(models.TextChoices):
    MCQ = 'MCQ', _('MCQ')
    DESCRIPTIVE = 'Descriptive', _('Descriptive')
    CODING = 'Coding', _('Coding')
    VOICE = 'Voice', _('Voice')


class BloomLevelEnum(models.TextChoices):
    REMEMBER = 'Remember', _('Remember')
    UNDERSTAND = 'Understand', _('Understand')
    APPLY = 'Apply', _('Apply')
    ANALYZE = 'Analyze', _('Analyze')
    EVALUATE = 'Evaluate', _('Evaluate')
    CREATE = 'Create', _('Create')


class QuestionDifficultyEnum(models.TextChoices):
    BEGINNER = 'beginner', _('Beginner')
    INTERMEDIATE = 'intermediate', _('Intermediate')
    ADVANCED = 'advanced', _('Advanced')


class InterviewSession(models.Model):
    """
    Candidate mock interview session matching daksh.interview_sessions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='interview_sessions',
        db_column='user_id'
    )
    session_type = models.CharField(
        max_length=20,
        choices=SessionTypeEnum.choices,
        default=SessionTypeEnum.MOCK
    )
    target_role = models.ForeignKey(
        'jobs.JobRoleTaxonomy',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        db_column='target_role_id'
    )
    session_title = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=InterviewStatusEnum.choices,
        default=InterviewStatusEnum.PENDING
    )
    overall_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    total_rounds = models.IntegerField(default=4)
    current_round = models.IntegerField(default=1)
    started_at = models.DateTimeField(blank=True, null=True)
    ended_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'interview_sessions'
        verbose_name = _('Interview Session')
        verbose_name_plural = _('Interview Sessions')
        ordering = ['-created_at']

    def __str__(self):
        return f"Interview: {self.session_title or self.session_type} for {self.user.email}"


class InterviewRound(models.Model):
    """
    Sub-rounds within an interview session matching daksh.interview_rounds.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        InterviewSession,
        on_delete=models.CASCADE,
        related_name='rounds',
        db_column='session_id'
    )
    round_number = models.IntegerField()
    round_format = models.CharField(
        max_length=20,
        choices=RoundFormatEnum.choices,
        default=RoundFormatEnum.MCQ
    )
    title = models.CharField(max_length=255)
    time_limit_minutes = models.IntegerField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=InterviewStatusEnum.choices,
        default=InterviewStatusEnum.PENDING
    )
    round_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    started_at = models.DateTimeField(blank=True, null=True)
    ended_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'interview_rounds'
        verbose_name = _('Interview Round')
        verbose_name_plural = _('Interview Rounds')
        ordering = ['round_number']
        indexes = [
            models.Index(fields=['session'], name='idx_interview_rounds_session'),
        ]

    def __str__(self):
        return f"Round {self.round_number}: {self.title}"


class InterviewQuestion(models.Model):
    """
    Questions generated for interview rounds matching daksh.interview_questions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    round = models.ForeignKey(
        InterviewRound,
        on_delete=models.CASCADE,
        related_name='questions',
        db_column='round_id'
    )
    question_order = models.IntegerField()
    format = models.CharField(
        max_length=20,
        choices=RoundFormatEnum.choices,
        default=RoundFormatEnum.MCQ
    )
    difficulty_level = models.CharField(
        max_length=20,
        choices=QuestionDifficultyEnum.choices,
        default=QuestionDifficultyEnum.INTERMEDIATE
    )
    competency_domain = models.CharField(max_length=100, blank=True, null=True)
    bloom_level = models.CharField(
        max_length=20,
        choices=BloomLevelEnum.choices,
        blank=True,
        null=True
    )
    question_text = models.TextField()
    options_json = models.JSONField(blank=True, null=True)
    correct_answer = models.TextField(blank=True, null=True)
    ideal_reference_answer = models.TextField(blank=True, null=True)
    coding_starter_code = models.TextField(blank=True, null=True)
    test_cases_json = models.JSONField(blank=True, null=True)
    evaluation_rubric_json = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'interview_questions'
        verbose_name = _('Interview Question')
        verbose_name_plural = _('Interview Questions')
        ordering = ['question_order']
        indexes = [
            models.Index(fields=['round'], name='idx_interview_questions_round'),
        ]

    def __str__(self):
        return f"Q{self.question_order} ({self.format}): {self.question_text[:60]}"


class UserInterviewResponse(models.Model):
    """
    Candidate responses to interview questions matching daksh.user_interview_responses.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(
        InterviewQuestion,
        on_delete=models.CASCADE,
        related_name='responses',
        db_column='question_id'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='interview_responses',
        db_column='user_id'
    )
    response_format = models.CharField(
        max_length=20,
        choices=RoundFormatEnum.choices,
        blank=True,
        null=True
    )
    user_submission_text = models.TextField(blank=True, null=True)
    code_output_stdout = models.TextField(blank=True, null=True)
    code_output_stderr = models.TextField(blank=True, null=True)
    audio_recording_url = models.TextField(blank=True, null=True)
    stt_transcription_text = models.TextField(blank=True, null=True)
    time_spent_seconds = models.IntegerField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_interview_responses'
        verbose_name = _('User Interview Response')
        verbose_name_plural = _('User Interview Responses')
        indexes = [
            models.Index(fields=['question'], name='idx_user_interview_responses_q'),
        ]

    def __str__(self):
        return f"Response by {self.user.email} for Q{self.question_id}"


class AIEvaluationFeedback(models.Model):
    """
    AI assessment of individual candidate response matching daksh.ai_evaluations_feedback.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    response = models.OneToOneField(
        UserInterviewResponse,
        on_delete=models.CASCADE,
        related_name='ai_evaluation',
        db_column='response_id'
    )
    evaluated_by_model = models.CharField(max_length=100, blank=True, null=True)
    overall_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    content_accuracy_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    depth_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    star_structure_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    code_quality_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    communication_score = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    detailed_feedback = models.TextField()
    missed_concepts = models.JSONField(default=list, blank=True, null=True)
    strengths = models.JSONField(default=list, blank=True, null=True)
    remediation_suggestions = models.JSONField(default=list, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_evaluations_feedback'
        verbose_name = _('AI Evaluation Feedback')
        verbose_name_plural = _('AI Evaluations Feedback')

    def __str__(self):
        return f"AI Evaluation: Score {self.overall_score}"


class InterviewScorecard(models.Model):
    """
    Comprehensive final scorecard for the interview session matching daksh.interview_scorecards.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.OneToOneField(
        InterviewSession,
        on_delete=models.CASCADE,
        related_name='scorecard',
        db_column='session_id'
    )
    radar_metrics_json = models.JSONField(default=dict, blank=True, null=True)
    technical_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    communication_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    problem_solving_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    ai_executive_summary = models.TextField(blank=True, null=True)
    actionable_takeaways = models.JSONField(default=list, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'interview_scorecards'
        verbose_name = _('Interview Scorecard')
        verbose_name_plural = _('Interview Scorecards')

    def __str__(self):
        return f"Scorecard for session {self.session_id}"
