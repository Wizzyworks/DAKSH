from rest_framework import serializers
from .models import (
    Course,
    DynamicLearningRoadmap,
    RoadmapStage,
    UserCourseProgress,
    SpacedRepetitionSchedule,
)


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'slug',
            'provider',
            'content_type',
            'video_embed_url',
            'pdf_material_url',
            'difficulty_level',
            'duration_minutes',
            'xp_reward',
            'tags',
        ]


class RoadmapStageSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    target_skill_name = serializers.CharField(source='target_skill.canonical_name', read_only=True)

    class Meta:
        model = RoadmapStage
        fields = [
            'id',
            'stage_number',
            'title',
            'stage_type',
            'course',
            'target_skill_name',
            'xp_points',
            'status',
            'unlocked_at',
            'completed_at',
        ]


class DynamicLearningRoadmapSerializer(serializers.ModelSerializer):
    stages = RoadmapStageSerializer(many=True, read_only=True)
    completion_percentage = serializers.SerializerMethodField()

    class Meta:
        model = DynamicLearningRoadmap
        fields = [
            'id',
            'title',
            'target_role_goal',
            'total_stages',
            'completed_stages',
            'completion_percentage',
            'status',
            'generated_by_ai',
            'stages',
            'created_at',
            'updated_at',
        ]

    def get_completion_percentage(self, obj):
        if not obj.total_stages or obj.total_stages == 0:
            return 0
        return round((obj.completed_stages / obj.total_stages) * 100.0, 1)


class SpacedRepetitionScheduleSerializer(serializers.ModelSerializer):
    concept_name = serializers.CharField(source='concept_skill.canonical_name', read_only=True)
    concept_category = serializers.CharField(source='concept_skill.category', read_only=True)

    class Meta:
        model = SpacedRepetitionSchedule
        fields = [
            'id',
            'concept_name',
            'concept_category',
            'current_interval_days',
            'repetition_count',
            'ease_factor',
            'retention_streak',
            'next_review_due_at',
            'last_reviewed_at',
        ]
