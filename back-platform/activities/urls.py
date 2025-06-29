from django.urls import path, include
from rest_framework import routers
from activities import views

router = routers.DefaultRouter()
router.register(r'activities', views.ActivityView, 'activities')
router.register(r'activity-evaluation-detail', views.ActivityEvaluationDetailView, 'activity-evaluation-detail')
router.register(r'activity-setting', views.ActivitySettingView, 'activity-setting')
router.register(r'grade-detail-learning-outcome', views.GradeDetailLearningOutComeView, 'grade-detail-learning-outcome')
router.register(r'activity-version-detail', views.VersionDetailActivityEvaluationView, 'activity-version-detail')

urlpatterns = [
    path('all/', include(router.urls))
]

