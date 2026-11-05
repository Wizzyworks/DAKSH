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
    point_delta = serializers.SerializerMethodField()

    class Meta:
        model = SkillGapItem
        fields = ['id', 'skill_name', 'skill_category', 'user_current_score', 'required_score', 'point_delta', 'gap_severity', 'recommended_action']

    def get_point_delta(self, obj):
        current = float(obj.user_current_score or 0)
        required = float(obj.required_score or 0)
        return round(current - required, 1)


class SkillGapReportSerializer(serializers.ModelSerializer):
    target_role_title = serializers.CharField(source='target_role.role_title', read_only=True)
    gap_items = SkillGapItemSerializer(many=True, read_only=True)
    matched_skills = serializers.SerializerMethodField()

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
            'matched_skills',
            'created_at',
        ]

    def get_matched_skills(self, obj):
        if not obj.target_role:
            return []
        reqs = RoleSkillRequirement.objects.filter(role=obj.target_role).select_related('skill')
        gap_skill_ids = set(obj.gap_items.values_list('skill_id', flat=True))
        matched = []
        for r in reqs:
            if r.skill_id not in gap_skill_ids:
                matched.append({
                    'skill_name': r.skill.canonical_name,
                    'skill_category': r.skill.category,
                    'user_current_score': float(r.benchmark_score_min),
                    'required_score': float(r.benchmark_score_min),
                    'point_delta': 0.0,
                })
        return matched
