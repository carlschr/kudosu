from django.db import models
from django.core.validators import RegexValidator

# Create your models here.
class Sudoku(models.Model):
    unsolved = models.CharField(validators=[RegexValidator(regex='^[1-9\.]{81}$', message='Length has to be 81', code='nomatch')])
    solved = models.CharField(validators=[RegexValidator(regex='^[1-9]{81}$', message='Length has to be 81', code='nomatch')], primary_key=True, unique=True)
    positive_ratings = models.IntegerField(default=0)
    negative_ratings = models.IntegerField(default=0)
    timestamp = models.DateTimeField('date created')

    def __str__(self):
        return self.solved