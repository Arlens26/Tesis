from django.db import models
from courses.models import ScheduledCourse

# Create your models here.
class Activity(models.Model):
    scheduled_course = models.ForeignKey(ScheduledCourse, on_delete=models.CASCADE, related_name='scheduled_courses')
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['id']
        verbose_name = 'activity'
        verbose_name_plural = 'activity'
        db_table = 'activity'