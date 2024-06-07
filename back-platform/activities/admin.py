from django.contrib import admin
from .models import Activity, ActivityEvaluationDetail

# Register your models here.
admin.site.register(
    [
        Activity, ActivityEvaluationDetail
    ]
)