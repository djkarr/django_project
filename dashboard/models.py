from django.db import models

class Goal(models.Model):
    goal = models.CharField(max_length=100)
    description = models.CharField(max_length=400)


    def __str__(self):
        return self.goal


    