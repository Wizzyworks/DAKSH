from django.contrib import admin
from .models import Course, DynamicLearningRoadmap, RoadmapStage, UserCourseProgress, SpacedRepetitionSchedule


class RoadmapStageInline(admin.TabularInline):
    model = RoadmapStage
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'provider', 'content_type', 'difficulty_level', 'duration_minutes', 'xp_reward', 'is_active')
    search_fields = ('title', 'provider')
    list_filter = ('content_type', 'difficulty_level', 'is_active')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(DynamicLearningRoadmap)
class DynamicLearningRoadmapAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'target_role_goal', 'total_stages', 'completed_stages', 'status')
    list_filter = ('status', 'generated_by_ai')
    search_fields = ('title', 'user__email', 'target_role_goal')
    inlines = [RoadmapStageInline]


@admin.register(RoadmapStage)
class RoadmapStageAdmin(admin.ModelAdmin):
    list_display = ('roadmap', 'stage_number', 'title', 'stage_type', 'xp_points', 'status')
    list_filter = ('stage_type', 'status')


@admin.register(UserCourseProgress)
class UserCourseProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'progress_percent', 'status', 'last_accessed_at')
    list_filter = ('status',)


@admin.register(SpacedRepetitionSchedule)
class SpacedRepetitionScheduleAdmin(admin.ModelAdmin):
    list_display = ('user', 'concept_skill', 'current_interval_days', 'repetition_count', 'next_review_due_at')
