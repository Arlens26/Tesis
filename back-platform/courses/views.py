from rest_framework import viewsets
from .serializer import CourseSerializer, AcademicPeriodSerializer, LearningOutComeSerializer
from .models import Course, AcademicPeriod, LearningOutCome

# Create your views here.
class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

class AcademicPeriodView(viewsets.ModelViewSet):
    serializer_class = AcademicPeriodSerializer
    queryset = AcademicPeriod.objects.all()

class LearningOutComeView(viewsets.ModelViewSet):
    serializer_class = LearningOutComeSerializer
    queryset = LearningOutCome.objects.all()