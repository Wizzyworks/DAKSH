from rest_framework import serializers
from .models import (
    JobRoleTaxonomy,
    JobListing,
    JobAlertPreference,
    UserJobMatch,
    EventHackathonListing,
    UserOpportunityBookmark,
    SkillGapReport,
    SkillGapItem,
    GithubPortfolioAnalysis,
)


class JobRoleTaxonomySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRoleTaxonomy
        fields = [
            'id',
            'role_title',
            'role_slug',
            'department_domain',
            'industry',
            'description',
            'seniority_level',
            'standard_required_skills',
            'is_active',
            'created_at',
        ]


class JobListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = '__all__'


class EventHackathonListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventHackathonListing
        fields = '__all__'


class SkillGapItemSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.canonical_name', read_only=True)

    class Meta:
        model = SkillGapItem
        fields = '__all__'


class SkillGapReportSerializer(serializers.ModelSerializer):
    items = SkillGapItemSerializer(many=True, read_only=True)

    class Meta:
        model = SkillGapReport
        fields = '__all__'
