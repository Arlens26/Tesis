from rest_framework import serializers
from .models import Course, AcademicPeriod, LearningOutCome

class CourseSerializer(serializers.ModelSerializer):
    period = serializers.StringRelatedField()

    class Meta:
        model = Course
        fields = '__all__'

class AcademicPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicPeriod
        fields = '__all__'

class LearningOutComeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningOutCome
        fields = '__all__'