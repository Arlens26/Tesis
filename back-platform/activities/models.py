from django.db import models
from courses.models import ScheduledCourse, EvaluationVersionDetail, StudentEnrolledCourse

# Create your models here.
class Activity(models.Model):
    scheduled_course = models.ForeignKey(ScheduledCourse, on_delete=models.CASCADE, related_name='activity_scheduled_courses')
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['id']
        verbose_name = 'activity'
        verbose_name_plural = 'activity'
        db_table = 'activity'

class ActivityEvaluationDetail(models.Model):
    version_evaluation_detail = models.ForeignKey(EvaluationVersionDetail, on_delete=models.CASCADE, related_name='evaluation_version_details')
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='activities')
    percentage = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self) -> str:
        return str(self.activity) + '-' + str(self.percentage)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'activity_evaluation_detail'
        verbose_name_plural = 'activity_evaluation_detail'
        db_table = 'activity_evaluation_detail'

class GradeDetailLearningOutCome(models.Model):
    enrolled_course = models.ForeignKey(StudentEnrolledCourse, on_delete=models.CASCADE, related_name='student_enrolled_courses')
    activity_evaluation_detail = models.ForeignKey(ActivityEvaluationDetail, on_delete=models.CASCADE, related_name='activity_evaluation_details') 
    grade = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return str(self.enrolled_course) + '-' + str(self.grade)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'grade_detail_learning_outcome'
        verbose_name_plural = 'grade_detail_learning_outcome'
        db_table = 'grade_detail_learning_outcome'