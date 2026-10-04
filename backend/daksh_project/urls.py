from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    DAKSH Backend API root providing entry points and endpoint documentation.
    """
    return Response({
        'service': 'DAKSH AI Career Acceleration Platform Backend API',
        'status': 'healthy',
        'version': 'v1',
        'endpoints': {
            'auth': {
                'register': request.build_absolute_uri('/api/auth/register/'),
                'login': request.build_absolute_uri('/api/auth/login/'),
                'logout': request.build_absolute_uri('/api/auth/logout/'),
                'current_user': request.build_absolute_uri('/api/auth/me/'),
                'profile': request.build_absolute_uri('/api/auth/profile/'),
                'onboarding_status': request.build_absolute_uri('/api/auth/onboarding/status/'),
                'onboarding_submit': request.build_absolute_uri('/api/auth/onboarding/'),
                'user_skills': request.build_absolute_uri('/api/auth/skills/'),
                'token_refresh': request.build_absolute_uri('/api/auth/token/refresh/'),
                'token_verify': request.build_absolute_uri('/api/auth/token/verify/'),
                'change_password': request.build_absolute_uri('/api/auth/change-password/'),
            },
            'skills_taxonomy': request.build_absolute_uri('/api/skills/'),
            'job_roles_taxonomy': request.build_absolute_uri('/api/jobs/roles/'),
            'job_listings': request.build_absolute_uri('/api/jobs/listings/'),
            'admin': request.build_absolute_uri('/admin/'),
        }
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/auth/', include('apps.accounts.urls', namespace='auth')),
    path('api/skills/', include('apps.skills.urls', namespace='skills')),
    path('api/jobs/', include('apps.jobs.urls', namespace='jobs')),
]
