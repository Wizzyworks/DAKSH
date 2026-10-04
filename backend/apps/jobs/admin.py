from django.contrib import admin
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


@admin.register(JobRoleTaxonomy)
class JobRoleTaxonomyAdmin(admin.ModelAdmin):
    list_display = ('role_title', 'department_domain', 'industry', 'seniority_level', 'is_active')
    search_fields = ('role_title', 'department_domain')
    list_filter = ('department_domain', 'is_active')
    prepopulated_fields = {'role_slug': ('role_title',)}


@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company_name', 'location', 'is_remote', 'job_type', 'is_active', 'date_posted')
    search_fields = ('title', 'company_name', 'location')
    list_filter = ('job_type', 'is_remote', 'is_active')


@admin.register(JobAlertPreference)
class JobAlertPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'frequency', 'is_active', 'last_notified_at')


@admin.register(UserJobMatch)
class UserJobMatchAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_listing', 'match_percentage', 'status')
    list_filter = ('status',)


@admin.register(EventHackathonListing)
class EventHackathonListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'event_type', 'difficulty_level', 'is_online', 'start_date', 'is_active')
    list_filter = ('event_type', 'difficulty_level', 'is_online', 'is_active')


@admin.register(UserOpportunityBookmark)
class UserOpportunityBookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'event', 'created_at')


@admin.register(SkillGapReport)
class SkillGapReportAdmin(admin.ModelAdmin):
    list_display = ('user', 'target_role', 'overall_match_score', 'readiness_level', 'created_at')
    list_filter = ('readiness_level',)


@admin.register(SkillGapItem)
class SkillGapItemAdmin(admin.ModelAdmin):
    list_display = ('report', 'skill', 'user_current_score', 'required_score', 'gap_severity')
    list_filter = ('gap_severity',)


@admin.register(GithubPortfolioAnalysis)
class GithubPortfolioAnalysisAdmin(admin.ModelAdmin):
    list_display = ('user', 'github_username', 'analyzed_repos_count', 'commit_activity_score', 'scanned_at')
