from django.contrib import admin
from .models import (
    InterviewSession,
    InterviewRound,
    InterviewQuestion,
    UserInterviewResponse,
    AIEvaluationFeedback,
    InterviewScorecard,
)


class InterviewRoundInline(admin.TabularInline):
    model = InterviewRound
    extra = 1


class InterviewQuestionInline(admin.TabularInline):
    model = InterviewQuestion
    extra = 1


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_type', 'target_role', 'status', 'overall_score', 'created_at')
    list_filter = ('session_type', 'status')
    search_fields = ('user__email', 'session_title')
    inlines = [InterviewRoundInline]


@admin.register(InterviewRound)
class InterviewRoundAdmin(admin.ModelAdmin):
    list_display = ('session', 'round_number', 'title', 'round_format', 'status', 'round_score')
    list_filter = ('round_format', 'status')
    inlines = [InterviewQuestionInline]


@admin.register(InterviewQuestion)
class InterviewQuestionAdmin(admin.ModelAdmin):
    list_display = ('round', 'question_order', 'format', 'difficulty_level', 'competency_domain', 'bloom_level')
    list_filter = ('format', 'difficulty_level', 'bloom_level')
    search_fields = ('question_text',)


@admin.register(UserInterviewResponse)
class UserInterviewResponseAdmin(admin.ModelAdmin):
    list_display = ('user', 'question', 'response_format', 'time_spent_seconds', 'submitted_at')
    search_fields = ('user__email', 'user_submission_text')


@admin.register(AIEvaluationFeedback)
class AIEvaluationFeedbackAdmin(admin.ModelAdmin):
    list_display = ('response', 'evaluated_by_model', 'overall_score', 'code_quality_score', 'communication_score')
    search_fields = ('detailed_feedback',)


@admin.register(InterviewScorecard)
class InterviewScorecardAdmin(admin.ModelAdmin):
    list_display = ('session', 'technical_score', 'communication_score', 'problem_solving_score', 'created_at')
