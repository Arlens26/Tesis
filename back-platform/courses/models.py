from django.db import models

# Create your models here.
class Course(models.Model):
    name = models.CharField(max_length=200)
    decription = models.CharField(blank=True)
    creditos = models.BigIntegerField()

    def __str__(self):
        return self.name