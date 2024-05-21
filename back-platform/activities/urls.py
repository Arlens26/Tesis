from django.urls import path, include
from rest_framework import routers
from courses import views

router = routers.DefaultRouter()
router.register(r'activities', views.CourseView, 'activities')

urlpatterns = [
    path('all/', include(router.urls))
]

