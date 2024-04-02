from rest_framework import viewsets, status
from rest_framework.response import Response
#from rest_framework.views import APIView
from .serializer import CourseSerializer, AcademicPeriodSerializer, EvaluationVersionSerializer, ScheduledCourseSerializer, LearningOutComeSerializer, PercentageSerializer, EvaluationVersionDetailSerializer
from .models import Course, AcademicPeriod, EvaluationVersion, ScheduledCourse, LearningOutCome, Percentage, EvaluationVersionDetail
#from django.http import JsonResponse
from datetime import datetime
from decimal import Decimal
from rest_framework.decorators import action

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
        learning_outcome_data = request.data.get('learning_outcome')
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

                for outcome_data in learning_outcome_data:
                    outcome_serializer = LearningOutComeSerializer(data=outcome_data)
                    if outcome_serializer.is_valid():
                        outcome_instance = outcome_serializer.save()

                        percentage_value = Decimal(outcome_data['percentage'].replace('%', ''))
                        
                        percentage_serializer = PercentageSerializer(data={
                            'initial_date': datetime.now().date(),
                            'end_date': None,
                            'percentage': percentage_value,
                            'learning_outcome_id': outcome_instance.pk
                        })
                        #print("percentage serializer:", percentage_serializer)
                        #print("percentage_value:", percentage_value)
                        print('Outcome id:',outcome_instance.pk)
                        
                        #percentage_instance = Percentage.objects.create(
                         #   learning_outcome=outcome_instance.pk,
                          #  initial_date=datetime.now().date(),
                          #  percentage=outcome_data['percentage'].replace('%', '')
                        #)
                        if percentage_serializer.is_valid():
                            percentage_instance = percentage_serializer.save()
                            print(percentage_instance.pk)
                            evaluation_version_detail_instance = EvaluationVersionDetail.objects.create(
                                learning_outcome=outcome_instance,
                                percentage=percentage_instance,
                                evaluation_version=evaluation_version_instance
                            )
                            print("percentage_serializer data:", percentage_serializer.validated_data)
                            print("evaluation_version_detail_instance:", evaluation_version_detail_instance)
                        else:
                            print("Error in percentage_serializer validation:", percentage_serializer.errors)

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

class ScheduledCourseVersionDetailView(viewsets.ViewSet):
    serializer_class = ScheduledCourseSerializer

    @action(detail=False, methods=['get'])
    def get_details_by_evaluation_version(self, request):
        evaluation_version_id = request.query_params.get('evaluation_version_id', None)

        if evaluation_version_id is None:
            return Response({'error': 'evaluation_version_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            scheduled_courses = ScheduledCourse.objects.filter(evaluation_version__id=evaluation_version_id)
            evaluation_version_details = EvaluationVersionDetail.objects.filter(evaluation_version__id=evaluation_version_id)

            serialized_scheduled_courses = ScheduledCourseSerializer(scheduled_courses, many=True).data
            serialized_evaluation_version_details = EvaluationVersionDetailSerializer(evaluation_version_details, many=True).data

            response_data = {
                'scheduled_courses': serialized_scheduled_courses,
                'evaluation_version_details': serialized_evaluation_version_details
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)