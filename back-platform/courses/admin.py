from django.contrib import admin
from .models import Course, AcademicPeriod, LearningOutCome

# Register your models here.
admin.site.register([Course, AcademicPeriod, LearningOutCome])