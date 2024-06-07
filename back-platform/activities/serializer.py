from rest_framework import serializers
from .models import Activity, ActivityEvaluationDetail

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class ActivityEvaluationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityEvaluationDetail
        fields = '__all__'