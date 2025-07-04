# Generated by Django 5.0.2 on 2024-10-29 14:41

from django.db import migrations

def set_active_field(apps, schema_editor):
    StudentEnrolledCourse = apps.get_model('courses', 'StudentEnrolledCourse')
    # Establece todos los registros existentes como activos (True)
    StudentEnrolledCourse.objects.update(active=True)

class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_studentenrolledcourse_active'),
    ]

    operations = [
        migrations.RunPython(set_active_field),
    ]
