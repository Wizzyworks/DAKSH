"""
API Views for Skill Gap Analysis.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from daksh_backend.mock_auth import get_authenticated_user_id
from .models import JobRoleTaxonomy, SkillGapReport
from .serializers import (
    JobRoleTaxonomySerializer,
    SkillGapReportSerializer,
    AnalyzeSkillGapRequestSerializer,
)
from .services import calculate_skill_gap


class JobRoleTaxonomyListView(APIView):
    """
    GET /api/skill-gap/roles/
    Returns list of available job roles in taxonomy to calculate gaps against.
    """
    def get(self, request):
        roles = JobRoleTaxonomy.objects.filter(is_active=True)
        serializer = JobRoleTaxonomySerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AnalyzeSkillGapView(APIView):
    """
    POST /api/skill-gap/analyze/
    Calculates skill gap analysis for the given target role and authenticating user.
    """
    def post(self, request):
        request_serializer = AnalyzeSkillGapRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return Response(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        target_role_id = request_serializer.validated_data['target_role_id']
        
        # Use user_id from body override if provided, otherwise resolve via mock auth helper
        user_id = request_serializer.validated_data.get('user_id') or get_authenticated_user_id(request)
        
        try:
            report = calculate_skill_gap(user_id=str(user_id), target_role_id=str(target_role_id))
            response_serializer = SkillGapReportSerializer(report)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except JobRoleTaxonomy.DoesNotExist:
            return Response({'error': 'Target job role not found.'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as ve:
            return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Calculation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkillGapReportListView(APIView):
    """
    GET /api/skill-gap/reports/
    Retrieves all past skill gap reports for the authenticating user.
    """
    def get(self, request):
        user_id = get_authenticated_user_id(request)
        reports = SkillGapReport.objects.filter(user_id=user_id).order_by('-created_at')
        serializer = SkillGapReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SkillGapReportDetailView(APIView):
    """
    GET /api/skill-gap/reports/<uuid:report_id>/
    Retrieves a single skill gap report with its detailed items.
    """
    def get(self, request, report_id):
        try:
            report = SkillGapReport.objects.prefetch_related('items__skill', 'target_role').get(id=report_id)
            serializer = SkillGapReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SkillGapReport.DoesNotExist:
            return Response({'error': 'Skill gap report not found.'}, status=status.HTTP_404_NOT_FOUND)
