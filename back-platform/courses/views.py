from rest_framework import viewsets, status
from rest_framework.response import Response
#from rest_framework.views import APIView
from .serializer import CourseSerializer, AcademicPeriodSerializer, EvaluationVersionSerializer, ScheduledCourseSerializer, LearningOutComeSerializer, PercentageSerializer, EvaluationVersionDetailSerializer
from .models import Course, AcademicPeriod, EvaluationVersion, ScheduledCourse, LearningOutCome, Percentage, EvaluationVersionDetail
#from django.http import JsonResponse
from datetime import datetime
from decimal import Decimal
from rest_framework.decorators import action
from django.contrib.auth.models import User

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

class CreateEvaluationVersionCourseView(viewsets.ViewSet):
    serializer_class = EvaluationVersionSerializer

    def create(self, request):
        course_data = request.data.get('course')
        learning_outcome_data = request.data.get('learning_outcome')
        print(request)
        # Validar si existe una evaluacion de versión del curso
        existing_evaluation_version = EvaluationVersion.objects.filter(course_id=course_data['id']).order_by('-initial_date').first()
        print(existing_evaluation_version)
        if existing_evaluation_version:
            existing_evaluation_version.end_date = datetime.now().date()
            existing_evaluation_version.save()
            initial_date = datetime.now().date()
        else:
            initial_date = datetime.now().date()

        # Crear instancia de evaluation version
        evaluation_version_serializer = EvaluationVersionSerializer(data={
            'course': course_data['id'],
            'initial_date': initial_date,
            'end_date': None
        })

        # Validar y guardar la instancia evaluation version, learning outcome y percentage
        if evaluation_version_serializer.is_valid():
            evaluation_version_instance = evaluation_version_serializer.save()

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

                            print('Outcome id:',outcome_instance.pk)
                            
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
                        
            return Response({'message': 'Evaluation version course created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': evaluation_version_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class CreateScheduledCourseView(viewsets.ViewSet):
    serializer_class = ScheduledCourseSerializer

    def create(self, request):
        # Obtener los datos del request
        version_id = request.data.get('version_id')
        academic_period_data = request.data.get('academic_period')
        group = request.data.get('group')
        professor_id = request.data.get('professor_id')

        # Verificar si existe un periodo académico
        year = academic_period_data.get('year')
        semester = academic_period_data.get('semester')
        existing_academic_period = AcademicPeriod.objects.filter(year=year, semester=semester).first()
        #existing_academic_period = AcademicPeriod.objects.filter(id=academic_period_data['id']).first()

        if not existing_academic_period:
            academic_period_serializer = AcademicPeriodSerializer(data={'year':year, 'semester':semester})
            if academic_period_serializer.is_valid():
                # Crear instancia de AcademicPeriod
                academic_period_instance = academic_period_serializer.save()
            else:
                return Response({'error': academic_period_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            academic_period_instance = existing_academic_period

        print(User.objects.filter(id=professor_id))
        print(professor_id)
        try:
            professor = User.objects.get(id=professor_id, groups__name='professor')
            print(professor)
        except User.DoesNotExist:
            return Response({'error':'User is not a professor'}, status=status.HTTP_400_BAD_REQUEST)
        except User.MultipleObjectsReturned:
            return Response({'error': 'Multiple users with the same ID'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear instancias de EvaluationVersion
        #evaluation_version_serializer = EvaluationVersionSerializer(data=evaluation_version_data)
        
        # Validar y guardar las instancias de AcademicPeriod y EvaluationVersion
        #if evaluation_version_serializer.is_valid():
            #evaluation_version_instance = evaluation_version_serializer.save()

        # Crear el ScheduledCourse usando las instancias creadas
        scheduled_course_serializer = ScheduledCourseSerializer(data={
            'group': group, 
            'evaluation_version': version_id,
            'period': academic_period_instance.pk,
            'professor': professor_id
        })

        # Validar y guardar el ScheduledCourse
        if scheduled_course_serializer.is_valid():
            scheduled_course_serializer.save()                

            return Response({'message': 'Scheduled course created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': scheduled_course_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        #else:
            # Manejar errores de validación
            #errors = {}
            #errors.update(academic_period_serializer.errors)
            #errors.update(evaluation_version_serializer.errors)
            #return Response({'error': errors}, status=status.HTTP_400_BAD_REQUEST)

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