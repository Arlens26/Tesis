from django.urls import path, include
from rest_framework import routers
from authentication.views import UserViewSet, ProfessorListView, StudentListView
from django.views.decorators.csrf import csrf_exempt

router = routers.DefaultRouter()
router.register(r'user', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('professors/', ProfessorListView.as_view({'get': 'list'}), name='professors-list'),
    path('students/', StudentListView.as_view({'get': 'list'}), name='students-list')
]