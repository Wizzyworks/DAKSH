from django.urls import path
from .views import SkillMasterListView, SkillMasterDetailView

app_name = 'skills'

urlpatterns = [
    path('', SkillMasterListView.as_view(), name='skill_list'),
    path('<uuid:pk>/', SkillMasterDetailView.as_view(), name='skill_detail'),
]
