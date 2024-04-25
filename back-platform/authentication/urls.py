from django.urls import path, include
from rest_framework import routers
from authentication.views import UserViewSet, ProfessorListView

router = routers.DefaultRouter()
router.register(r'user', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('professors/', ProfessorListView.as_view({'get': 'list'}), name='professors-list')
]