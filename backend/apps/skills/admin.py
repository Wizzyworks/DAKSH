from django.contrib import admin
from .models import SkillMaster, SkillAlias, RoleSkillRequirement


class SkillAliasInline(admin.TabularInline):
    model = SkillAlias
    extra = 1


@admin.register(SkillMaster)
class SkillMasterAdmin(admin.ModelAdmin):
    list_display = ('canonical_name', 'category', 'slug', 'is_verified', 'created_at')
    search_fields = ('canonical_name', 'slug')
    list_filter = ('category', 'is_verified')
    prepopulated_fields = {'slug': ('canonical_name',)}
    inlines = [SkillAliasInline]


@admin.register(SkillAlias)
class SkillAliasAdmin(admin.ModelAdmin):
    list_display = ('alias_name', 'skill', 'created_at')
    search_fields = ('alias_name', 'skill__canonical_name')


@admin.register(RoleSkillRequirement)
class RoleSkillRequirementAdmin(admin.ModelAdmin):
    list_display = ('role', 'skill', 'importance', 'benchmark_score_min', 'weightage')
    list_filter = ('importance', 'role')
    search_fields = ('role__role_title', 'skill__canonical_name')
