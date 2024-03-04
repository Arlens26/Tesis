from django.urls import path, include
from rest_framework import routers
from courses import views

router = routers.DefaultRouter()
router.register(r'courses', views.CourseView, 'courses')
router.register(r'academic-periods', views.AcademicPeriodView, 'academic-periods')
router.register(r'learning-outcome', views.LearningOutComeView, 'learning-outcome')

urlpatterns = [
    path('all/', include(router.urls))
]