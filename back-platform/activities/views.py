from rest_framework import viewsets
from .models import Activity, ActivityEvaluationDetail
from .serializer import ActivitySerializer, ActivityEvaluationDetailSerializer

# Create your views here.
class ActivityView(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()

class ActivityEvaluationDetailView(viewsets.ModelViewSet):
    serializer_class = ActivityEvaluationDetailSerializer
    queryset = ActivityEvaluationDetail.objects.all()