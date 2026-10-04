"""
URL Configuration for DAKSH backend.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/skill-gap/', include('skill_gap.urls')),
]
