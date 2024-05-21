from rest_framework import viewsets
from .models import Activity
from .serializer import ActivitySerializer

# Create your views here.
class ActivityView(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()