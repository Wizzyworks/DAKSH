from django.urls import path
from .views import JobRoleTaxonomyListView, JobListingListView, EventHackathonListView

app_name = 'jobs'

urlpatterns = [
    path('roles/', JobRoleTaxonomyListView.as_view(), name='job_roles_list'),
    path('listings/', JobListingListView.as_view(), name='job_listings_list'),
    path('events/', EventHackathonListView.as_view(), name='events_list'),
]
