from django.urls import path, include
from rest_framework import routers
from courses import views

router = routers.DefaultRouter()
router.register(r'courses', views.CourseView, 'courses')
router.register(r'academic-periods', views.AcademicPeriodView, 'academic-periods')
router.register(r'evaluation-version', views.EvaluationVersionView, 'evaluation-version')
router.register(r'create-scheduled-course', views.CreateScheduledCourseView, 'create-scheduled-course')
router.register(r'learning-outcome', views.LearningOutComeView, 'learning-outcome')
router.register(r'percentage', views.PercentageView, 'percentage')
router.register(r'scheduled-course-detail', views.ScheduledCourseVersionDetailView, 'scheduled-course-detail')

urlpatterns = [
    path('all/', include(router.urls))
]