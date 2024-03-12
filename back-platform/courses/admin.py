from django.contrib import admin
from .models import Course, AcademicPeriod, EvaluationVersion, ScheduledCourse, LearningOutCome, Percentage, EvaluationVersionDetail

# Register your models here.
admin.site.register(
    [
        Course, AcademicPeriod, EvaluationVersion, ScheduledCourse, LearningOutCome, Percentage, 
        EvaluationVersionDetail
    ]
)