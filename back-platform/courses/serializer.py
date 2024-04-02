from rest_framework import serializers
from .models import Course, AcademicPeriod, EvaluationVersion, ScheduledCourse, LearningOutCome, Percentage, EvaluationVersionDetail

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
    class Meta:
        model = ScheduledCourse
        fields = '__all__'

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
