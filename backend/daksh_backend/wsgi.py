import os
from django.core.wsgi import get_wsgi_application  # type: ignore

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daksh_backend.settings')

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daksh_backend.settings')
application = get_wsgi_application()
