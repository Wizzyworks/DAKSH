from rest_framework import generics, permissions, filters
from .models import SkillMaster
from .serializers import SkillMasterSerializer


class SkillMasterListView(generics.ListCreateAPIView):
    """
    GET /api/skills/ - List and search skills in taxonomy
    POST /api/skills/ - Create a new skill in taxonomy
    """
    queryset = SkillMaster.objects.all().order_by('canonical_name')
    serializer_class = SkillMasterSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')

        if search:
            queryset = queryset.filter(canonical_name__icontains=search)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class SkillMasterDetailView(generics.RetrieveAPIView):
    """
    GET /api/skills/<id>/ - Retrieve details of a specific skill
    """
    queryset = SkillMaster.objects.all()
    serializer_class = SkillMasterSerializer
    permission_classes = [permissions.AllowAny]
