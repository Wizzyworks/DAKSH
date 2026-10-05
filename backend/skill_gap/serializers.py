"""
DRF Serializers for Skill Gap Analysis API endpoints.
"""

from rest_framework import serializers
from .models import (
    SkillMaster,
    JobRoleTaxonomy,
    RoleSkillRequirement,
    SkillGapReport,
    SkillGapItem,
)


class SkillMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillMaster
        fields = ['id', 'canonical_name', 'slug', 'category', 'description']


class JobRoleTaxonomySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRoleTaxonomy
        fields = ['id', 'role_title', 'role_slug', 'department_domain', 'industry', 'description', 'seniority_level']


class RoleSkillRequirementSerializer(serializers.ModelSerializer):
    skill = SkillMasterSerializer(read_only=True)

    class Meta:
        model = RoleSkillRequirement
        fields = ['id', 'skill', 'importance', 'benchmark_score_min', 'weightage']


class SkillGapItemSerializer(serializers.ModelSerializer):
    skill = SkillMasterSerializer(read_only=True)

    class Meta:
        model = SkillGapItem
        fields = [
            'id',
            'skill',
            'user_current_score',
            'required_score',
            'gap_severity',
            'recommended_action',
        ]


class SkillGapReportSerializer(serializers.ModelSerializer):
    target_role = JobRoleTaxonomySerializer(read_only=True)
    items = SkillGapItemSerializer(many=True, read_only=True)

    class Meta:
        model = SkillGapReport
        fields = [
            'id',
            'user_id',
            'target_role',
            'target_jd_id',
            'overall_match_score',
            'readiness_level',
            'total_required_skills',
            'skills_matched_count',
            'skills_gap_count',
            'analysis_summary',
            'created_at',
            'items',
        ]


class AnalyzeSkillGapRequestSerializer(serializers.Serializer):
    target_role_id = serializers.UUIDField(required=True, help_text="UUID of the target JobRoleTaxonomy")
    user_id = serializers.UUIDField(required=False, help_text="Optional User UUID for testing override")
