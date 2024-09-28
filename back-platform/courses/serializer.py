from rest_framework import serializers
from .models import Course, AcademicPeriod, EvaluationVersion, ScheduledCourse, LearningOutCome, Percentage, EvaluationVersionDetail, StudentEnrolledCourse

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
    class Meta:
        model = EvaluationVersionDetail
        fields = '__all__'

class StudentEnrolledCourseSerializer(serializers.ModelSerializer):
    scheduled_course = serializers.SerializerMethodField()

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
                    }
                },
                'professor': {
                    'id': scheduled_course.professor_id,
                    'first_name': scheduled_course.professor.first_name,
                    'last_name': scheduled_course.professor.last_name,
                }
        }
    
    class Meta:
        model = StudentEnrolledCourse
        fields = ['id', 'scheduled_course']


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
