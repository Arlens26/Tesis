from rest_framework import viewsets, status
from rest_framework.response import Response
#from rest_framework.views import APIView
from .serializer import CourseSerializer, AcademicPeriodSerializer, EvaluationVersionSerializer, ScheduledCourseSerializer, LearningOutComeSerializer, PercentageSerializer
from .models import Course, AcademicPeriod, EvaluationVersion, LearningOutCome, Percentage
#from django.http import JsonResponse

# Create your views here.
class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

class AcademicPeriodView(viewsets.ModelViewSet):
    serializer_class = AcademicPeriodSerializer
    queryset = AcademicPeriod.objects.all()

class EvaluationVersionView(viewsets.ModelViewSet):
    serializer_class = EvaluationVersionSerializer
    queryset = EvaluationVersion.objects.all()

class LearningOutComeView(viewsets.ModelViewSet):
    serializer_class = LearningOutComeSerializer
    queryset = LearningOutCome.objects.all()

class PercentageView(viewsets.ModelViewSet):
    serializer_class = PercentageSerializer
    queryset = Percentage.objects.all()

class CreateScheduledCourseView(viewsets.ViewSet):
    serializer_class = ScheduledCourseSerializer

    def create(self, request):
        # Obtener los datos del request
        course_data = request.data.get('course')
        academic_period_data = request.data.get('academic_period')
        evaluation_version_data = request.data.get('evaluation_version')
        group = request.data.get('group')

        # Crear instancias de Course, AcademicPeriod, y EvaluationVersion
        course_serializer = CourseSerializer(data=course_data)
        academic_period_serializer = AcademicPeriodSerializer(data=academic_period_data)
        evaluation_version_serializer = EvaluationVersionSerializer(data=evaluation_version_data)
        
        # Validar y guardar las instancias de Course, AcademicPeriod, y EvaluationVersion
        if course_serializer.is_valid() and academic_period_serializer.is_valid() and evaluation_version_serializer.is_valid():
            course_instance = course_serializer.save()
            academic_period_instance = academic_period_serializer.save()
            evaluation_version_instance = evaluation_version_serializer.save()

            # Crear el ScheduledCourse usando las instancias creadas
            scheduled_course_serializer = ScheduledCourseSerializer(data={
                'course': course_instance.pk,
                'period': academic_period_instance.pk,
                'evaluation_version': evaluation_version_instance.pk,
                'group': group
            })

            # Validar y guardar el ScheduledCourse
            if scheduled_course_serializer.is_valid():
                scheduled_course_serializer.save()
                return Response({'message': 'Scheduled course created successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': scheduled_course_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Manejar errores de validación
            errors = {}
            errors.update(course_serializer.errors)
            errors.update(academic_period_serializer.errors)
            errors.update(evaluation_version_serializer.errors)
            return Response({'error': errors}, status=status.HTTP_400_BAD_REQUEST)