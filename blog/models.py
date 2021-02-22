from django.db import models
from django_resized import ResizedImageField

class Blog(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    image = ResizedImageField(size=[720,576], upload_to='dashboard/images/', keep_meta=False, quality=100, blank=True, null=True)
    url = models.URLField(blank=True)

    def __str__(self):
        return self.title
