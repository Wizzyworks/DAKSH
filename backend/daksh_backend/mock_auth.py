"""
Mock Auth Middleware & Helpers for DAKSH Backend.

NOTE: This mock auth layer allows developing and testing endpoints independently
before Rahul's JWT Authentication module is completed and merged.

When JWT authentication is ready:
1. Replace `get_authenticated_user_id` with `request.user.id` or DRF's `request.user.id`.
2. Update the permission classes on views to `IsAuthenticated`.
"""

import uuid
from django.utils.deprecation import MiddlewareMixin

TEST_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


def get_authenticated_user_id(request) -> uuid.UUID:
    """
    Extracts user ID from request headers or query params, defaulting to TEST_USER_ID.
    
    Header format: `X-Test-User-Id: <uuid>`
    Query param format: `?test_user_id=<uuid>`
    """
    header_user_id = request.headers.get("X-Test-User-Id")
    if header_user_id:
        try:
            return uuid.UUID(header_user_id)
        except ValueError:
            pass

    query_user_id = request.GET.get("test_user_id")
    if query_user_id:
        try:
            return uuid.UUID(query_user_id)
        except ValueError:
            pass

    # Fallback to hardcoded test user ID
    return TEST_USER_ID


class MockAuthMiddleware(MiddlewareMixin):
    """
    Middleware that attaches a mock `user_id` and `test_user` flag to incoming requests.
    """
    def process_request(self, request):
        request.mock_user_id = get_authenticated_user_id(request)
        request.is_mock_authenticated = True
