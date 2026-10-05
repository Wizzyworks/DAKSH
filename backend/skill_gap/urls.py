"""
URL routing for skill_gap application.
"""

from django.urls import path
from .views import (
    JobRoleTaxonomyListView,
    AnalyzeSkillGapView,
    SkillGapReportListView,
    SkillGapReportDetailView,
)

urlpatterns = [
    path('roles/', JobRoleTaxonomyListView.as_view(), name='skill-gap-roles'),
    path('analyze/', AnalyzeSkillGapView.as_view(), name='skill-gap-analyze'),
    path('reports/', SkillGapReportListView.as_view(), name='skill-gap-reports-list'),
    path('reports/<uuid:report_id>/', SkillGapReportDetailView.as_view(), name='skill-gap-report-detail'),
]
