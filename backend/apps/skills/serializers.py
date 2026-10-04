from rest_framework import serializers
from .models import SkillMaster, SkillAlias, RoleSkillRequirement


class SkillAliasSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillAlias
        fields = ['id', 'alias_name', 'created_at']


class SkillMasterSerializer(serializers.ModelSerializer):
    aliases = SkillAliasSerializer(many=True, read_only=True)

    class Meta:
        model = SkillMaster
        fields = [
            'id',
            'canonical_name',
            'slug',
            'category',
            'description',
            'is_verified',
            'aliases',
            'created_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at']


class RoleSkillRequirementSerializer(serializers.ModelSerializer):
    skill = SkillMasterSerializer(read_only=True)

    class Meta:
        model = RoleSkillRequirement
        fields = [
            'id',
            'role',
            'skill',
            'importance',
            'benchmark_score_min',
            'weightage',
            'created_at',
        ]
