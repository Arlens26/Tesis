"""
WSGI config for class_evaluator project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'class_evaluator.settings')

application = get_wsgi_application()

path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
