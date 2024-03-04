from django.db import models
from datetime import datetime

# Create your models here.

class AcademicPeriod(models.Model):
    year = models.IntegerField(default=datetime.now().year)
    semester = models.IntegerField(choices=[(1, '1'), (2, '2')])

    def __str__(self):
        return str(self.year) + '-' + str(self.semester)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'academic_period'
        verbose_name_plural = 'academic_period'
        db_table = 'academic_period'

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    description = models.CharField(blank=True)
    credit = models.BigIntegerField()
    period = models.ForeignKey(AcademicPeriod, on_delete=models.CASCADE, related_name='academic_period')

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['id']
        verbose_name = 'course'
        verbose_name_plural = 'course'
        db_table = 'course'

class LearningOutCome(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    course = models.ManyToManyField(Course, related_name='outcome_details')
    version_date = models.DateField()

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['id']
        verbose_name = 'learning_outcome'
        verbose_name_plural = 'learning_outcome'
        db_table = 'learning_outcome'