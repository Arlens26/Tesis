from rest_framework import serializers
from .models import Course, AcademicPeriod, EvaluationVersion, ScheduledCourse, LearningOutCome, Percentage, EvaluationVersionDetail, StudentEnrolledCourse
from activities.serializer import ActivityEvaluationDetail, GradeDetailLearningOutCome

class CourseSerializer(serializers.ModelSerializer):
    #period = serializers.StringRelatedField()
    class Meta:
        model = Course
        fields = '__all__'

class AcademicPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicPeriod
        fields = '__all__'

class EvaluationVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationVersion
        fields = '__all__'

class ScheduledCourseSerializer(serializers.ModelSerializer):
    course = serializers.SerializerMethodField()
    #period_id = serializers.ReadOnlyField()
    #professor_id = serializers.ReadOnlyField()
    evaluation_version_id = serializers.ReadOnlyField()
    period = serializers.SerializerMethodField()
    professor = serializers.SerializerMethodField()

    def get_course(self, obj):
        course_info = {
            'id': obj.evaluation_version.course.id,
            'name': obj.evaluation_version.course.name,
            'code': obj.evaluation_version.course.code,
            'description': obj.evaluation_version.course.description,
            'credit': obj.evaluation_version.course.credit
        }
        return course_info
    
    def get_period(self, obj):
        period_info = {
            'id': obj.period.id,
            'year': obj.period.year,
            'semester': obj.period.semester
        }
        return period_info

    def get_professor(self, obj):
        professor = {
            'id': obj.professor.id,
            'first_name': obj.professor.first_name,
            'last_name': obj.professor.last_name,
        }
        return professor

    class Meta:
        model = ScheduledCourse
        fields = ['id', 'course', 'group', 'period', 'professor', 'evaluation_version_id']

class LearningOutComeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningOutCome
        fields = '__all__'

class PercentageSerializer(serializers.ModelSerializer):
    learning_outcome_id = serializers.PrimaryKeyRelatedField(queryset=LearningOutCome.objects.all(), source='learning_outcome')

    class Meta:
        model = Percentage
        fields = ['id','initial_date', 'end_date', 'percentage', 'learning_outcome_id']

class EvaluationVersionDetailSerializer(serializers.ModelSerializer):
    learning_outcome = serializers.SerializerMethodField()
    percentage = serializers.SerializerMethodField()

    def get_learning_outcome(self, obj):
        learning_outcome = obj.learning_outcome

        return {
            'id': learning_outcome.id,
            'code': learning_outcome.code,
            'description': learning_outcome.description,
        }
    
    def get_percentage(self, obj):
        percentage = obj.percentage

        return { 
            'id': percentage.id,
            'initial_date': percentage.initial_date,
            'percentage': percentage.percentage,
        }

    class Meta:
        model = EvaluationVersionDetail
        fields = ['id', 'evaluation_version_id', 'learning_outcome', 'percentage']

class StudentEnrolledCourseSerializer(serializers.ModelSerializer):
    scheduled_course = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()

    def get_scheduled_course(self, obj):
        scheduled_course = obj.scheduled_course

        return {
                'id': scheduled_course.id,
                'academic_period': {
                    'id': scheduled_course.period.id,
                    'year': scheduled_course.period.year,
                    'semester': scheduled_course.period.semester,
                },
                'group': scheduled_course.group,
                'evaluation_version': {
                    'id': scheduled_course.evaluation_version_id,
                    'course': {
                        'id': scheduled_course.evaluation_version.course.id,
                        'name': scheduled_course.evaluation_version.course.name,
                        'code': scheduled_course.evaluation_version.course.code,
                        'credit': scheduled_course.evaluation_version.course.credit
                    }
                },
                'professor': {
                    'id': scheduled_course.professor_id,
                    'first_name': scheduled_course.professor.first_name,
                    'last_name': scheduled_course.professor.last_name,
                }
        }

    def get_student(self, obj):
        student = {
                'id': obj.student.id,
                'first_name': obj.student.first_name,
                'last_name': obj.student.last_name,
        }
        return student
    
    class Meta:
        model = StudentEnrolledCourse
        fields = ['id', 'scheduled_course', 'student', 'active']

class StudentGradeReportSerializer(serializers.Serializer):
    student_enrolled_course = StudentEnrolledCourseSerializer(source='*')
    #final_grade = serializers.DecimalField(max_digits=5, decimal_places=2)
    activity_evaluation_detail = serializers.SerializerMethodField()
    grade_detail_learning_outcome = serializers.SerializerMethodField()

    def get_activity_evaluation_detail(self, obj):
        # Obtener actividades y sus detalles de evaluación
        activity_evaluation_detail = ActivityEvaluationDetail.objects.filter(
            activity__scheduled_course=obj.scheduled_course
        )
        
        activities_data = []
        for activity_detail in activity_evaluation_detail:
            activities_data.append({
                'id': activity_detail.id,
                "activity_id": activity_detail.activity.id,
                "name": activity_detail.activity.name,
                "description": activity_detail.activity.description,
                "learning_outcome": activity_detail.version_evaluation_detail.learning_outcome.code,
                "percentage": activity_detail.percentage
            })
        
        return activities_data if activity_evaluation_detail else None
    
    def get_grade_detail_learning_outcome(self, obj):
        # Filtrar los detalles de calificación por enrolled_course_id
        enrolled_course_id = obj.id  
        grade_details = GradeDetailLearningOutCome.objects.filter(
            enrolled_course_id=enrolled_course_id
        )
        
        # Construir una lista para almacenar los detalles de calificación
        grade_details_data = []
        for grade_detail in grade_details:
            grade_details_data.append({
                "activity_evaluation_detail_id": grade_detail.activity_evaluation_detail.id,
                "grade": grade_detail.grade,
                "code": grade_detail.activity_evaluation_detail.version_evaluation_detail.learning_outcome.code, 
            })
        
        return grade_details_data if grade_details_data else None
    
    def to_representation(self, instance):
        # Llamamos a la representación predeterminada
        representation = super().to_representation(instance)
        # Filtramos si están vacíos
        if not representation.get('activity_evaluation_detail'):
            representation.pop('activity_evaluation_detail', None)
        if not representation.get('grade_detail_learning_outcome'):
            representation.pop('grade_detail_learning_outcome', None)
        return representation

    #def to_representation(self, instance):
        ## Estructura el JSON final para consolidar toda la información
       # representation = super().to_representation(instance)
        
        # Información adicional como el cálculo de la nota final puede realizarse aquí
        #final_grade = GradeDetailLearningOutCome.objects.filter(
        #    enrolled_course=instance
        #).aggregate(final_grade=Sum('grade'))['final_grade']
        
        #representation['final_grade'] = final_grade
        #return representation

    class Meta:
        fields = ['student_enrolled_course', 'activity_evaluation_detail', 'grade_detail_learning_outcome']


#class ScheduledCourseDetailSerializer(serializers.ModelSerializer):
  #  evaluation_details = serializers.SerializerMethodField()

   # class Meta:
   #     model = ScheduledCourse
   #     fields = ['id', 'course', 'period', 'evaluation_version', 'group', 'evaluation_details']

   # def get_evaluation_details(self, obj):
    #    evaluation_version_id = obj.evaluation_version_id
    #    evaluation_details = EvaluationVersionDetail.objects.filter(evaluation_version_id=evaluation_version_id)
     #   serializer = EvaluationVersionDetailSerializer(instance=evaluation_details, many=True)
     #   return serializer.data
