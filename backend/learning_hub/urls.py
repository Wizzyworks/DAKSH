from django.urls import path
from .views import (
    ActiveRoadmapView,
    GenerateRoadmapView,
    CompleteStageView,
    StageQuizView,
    SubmitQuizView,
    SetuAITutorView,
    SpacedReviewsView,
)

app_name = 'learning_hub'

urlpatterns = [
    path('active-roadmap/', ActiveRoadmapView.as_view(), name='active_roadmap'),
    path('generate-roadmap/', GenerateRoadmapView.as_view(), name='generate_roadmap'),
    path('stages/<uuid:stage_id>/complete/', CompleteStageView.as_view(), name='complete_stage'),
    path('stages/<uuid:stage_id>/quiz/', StageQuizView.as_view(), name='stage_quiz'),
    path('stages/<uuid:stage_id>/submit-quiz/', SubmitQuizView.as_view(), name='submit_quiz'),
    path('tutor/', SetuAITutorView.as_view(), name='setu_tutor'),
    path('spaced-reviews/', SpacedReviewsView.as_view(), name='spaced_reviews_list'),
    path('spaced-reviews/<uuid:schedule_id>/review/', SpacedReviewsView.as_view(), name='record_spaced_review'),
]
