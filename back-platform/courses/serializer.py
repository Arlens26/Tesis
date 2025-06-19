from rest_framework import serializers
from .models import Course, AcademicPeriod, EvaluationVersion, ScheduledCourse, LearningOutCome, Percentage, EvaluationVersionDetail, StudentEnrolledCourse
from activities.serializer import ActivityEvaluationDetail, GradeDetailLearningOutCome
from statistics import mean, median
from django.db.models import Sum, F, FloatField

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
    activity_evaluation_detail = serializers.SerializerMethodField()
    grade_detail_learning_outcome = serializers.SerializerMethodField()
    ra_statistics = serializers.SerializerMethodField()
    overall_ra_statistics = serializers.SerializerMethodField()
    #average = serializers.SerializerMethodField()
    #median = serializers.SerializerMethodField()
    #mean = serializers.SerializerMethodField()

    def get_overall_ra_statistics(self, obj):

        # Obtener todos los detalles de calificaciones para el curso programado
        grade_details = (
            GradeDetailLearningOutCome.objects.filter(
                activity_evaluation_detail__activity__scheduled_course=obj.scheduled_course
            )
            .values(
                'enrolled_course',  # Agrupar por estudiante
                'activity_evaluation_detail__version_evaluation_detail__learning_outcome__code'  # Agrupar por RA
            )
            .annotate(
                sum_grade_percentage=Sum(F('grade') * F('activity_evaluation_detail__percentage'), output_field=FloatField()),
                sum_percentage=Sum(F('activity_evaluation_detail__percentage'), output_field=FloatField())
            )
        )

        # Calcular el promedio por RA para cada estudiante
        student_ra_averages = {}
        for detail in grade_details:
            ra_code = detail['activity_evaluation_detail__version_evaluation_detail__learning_outcome__code']
            sum_gp = detail['sum_grade_percentage'] or 0
            sum_p = detail['sum_percentage'] or 0

            if sum_p == 0:
                avg = 0.0
            else:
                max_possible = sum_p * 5
                avg = (sum_gp / max_possible) * 100 if max_possible != 0 else 0.0

            if ra_code not in student_ra_averages:
                student_ra_averages[ra_code] = []
            student_ra_averages[ra_code].append(avg)

        # Calcular estadísticas generales por RA
        overall_stats = []
        for ra_code, averages in student_ra_averages.items():
            if not averages:
                continue
            #print('student_ra:', student_ra_averages.items())
            # Promedio
            avg = sum(averages) / len(averages)
            print('averages:' , sum(averages))
            print('len:' , len(averages))
            print('sum average:' , avg)
            # Mediana
            sorted_avg = sorted(averages)
            n = len(sorted_avg)
            if n % 2 == 1:
                median = sorted_avg[n // 2]
            else:
                median = (sorted_avg[n//2 - 1] + sorted_avg[n//2]) / 2

            overall_stats.append({
                "ra_code": ra_code,
                "average": round(avg, 2),
                "median": round(median, 2),
                "mean": round(avg, 2),  # Ajustar si 'mean' es diferente
            })

        return overall_stats

    def get_ra_statistics(self, obj):
        enrolled_course_id = obj.id
        grade_details = GradeDetailLearningOutCome.objects.filter(
            enrolled_course_id=enrolled_course_id
        ).select_related(
            'activity_evaluation_detail__version_evaluation_detail__learning_outcome',
            'activity_evaluation_detail__activity'
        )
        learning_outcomes_statistics = {}

        # Organizar las notas por RA
        for grade_detail in grade_details:
            learning_outcome_code = grade_detail.activity_evaluation_detail.version_evaluation_detail.learning_outcome.code
            activity = grade_detail.activity_evaluation_detail.activity
            percentage = grade_detail.activity_evaluation_detail.percentage / 100  # Convertir a decimal
            
            if learning_outcome_code not in learning_outcomes_statistics:
                learning_outcomes_statistics[learning_outcome_code] = {
                    "grades": [],
                    "max_scores": [],
                }

            # Agregar notas y puntajes ponderados
            learning_outcomes_statistics[learning_outcome_code]["grades"].append(grade_detail.grade * percentage)
            learning_outcomes_statistics[learning_outcome_code]["max_scores"].append(5 * percentage)

        # Calcular estadísticas para cada RA
        learning_outcomes_results = []
        for ra_code, stats in learning_outcomes_statistics.items():
            grades = stats["grades"]
            max_scores = stats["max_scores"]
            #print('grades:', grades)
            #print('max_scores:', max_scores)
            if grades and max_scores:
                average = sum(grades) / sum(max_scores) * 100  # Promedio ponderado como porcentaje
                #print('Average:', average)
                #median_value = median([grade / max_score * 100 for grade, max_score in zip(grades, max_scores)])
                #mean_value = mean([grade / max_score * 100 for grade, max_score in zip(grades, max_scores)])
            #else:
                #average = median_value = mean_value = 0

            learning_outcomes_results.append({
                "learning_outcome_code": ra_code,
                "average": round(average, 2),
                #"median": round(median_value, 2),
                #"mean": round(mean_value, 2),
            })

        return learning_outcomes_results


    def get_activity_evaluation_detail(self, obj):
        activity_evaluation_detail = ActivityEvaluationDetail.objects.filter(
            activity__scheduled_course=obj.scheduled_course
        ).select_related(
            'version_evaluation_detail__learning_outcome',
            'activity'
        )
        activities_data = [
            {
                'id': detail.id,
                "activity_id": detail.activity.id,
                "name": detail.activity.name,
                "description": detail.activity.description,
                "learning_outcome": detail.version_evaluation_detail.learning_outcome.code,
                "percentage": detail.percentage
            }
            for detail in activity_evaluation_detail
        ]
        return activities_data if activity_evaluation_detail else None

    def get_grade_detail_learning_outcome(self, obj):
        enrolled_course_id = obj.id  
        grade_details = GradeDetailLearningOutCome.objects.filter(
            enrolled_course_id=enrolled_course_id
        ).select_related(
            'activity_evaluation_detail__activity',
            'activity_evaluation_detail__version_evaluation_detail__learning_outcome'
        )
        
        grade_details_data = []
        for grade_detail in grade_details:
            activity = grade_detail.activity_evaluation_detail.activity  # Relación con la actividad
            grade_details_data.append({
                "activity_evaluation_detail_id": grade_detail.activity_evaluation_detail.id,
                "grade": grade_detail.grade,
                "code": grade_detail.activity_evaluation_detail.version_evaluation_detail.learning_outcome.code,
                "activity": {
                    "id": activity.id,
                    "name": activity.name,
                    "description": activity.description
                }
        })
        return grade_details_data if grade_details_data else None

    '''
    def get_average(self, obj):
        grades, max_scores = self._get_grades_and_max_scores(obj)
        if max_scores:
            weighted_average = sum(grades) / sum(max_scores) * 100  # Escalado a porcentaje
            return round(weighted_average, 2)  # Redondear a dos decimales
        return 0

    def get_median(self, obj):
        grades, max_scores = self._get_grades_and_max_scores(obj)
        if max_scores:
            # Normalizar notas y calcular la mediana
            normalized_grades = [grade / max_score * 100 for grade, max_score in zip(grades, max_scores)]
            return round(median(normalized_grades), 2)  # Redondear a dos decimales
        return 0

    def get_mean(self, obj):
        grades, max_scores = self._get_grades_and_max_scores(obj)
        if max_scores:
            # Normalizar notas y calcular la media
            normalized_grades = [grade / max_score * 100 for grade, max_score in zip(grades, max_scores)]
            return round(mean(normalized_grades), 2)  # Redondear a dos decimales
        return 0

    def _get_grades_and_max_scores(self, obj):
        grades = []
        max_scores = []
        grade_details = self.get_grade_detail_learning_outcome(obj)
        activity_details = self.get_activity_evaluation_detail(obj)
        
        if grade_details and activity_details:
            # Crear un diccionario de actividades por ID para acceder rápidamente al porcentaje
            activity_map = {activity['activity_id']: activity for activity in activity_details}
            #print(f"activity_map {activity_map}")
            for grade_detail in grade_details:
                activity_id = grade_detail['activity']['id']
                #percentage = activity_map[activity_id]['percentage'] / 100  # Convertir a decimal
                try:
                    percentage = activity_map[activity_id]['percentage'] / 100
                    # Continúa con el cálculo
                except KeyError:
                    # Maneja el caso donde 'percentage' no existe
                    print(f"No se encontró el porcentaje para la actividad {activity_id}")
                    continue
                # Calcular la nota acumulada y el puntaje máximo
                grades.append(grade_detail['grade'] * percentage)
                max_scores.append(5 * percentage)  # 5 es la nota máxima por actividad
        
        return grades, max_scores
    
    '''

    '''
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation.get('activity_evaluation_detail'):
            representation.pop('activity_evaluation_detail', None)
        if not representation.get('grade_detail_learning_outcome'):
            representation.pop('grade_detail_learning_outcome', None)
        return representation
    '''

    class Meta:
        fields = [
            'student_enrolled_course',
            'activity_evaluation_detail',
            'grade_detail_learning_outcome',
            'ra_statistics',
            'overall_ra_statistics',
            #'average',
            #'median',
            #'mean',
        ]


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
