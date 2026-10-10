from django.urls import path
from .views import (
    RolesListView,
    ResumeParseView,
    BenchmarkAnalyzeView,
    GenerateDiagnosticArenaView,
    CalibrateDiagnosticView,
)

app_name = 'skill_gap'

urlpatterns = [
    path('roles/', RolesListView.as_view(), name='roles_list'),
    path('parse-resume/', ResumeParseView.as_view(), name='parse_resume'),
    path('analyze-benchmark/', BenchmarkAnalyzeView.as_view(), name='analyze_benchmark'),
    path('generate-diagnostic/', GenerateDiagnosticArenaView.as_view(), name='generate_diagnostic'),
    path('calibrate-diagnostic/', CalibrateDiagnosticView.as_view(), name='calibrate_diagnostic'),
]
