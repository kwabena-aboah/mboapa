from __future__ import unicode_literals
from django.db import models
from django.urls import reverse
from django.core.validators import RegexValidator

# phone validator using regular expressions
phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message='Phone number invalid. Should start with example: +233'
)


class Branch(models.Model):
    ''' Manages bank branche information'''
    name = models.CharField(max_length=100, unique=True)
    opening_date = models.DateField()
    country = models.CharField(max_length=50)
    REGION = (
        ('Ashanti Region', 'Ashanti Region'),
        ('Bono Region', 'Bono Region'),
        ('Bono East', 'Bono East'),
        ('Ahafo Region', 'Ahafo Region'),
        ('Central Region', 'Central Region'),
        ('Eastern Region', 'Eastern Region'),
        ('Greater Accra', 'Greater Accra'),
        ('Northern Region', 'Northern Region'),
        ('Savannah Region', 'Savannah Region'),
        ('North East', 'North East'),
        ('Upper East', 'Upper East'),
        ('Upper West', 'Upper West'),
        ('Volta Region', 'Volta Region'),
        ('Oti Region', 'Oti Region'),
        ('Western Region', 'Western Region'),
        ('Western North', 'Western North'),
    )
    region = models.CharField(max_length=20, choices=REGION)
    city = models.CharField(max_length=100)
    phone_number = models.CharField(validators=[phone_regex], max_length=15)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('branch:branch_list')

    class Meta:
        verbose_name = 'Branch Name'
        verbose_name_plural = 'Branch Names'
