from rest_framework import viewsets
from .serializer import CourseSerializer
from .models import Course

# Create your views here.
class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()