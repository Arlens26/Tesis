from django.db import models
from datetime import datetime

# Create your models here.
class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    description = models.CharField(max_length=255, blank=True)
    credit = models.BigIntegerField()

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['id']
        verbose_name = 'course'
        verbose_name_plural = 'course'
        db_table = 'course'

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

class EvaluationVersion(models.Model):
    date = models.DateField()

    def __str__(self):
        return str(self.date)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'evaluation_version'
        verbose_name_plural = 'evaluation_version'
        db_table = 'evaluation_version'

class ScheduledCourse(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='scheduled_courses')
    period = models.ForeignKey(AcademicPeriod, on_delete=models.CASCADE, related_name='scheduled_academic_periods')
    evaluation_version = models.ForeignKey(EvaluationVersion, on_delete=models.CASCADE, related_name='scheduled_evaluation_versions')
    group = models.CharField(max_length=20)

    def __str__(self):
        return self.group
    
    class Meta:
        ordering = ['id']
        verbose_name = 'scheduled_course'
        verbose_name_plural = 'scheduled_course'
        db_table = 'scheduled_course'

class LearningOutCome(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['id']
        verbose_name = 'learning_outcome'
        verbose_name_plural = 'learning_outcome'
        db_table = 'learning_outcome'

class Percentage(models.Model):
    learning_outcome = models.ForeignKey(LearningOutCome, on_delete=models.CASCADE, related_name='percentage_outcomes')
    initial_date = models.DateField()
    end_date = models.DateField(null=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return str(self.percentage)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'percentage'
        verbose_name_plural = 'percentage'
        db_table = 'percentage'

class EvaluationVersionDetail(models.Model):
    learning_outcome = models.ForeignKey(LearningOutCome, on_delete=models.CASCADE, related_name='evaluation_details_outcomes')
    percentage = models.ForeignKey(Percentage, on_delete=models.CASCADE, related_name='evaluation_details_percentages')
    evaluation_version = models.ForeignKey(EvaluationVersion, on_delete=models.CASCADE, related_name='evaluation_details_evaluation_versions')

    def __str__(self):
        return str(id)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'evaluation_version_detail'
        verbose_name_plural = 'evaluation_version_detail'
        db_table = 'evaluation_version_detail'