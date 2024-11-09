from rest_framework import viewsets, status
from rest_framework.response import Response
#from rest_framework.views import APIView
from .serializer import CourseSerializer, AcademicPeriodSerializer, EvaluationVersionSerializer, ScheduledCourseSerializer, LearningOutComeSerializer, PercentageSerializer, EvaluationVersionDetailSerializer, StudentEnrolledCourseSerializer, StudentGradeReportSerializer
from .models import Course, AcademicPeriod, EvaluationVersion, ScheduledCourse, LearningOutCome, Percentage, EvaluationVersionDetail, StudentEnrolledCourse
#from django.http import JsonResponse
from datetime import datetime
from decimal import Decimal
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django_pandas.io import read_frame
import pandas as pd
from django.db import IntegrityError

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

class ScheduledCourseView(viewsets.ModelViewSet):
    serializer_class = ScheduledCourseSerializer
    queryset = ScheduledCourse.objects.all()

    def list(self, request):
        # Obtener el usuario autenticado desde la solicitud
        user = request.user

        # Verificar si el usuario autenticado es un profesor
        if user.groups.filter(name='professor').exists():
            # Filtrar los cursos programados para el profesor autenticado
            scheduled_courses = ScheduledCourse.objects.filter(professor=user)

            # Serializar y devolver los cursos programados
            serializer = ScheduledCourseSerializer(scheduled_courses, many=True)
            return Response(serializer.data)

        else:
            # Si el usuario no es un profesor, devolver un error de autorización
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

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
        existing_evaluation_version = EvaluationVersion.objects.filter(course_id=course_data['id'], end_date__isnull=True).order_by('-initial_date').first()
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

        # Validar que todos los campos requeridos
        if not version_id or not academic_period_data or not professor_id or not group:
            return Response({'error': 'Faltan datos requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si existe un periodo académico
        year = academic_period_data.get('year')
        semester = academic_period_data.get('semester')
        existing_academic_period = AcademicPeriod.objects.filter(year=year, semester=semester).first()

        if not existing_academic_period:
            academic_period_serializer = AcademicPeriodSerializer(data={'year': year, 'semester': semester})
            if academic_period_serializer.is_valid():
                # Crear instancia de AcademicPeriod
                academic_period_instance = academic_period_serializer.save()
            else:
                return Response({'error': academic_period_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            academic_period_instance = existing_academic_period

        # Obtener el profesor y verificar que pertenece al grupo de profesores
        try:
            professor = User.objects.get(id=professor_id, groups__name='professor')
        except User.DoesNotExist:
            return Response({'error': 'User is not a professor'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener la instancia de EvaluationVersion
        try:
            evaluation_version = EvaluationVersion.objects.get(id=version_id)
        except EvaluationVersion.DoesNotExist:
            return Response({'error': 'Evaluation version not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear el ScheduledCourse directamente usando los IDs
        scheduled_course = ScheduledCourse.objects.create(
            group=group,
            evaluation_version=evaluation_version,  # Instancia de EvaluationVersion
            period=academic_period_instance,        # Instancia de AcademicPeriod
            professor=professor                     # Instancia de Profesor
        )

        # Devolver una respuesta exitosa
        return Response({'message': 'Scheduled course created successfully'}, status=status.HTTP_201_CREATED)

        # Crear instancias de EvaluationVersion
        #evaluation_version_serializer = EvaluationVersionSerializer(data=evaluation_version_data)
        
        # Validar y guardar las instancias de AcademicPeriod y EvaluationVersion
        #if evaluation_version_serializer.is_valid():
            #evaluation_version_instance = evaluation_version_serializer.save()

        # Crear el ScheduledCourse usando las instancias creadas
        #scheduled_course_serializer = ScheduledCourseSerializer(data={
        #    'group': group, 
        #    'evaluation_version': evaluation_version.pk,
        #    'period': academic_period_instance,
        #    'professor': professor.pk
        #})
#
        # Validar y guardar el ScheduledCourse
        #if scheduled_course_serializer.is_valid():
        #    scheduled_course_serializer.save()                

        #    return Response({'message': 'Scheduled course created successfully'}, status=status.HTTP_201_CREATED)
        #else:
        #    return Response({'error': scheduled_course_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
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
        evaluation_version_ids = request.query_params.get('evaluation_version_ids', None)

        if not evaluation_version_ids:
            return Response({'error': 'evaluation_version_ids parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convertir los ids a una lista de enteros
            evaluation_version_ids = [int(id.strip()) for id in evaluation_version_ids.split(',')]
            
            # Obtener los scheduled courses relacionados con las evaluation versions
            scheduled_courses = ScheduledCourse.objects.filter(evaluation_version_id__in=evaluation_version_ids).prefetch_related('professor', 'period')
            
            # Serializar los scheduled courses
            serialized_scheduled_courses = ScheduledCourseSerializer(scheduled_courses, many=True).data
            
            # Obtener y serializar los detalles de las evaluation versions
            evaluation_version_details = EvaluationVersionDetail.objects.filter(evaluation_version_id__in=evaluation_version_ids).prefetch_related('learning_outcome', 'percentage')
            serialized_evaluation_version_details = EvaluationVersionDetailSerializer(evaluation_version_details, many=True).data

            # Construir la respuesta
            response_data = {
                'scheduled_courses': serialized_scheduled_courses,
                'evaluation_version_details': serialized_evaluation_version_details
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except ValueError:
            return Response({'error': 'Invalid evaluation version IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class StudentEnrolledCourseView(viewsets.ModelViewSet):
    serializer_class = StudentEnrolledCourseSerializer
    queryset = StudentEnrolledCourse.objects.all()

    @action(detail=False, methods=['put'], url_path='update-status')
    def update_status(self, request):
        student_id = request.data.get('student_id')
        scheduled_course_id = request.data.get('scheduled_course_id')

        try:
            enrolled_course = StudentEnrolledCourse.objects.get(
                student_id=student_id,
                scheduled_course_id=scheduled_course_id
            )
            # Invertir el estado del campo active
            enrolled_course.active = not enrolled_course.active
            enrolled_course.save()
        
            return Response({'message': 'Estado del estudiante actualizado exitosamente'}, status=status.HTTP_200_OK)

        except StudentEnrolledCourse.DoesNotExist:
            return Response({'error': 'Registro no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class CreateStudentEnrolledCourseView(viewsets.ModelViewSet):
    serializer_class = StudentEnrolledCourseSerializer

    def create(self, request):
        scheduled_course_id = request.data.get('scheduled_course_id')
        students_data = request.data.get('students')

        # Validar si el curso programado existe
        try:
            scheduled_course = ScheduledCourse.objects.get(id=scheduled_course_id)
        except ScheduledCourse.DoesNotExist:
            return Response({'error': 'Scheduled course not found'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener o crear el grupo 'student'
        student_group, created = Group.objects.get_or_create(name='student')

        error_messages = []  

        for student_data in students_data:
            # Crear o recuperar el usuario basado en el email
            user, created = User.objects.get_or_create(
                username=student_data['email'],
                defaults={
                    'first_name': student_data['first_name'],
                    'last_name': student_data['last_name'],
                    'email': student_data['email'],
                }
            )
            user.set_password(student_data['password'])  
            user.save()

            # Si es un usuario nuevo, asignarlo al grupo 'student'
            if created:
                user.groups.add(student_group)

            # Intentar crear la instancia de StudentEnrolledCourse
            try:
                StudentEnrolledCourse.objects.create(
                    student=user,
                    scheduled_course=scheduled_course
                )
            except IntegrityError:
                error_messages.append(f"El estudiante {user.first_name} {user.last_name} ({user.username}) ya está matriculado en este curso.")

        if error_messages:
            return Response({'Conflict: Duplicate Enrollment': error_messages}, status=status.HTTP_409_CONFLICT)

        return Response({'message': 'Students enrolled successfully'}, status=status.HTTP_201_CREATED)
    

class StudentGradeReportView(viewsets.ModelViewSet):
    serializer_class = StudentGradeReportSerializer
    queryset = StudentEnrolledCourse.objects.all()  

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Filtrar los objetos antes de serializarlos
        filtered_queryset = []
        for student_course in queryset:
            serializer = self.get_serializer(student_course)
            serialized_data = serializer.data
            if serialized_data.get('activity_evaluation_detail') or serialized_data.get('grade_detail_learning_outcome'):
                filtered_queryset.append(student_course)
        
        # Serializar sólo los objetos filtrados
        page = self.paginate_queryset(filtered_queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(filtered_queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='report')
    def student_report(self, request):
        # Verificar si el usuario pertenece al grupo "student"
        user = request.user
        if not user.groups.filter(name='student').exists():
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Filtrar los cursos en los que el estudiante está inscrito
        enrolled_courses = StudentEnrolledCourse.objects.filter(student=user)

        #enrolled_courses = StudentEnrolledCourse.objects.filter(
            #student=user
        #).exclude(grade_detail_learning_outcome=[]).exclude(activity_evaluation_detail=[])
        
        serializer = self.get_serializer(enrolled_courses, many=True)
        report_data = serializer.data
        print('report: ', report_data)

        # Crear un DataFrame a partir de los datos serializados
        df = pd.DataFrame(report_data)

        #df = df[df['grade_detail_learning_outcome'].astype(bool)]
        # Agrupar por 'scheduled_course' y conservar sólo la primera aparición para cada ID de curso programado
        #grouped_df = df.groupby('student_enrolled_course__scheduled_course__id').first().reset_index()
        df_grouped = df.groupby('scheduled_course').agg(list)
        # Agrupar por 'scheduled_course' y contar la cantidad de estudiantes por curso
        #grouped_df = df.groupby(['student_enrolled_course__scheduled_course__id', 
        #                          'student_enrolled_course__scheduled_course__evaluation_version__course__name']).size().reset_index(name='student_count')

        # Retornar el DataFrame agrupado como JSON
        return Response(df_grouped.to_dict(orient="records"), status=status.HTTP_200_OK)