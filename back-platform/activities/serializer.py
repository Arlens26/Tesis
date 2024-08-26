from rest_framework import serializers
from .models import Activity, ActivityEvaluationDetail, GradeDetailLearningOutCome

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class ActivityEvaluationDetailSerializer(serializers.ModelSerializer):
    activity = serializers.SerializerMethodField()

    def get_activity(self, obj):
        activity_info = {
            'id': obj.activity.id,
            'name': obj.activity.name,
            'description': obj.activity.description,
            'scheduled_course_id': obj.activity.scheduled_course_id
        }
        return activity_info

    class Meta:
        model = ActivityEvaluationDetail
        #fields = '__all__'
        fields = ['id', 'percentage', 'activity', 'version_evaluation_detail_id']


class GradeDetailLearningOutComeSerializer(serializers.ModelSerializer):
    enrolled_course = serializers.SerializerMethodField()
    activity_evaluation_detail = serializers.SerializerMethodField()
    grade = serializers.DecimalField(max_digits=5, decimal_places=2)
    
    def get_enrolled_course(self, obj):
        enrolled_course = obj.enrolled_course
        return {
            'id': enrolled_course.id,
            'student': {
                'name': enrolled_course.student.first_name,
            },
            'course': {
                'id': enrolled_course.scheduled_course.id, 
                'name': enrolled_course.scheduled_course.group,
            }
        }

    def get_activity_evaluation_detail(self, obj):
        activity_evaluation_detail = obj.activity_evaluation_detail
        return {
            'id': activity_evaluation_detail.id,
            'activities': {
                'id': activity_evaluation_detail.activity.id,
                'name': activity_evaluation_detail.activity.name,
                'description': activity_evaluation_detail.activity.description,
            },
            'percentage': activity_evaluation_detail.percentage,
            'version_evaluation_detail' : activity_evaluation_detail.version_evaluation_detail_id,
        }
    
    class Meta:
        model = GradeDetailLearningOutCome
        fields = ['id', 'enrolled_course', 'activity_evaluation_detail', 'grade']