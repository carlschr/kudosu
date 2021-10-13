from django.db import models

# Create your models here.
class Sudoku(models.Model):
    unsolved = models.CharField(max_length=81)
    solved = models.CharField(max_length=81, primary_key=True, unique=True)
    positive_ratings = models.IntegerField(default=0)
    negative_ratings = models.IntegerField(default=0)
    timestamp = models.DateTimeField('date created')

    def __str__(self):
        return self.solved