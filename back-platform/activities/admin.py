from django.contrib import admin
from .models import Activity, ActivityEvaluationDetail, GradeDetailLearningOutCome

# Register your models here.
admin.site.register(
    [
        Activity, ActivityEvaluationDetail, GradeDetailLearningOutCome
    ]
)