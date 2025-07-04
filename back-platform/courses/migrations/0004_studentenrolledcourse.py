# Generated by Django 5.0.2 on 2024-08-20 01:25

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_alter_scheduledcourse_professor_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentEnrolledCourse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scheduled_course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scheduled_courses', to='courses.scheduledcourse')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='students', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'student_enrolled_course',
                'verbose_name_plural': 'student_enrolled_course',
                'db_table': 'student_enrolled_course',
                'ordering': ['id'],
            },
        ),
    ]
