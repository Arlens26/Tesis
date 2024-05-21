from django.urls import path, include
from rest_framework import routers
from activities import views

router = routers.DefaultRouter()
router.register(r'activities', views.ActivityView, 'activities')

urlpatterns = [
    path('all/', include(router.urls))
]

