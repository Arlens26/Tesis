from rest_framework import serializers
from .models import Activity, ActivityEvaluationDetail

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