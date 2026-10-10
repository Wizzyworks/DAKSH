from rest_framework import serializers
from .models import (
    JobRoleTaxonomy,
    RoleSkillRequirement,
    TargetJobDescription,
    SkillGapReport,
    SkillGapItem,
)
from accounts.models import SkillMaster


class SkillMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillMaster
        fields = ['id', 'canonical_name', 'slug', 'category', 'description']


class JobRoleTaxonomySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRoleTaxonomy
        fields = ['id', 'role_title', 'role_slug', 'department_domain', 'industry', 'description', 'seniority_level', 'standard_required_skills']


class SkillGapItemSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.canonical_name', read_only=True)
    skill_category = serializers.CharField(source='skill.category', read_only=True)

    class Meta:
        model = SkillGapItem
        fields = ['id', 'skill_name', 'skill_category', 'user_current_score', 'required_score', 'gap_severity', 'recommended_action']


class SkillGapReportSerializer(serializers.ModelSerializer):
    target_role_title = serializers.CharField(source='target_role.role_title', read_only=True)
    gap_items = SkillGapItemSerializer(many=True, read_only=True)

    class Meta:
        model = SkillGapReport
        fields = [
            'id',
            'target_role_title',
            'overall_match_score',
            'readiness_level',
            'total_required_skills',
            'skills_matched_count',
            'skills_gap_count',
            'analysis_summary',
            'gap_items',
            'created_at',
        ]
