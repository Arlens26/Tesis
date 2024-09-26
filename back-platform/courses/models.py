from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.forms import ValidationError
from django.utils.translation import gettext_lazy as _
#from django.db.models.signals import pre_save
from django.db.models.signals import post_save

# Courses models.

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
    year = models.IntegerField()
    semester = models.IntegerField(choices=[(1, '1'), (2, '2')])

    def __str__(self):
        return str(self.year) + '-' + str(self.semester)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'academic_period'
        verbose_name_plural = 'academic_period'
        db_table = 'academic_period'

class EvaluationVersion(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='scheduled_courses')
    initial_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return str(self.initial_date)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'evaluation_version'
        verbose_name_plural = 'evaluation_version'
        db_table = 'evaluation_version'

class ScheduledCourse(models.Model):
    period = models.ForeignKey(AcademicPeriod, on_delete=models.CASCADE, related_name='scheduled_academic_periods')
    evaluation_version = models.ForeignKey(EvaluationVersion, on_delete=models.CASCADE, related_name='scheduled_evaluation_versions')
    professor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='professors')
    group = models.CharField(max_length=20)

    def __str__(self):
        return self.group
    
    class Meta:
        ordering = ['id']
        verbose_name = 'scheduled_course'
        verbose_name_plural = 'scheduled_course'
        db_table = 'scheduled_course'

@receiver(post_save, sender=ScheduledCourse)
def validate_professor_group(sender, instance, **kwargs):
    if not instance.professor.groups.filter(name='professor').exists():
        raise ValidationError(_('The selected professor must belong to the professor group.'))

class LearningOutCome(models.Model):
    code = models.CharField(max_length=50)
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.code
    
    class Meta:
        ordering = ['id']
        verbose_name = 'learning_outcome'
        verbose_name_plural = 'learning_outcome'
        db_table = 'learning_outcome'

class Percentage(models.Model):
    learning_outcome = models.ForeignKey(LearningOutCome, on_delete=models.CASCADE, related_name='percentage_outcomes')
    initial_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
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
        return str(self.id)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'evaluation_version_detail'
        verbose_name_plural = 'evaluation_version_detail'
        db_table = 'evaluation_version_detail'

class StudentEnrolledCourse(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='students')
    scheduled_course = models.ForeignKey(ScheduledCourse, on_delete=models.CASCADE, related_name='scheduled_courses')

    def __str__(self):
        return str(self.student) + '-' + str(self.scheduled_course)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'student_enrolled_course'
        verbose_name_plural = 'student_enrolled_course'
        db_table = 'student_enrolled_course'


@receiver(pre_save, sender=StudentEnrolledCourse)
def validate_student_group(sender, instance, **kwargs):
    if not instance.student.groups.filter(name='student').exists():
        raise ValidationError(_('The selected user must belong to the student group.'))

#@receiver(post_save, sender=ScheduledCourse)
#def validate_student_group(sender, instance, **kwargs):
#    if not instance.student.groups.filter(name='student').exists():
#        raise ValidationError(_('The selected student must belong to the student group.'))
    
#@receiver(pre_save, sender=ScheduledCourse)
#def validate_student_group(sender, instance, **kwargs):
#    if instance.student.groups.filter(name='student').exists():
#        return
#    else:
#        raise ValidationError(_('The selected student must belong to the student group.'))