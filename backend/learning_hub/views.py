from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import (
    DynamicLearningRoadmap,
    RoadmapStage,
    RoadmapStatusEnum,
    SpacedRepetitionSchedule
)
from .serializers import (
    DynamicLearningRoadmapSerializer,
    RoadmapStageSerializer,
    SpacedRepetitionScheduleSerializer
)
from .services.roadmap_generator import DynamicRoadmapGeneratorService
from .services.quiz_engine import StageQuizEngineService
from .services.rag_tutor import SetuAITutorService
from .services.spaced_repetition import StageProgressionService, SpacedRepetitionService

User = get_user_model()


def get_current_user(request):
    """Helper to get authenticated user or demo candidate."""
    if request.user.is_authenticated:
        return request.user
    user, _ = User.objects.get_or_create(email='test_learner@daksh.io', defaults={'role': 'candidate'})
    return user


class ActiveRoadmapView(views.APIView):
    """
    GET /api/learning-hub/active-roadmap/
    Returns user's active dynamic roadmap, with all ordered stages, videos, and doc links.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = get_current_user(request)
        roadmap = DynamicLearningRoadmap.objects.filter(user=user, status=RoadmapStatusEnum.ACTIVE).first()
        
        if not roadmap:
            # Auto-generate from default high-impact placement track if none exists
            roadmap = DynamicRoadmapGeneratorService.generate_roadmap_from_gap_report(
                user=user,
                custom_gap_skills=['PostgreSQL Indexing', 'Docker Layer Caching', 'Node.js Concurrency', 'REST APIs']
            )

        serializer = DynamicLearningRoadmapSerializer(roadmap)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GenerateRoadmapView(views.APIView):
    """
    POST /api/learning-hub/generate-roadmap/
    Generates a personalized roadmap from Skill Gap Analysis results.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = get_current_user(request)
        gap_report_id = request.data.get('gap_report_id')
        custom_gap_skills = request.data.get('custom_gap_skills', [])
        user_theta = float(request.data.get('user_theta', 0.0))

        roadmap = DynamicRoadmapGeneratorService.generate_roadmap_from_gap_report(
            user=user,
            gap_report_id=gap_report_id,
            custom_gap_skills=custom_gap_skills,
            user_theta=user_theta
        )
        serializer = DynamicLearningRoadmapSerializer(roadmap)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CompleteStageView(views.APIView):
    """
    POST /api/learning-hub/stages/{id}/complete/
    Marks course stage completed, unlocks next checkpoint, awards XP, and schedules SM-2 review.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, stage_id):
        user = get_current_user(request)
        stage = get_object_or_404(RoadmapStage, id=stage_id, roadmap__user=user)
        xp = int(request.data.get('xp', stage.xp_points or 100))

        result = StageProgressionService.complete_stage(user=user, stage=stage, xp_earned=xp)
        return Response(result, status=status.HTTP_200_OK)


class StageQuizView(views.APIView):
    """
    POST /api/learning-hub/stages/{id}/quiz/
    Generates dynamic MCQs tailored to the stage's target skill.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, stage_id):
        user = get_current_user(request)
        stage = get_object_or_404(RoadmapStage, id=stage_id, roadmap__user=user)
        skill_name = stage.target_skill.canonical_name if stage.target_skill else 'Software Engineering'

        engine = StageQuizEngineService()
        questions = engine.generate_stage_quiz(stage_title=stage.title, skill_name=skill_name, num_questions=3)
        return Response({'questions': questions, 'stage_title': stage.title, 'skill': skill_name}, status=status.HTTP_200_OK)


class SubmitQuizView(views.APIView):
    """
    POST /api/learning-hub/stages/{id}/submit-quiz/
    Evaluates quiz answers (Pass >= 66%). If passed, auto-completes stage and unlocks next!
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, stage_id):
        user = get_current_user(request)
        stage = get_object_or_404(RoadmapStage, id=stage_id, roadmap__user=user)

        questions = request.data.get('questions', [])
        user_answers = request.data.get('user_answers', {})

        engine = StageQuizEngineService()
        eval_result = engine.evaluate_submission(questions, user_answers)

        if eval_result['passed']:
            progression = StageProgressionService.complete_stage(user=user, stage=stage, xp_earned=eval_result['xp_earned'])
            eval_result['progression'] = progression

        return Response(eval_result, status=status.HTTP_200_OK)


class SetuAITutorView(views.APIView):
    """
    POST /api/learning-hub/tutor/
    Context-Aware Socratic SETU AI Mentor. Ingests user query, active stage, and failed quiz context.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_query = request.data.get('query', '')
        stage_title = request.data.get('stage_title', 'General Concept')
        skill_name = request.data.get('skill_name', 'Software Engineering')
        course_metadata = request.data.get('course_metadata', {})
        failed_question_context = request.data.get('failed_question_context', None)

        if not user_query:
            return Response({'error': 'query string is required.'}, status=status.HTTP_400_BAD_REQUEST)

        tutor = SetuAITutorService()
        response_data = tutor.answer_in_context(
            user_query=user_query,
            stage_title=stage_title,
            skill_name=skill_name,
            course_metadata=course_metadata,
            failed_question_context=failed_question_context
        )
        return Response(response_data, status=status.HTTP_200_OK)


class SpacedReviewsView(views.APIView):
    """
    GET /api/learning-hub/spaced-reviews/
    POST /api/learning-hub/spaced-reviews/{id}/review/
    Returns concept flashcards due for review and records SM-2 recall score (0-5).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = get_current_user(request)
        due_items = SpacedRepetitionService.get_due_reviews_for_user(user)
        serializer = SpacedRepetitionScheduleSerializer(due_items, many=True)
        return Response({'due_count': len(due_items), 'cards': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, schedule_id):
        user = get_current_user(request)
        schedule = get_object_or_404(SpacedRepetitionSchedule, id=schedule_id, user=user)
        quality_score = int(request.data.get('quality', 4))

        updated = SpacedRepetitionService.record_review_result(schedule, quality_score)
        serializer = SpacedRepetitionScheduleSerializer(updated)
        return Response(serializer.data, status=status.HTTP_200_OK)
