from rest_framework import generics, permissions
from .models import JobRoleTaxonomy, JobListing, EventHackathonListing
from .serializers import JobRoleTaxonomySerializer, JobListingSerializer, EventHackathonListingSerializer


class JobRoleTaxonomyListView(generics.ListAPIView):
    """
    GET /api/jobs/roles/ - List and search standard job roles taxonomy for onboarding selection
    """
    queryset = JobRoleTaxonomy.objects.filter(is_active=True).order_by('role_title')
    serializer_class = JobRoleTaxonomySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        domain = self.request.query_params.get('domain')
        if search:
            queryset = queryset.filter(role_title__icontains=search)
        if domain:
            queryset = queryset.filter(department_domain__iexact=domain)
        return queryset


class JobListingListView(generics.ListAPIView):
    """
    GET /api/jobs/listings/ - List job opportunities
    """
    queryset = JobListing.objects.filter(is_active=True).order_by('-date_posted')
    serializer_class = JobListingSerializer
    permission_classes = [permissions.AllowAny]


class EventHackathonListView(generics.ListAPIView):
    """
    GET /api/jobs/events/ - List hackathons and tech events
    """
    queryset = EventHackathonListing.objects.filter(is_active=True).order_by('start_date')
    serializer_class = EventHackathonListingSerializer
    permission_classes = [permissions.AllowAny]
