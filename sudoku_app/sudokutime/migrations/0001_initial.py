# Generated by Django 3.2.7 on 2021-10-13 16:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Sudoku',
            fields=[
                ('unsolved', models.CharField(max_length=81)),
                ('solved', models.CharField(max_length=81, primary_key=True, serialize=False, unique=True)),
                ('positive_ratings', models.IntegerField(default=0)),
                ('negative_ratings', models.IntegerField(default=0)),
                ('timestamp', models.DateTimeField(verbose_name='date created')),
            ],
        ),
    ]
