from django.db import models

class News(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    body = models.TextField()
    state = models.IntegerField()
    ordering = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
