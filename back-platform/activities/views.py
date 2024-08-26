from rest_framework import viewsets
from .models import Activity, ActivityEvaluationDetail, GradeDetailLearningOutCome
from .serializer import ActivitySerializer, ActivityEvaluationDetailSerializer, GradeDetailLearningOutComeSerializer

# Create your views here.
class ActivityView(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()

class ActivityEvaluationDetailView(viewsets.ModelViewSet):
    serializer_class = ActivityEvaluationDetailSerializer
    queryset = ActivityEvaluationDetail.objects.all()

class GradeDetailLearningOutComeView(viewsets.ModelViewSet):
    serializer_class = GradeDetailLearningOutComeSerializer
    queryset = GradeDetailLearningOutCome.objects.all()