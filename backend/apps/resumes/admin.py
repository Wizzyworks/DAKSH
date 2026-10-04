from django.contrib import admin
from .models import (
    TargetJobDescription,
    ResumeMaster,
    ResumeStructuredContent,
    ResumeCompilation,
    ResumeATSAudit,
)


class ResumeStructuredContentInline(admin.StackedInline):
    model = ResumeStructuredContent
    can_delete = False


class ResumeCompilationInline(admin.TabularInline):
    model = ResumeCompilation
    extra = 0


class ResumeATSAuditInline(admin.TabularInline):
    model = ResumeATSAudit
    extra = 0


@admin.register(TargetJobDescription)
class TargetJobDescriptionAdmin(admin.ModelAdmin):
    list_display = ('job_title', 'company_name', 'user', 'experience_required_years', 'parsed_at')
    search_fields = ('job_title', 'company_name', 'user__email')


@admin.register(ResumeMaster)
class ResumeMasterAdmin(admin.ModelAdmin):
    list_display = ('resume_title', 'user', 'version_number', 'mode', 'template_name', 'is_primary', 'updated_at')
    list_filter = ('mode', 'template_name', 'is_primary')
    search_fields = ('resume_title', 'user__email')
    inlines = [ResumeStructuredContentInline, ResumeCompilationInline, ResumeATSAuditInline]


@admin.register(ResumeStructuredContent)
class ResumeStructuredContentAdmin(admin.ModelAdmin):
    list_display = ('resume', 'updated_at')


@admin.register(ResumeCompilation)
class ResumeCompilationAdmin(admin.ModelAdmin):
    list_display = ('resume', 'compilation_status', 'compiled_at')
    list_filter = ('compilation_status',)


@admin.register(ResumeATSAudit)
class ResumeATSAuditAdmin(admin.ModelAdmin):
    list_display = ('resume', 'overall_ats_score', 'keyword_match_score', 'format_safety_score', 'audited_at')
