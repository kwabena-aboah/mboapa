from __future__ import unicode_literals
from django.db import models

from decimal import Decimal

from dashboard.models import User
from django.urls import reverse

from clients.get_username import current_request

from django.core.validators import RegexValidator, MinValueValidator
from dashboard.validators import validate_image_extension


# phone validator using regular expressions
phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message='Phone number invalid. Should start with example: +233'
)


class Client(models.Model):
    '''General information fields'''
    account_name = models.CharField(max_length=200)
    account_number = models.CharField(max_length=16)
    mandate = models.TextField(blank=True)
    account_purpose = models.CharField(max_length=255, blank=True)
    is_saving_account = models.BooleanField(default=True)
    is_current_account = models.BooleanField(default=False)
    is_closed_account = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    account_photo = models.ImageField(
        upload_to='passort_pic/%y-%m-%d/', blank=True, null=True, validators=[validate_image_extension])
    account_balance = models.DecimalField(
        max_digits=15, decimal_places=2, default=0, validators=[
            MinValueValidator(Decimal('10.00'))])

    '''Personal information fields'''
    name = models.CharField(max_length=200)
    MARITAL_STATUS = (
        ('Married', 'Married'),
        ('Single', 'Single'),
        ('Divorced', 'Divorced'),
    )
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS)
    GENDER = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )
    gender = models.CharField(max_length=10, choices=GENDER)
    place_of_birth = models.CharField(max_length=100, null=True)
    date_of_birth = models.DateField(auto_now_add=False)
    nationality = models.CharField(max_length=200, default='Ghanaian')
    hometown = models.CharField(max_length=200, null=True)
    region_or_state = models.CharField(max_length=200, null=True)
    mother_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    occupation = models.CharField(max_length=200, null=True)
    ssnit_number = models.CharField(max_length=13, null=True)
    tin_number = models.CharField(max_length=11, null=True)

    '''Contact details fields'''
    residential_address = models.CharField(max_length=255, null=True)
    residential_city = models.CharField(max_length=100, null=True)
    residential_region = models.CharField(max_length=200, null=True)
    residential_phone = models.CharField(
        validators=[phone_regex], max_length=15, null=True)
    RESIDENTAIL_STATUS = (
        ('Owned', 'Owned'),
        ('Rented', 'Rented'),
        ('Lodging', 'Lodging'),
        ('Family', 'Family'),
    )
    residential_status = models.CharField(
        max_length=20, choices=RESIDENTAIL_STATUS)
    NATIONAL_IDENTITY = (
        ('Voter Id', 'Voter Id'),
        ('National Passport', 'National Passport'),
        ('NHIS', 'NHIS'),
        ('ECOWAS Card', 'ECOWAS Card'),
    )
    national_identity = models.CharField(
        max_length=20, choices=NATIONAL_IDENTITY)
    id_number = models.CharField(max_length=20)
    id_issue_date = models.DateField(auto_now_add=False)
    id_expiry_date = models.DateField(auto_now_add=False)
    country_of_issue = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)

    ''' Employment detail fields'''
    EMPLOYMENT_TYPE = (
        ('Employed', 'Employed'),
        ('Self Employment', 'Self Employment'),
        ('Unemployed', 'Unemployed'),
        ('Retired', 'Retired'),
        ('Student', 'Student'),
    )
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE)
    city_of_employment = models.CharField(max_length=100, null=True)
    region_of_employment = models.CharField(max_length=200, null=True)
    nature_of_business = models.CharField(max_length=200, null=True)

    ''' Next of kin fields'''
    nxt_of_kin_name = models.CharField(max_length=200, null=True)
    nxt_of_kin_contact = models.CharField(
        validators=[phone_regex], max_length=15, null=True)
    relation_with_kin = models.CharField(max_length=200, null=True)
    nxt_of_kin_residence = models.CharField(max_length=200, null=True)
    nxt_of_kin_region = models.CharField(max_length=200, null=True)

    '''Emergency contact detail fields'''
    emergency_contact_name = models.CharField(max_length=200, null=True)
    emergency_contact_phone = models.CharField(
        max_length=15, validators=[phone_regex], null=True)
    relation_with_emergency_contact = models.CharField(
        max_length=200, null=True)
    emergency_contact_residence = models.CharField(max_length=200, null=True)
    emergency_contact_region = models.CharField(max_length=200, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return self.account_name

    # def get_account_name(self):
    #     '''Make client's name the same as account name'''
    #     self.account_name = self.name
    #     return self.account_name

    def save(self, *args, **kwargs):
        '''Create account number of user'''
        if not self.account_number:
            self.user = current_request().user
            self.account_name = self.name
            self.account_number = '551112000{user:04d}'.format(
                user=Client.objects.count())
        return super(Client, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('clients:client_list')


class Deposit(models.Model):
    '''Handles deposits'''
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name='deposits',)
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[
                                 MinValueValidator(Decimal('10.00'))])
    transaction_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.client)


class Withdrawal(models.Model):
    ''' handles withdrawals'''
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name='Withdrawals',)
    amount = models.DecimalField(decimal_places=2, max_digits=15, default=0, validators=[
                                 MinValueValidator(Decimal('10.00'))])
    transaction_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.client)


# class Interest(models.Model):
#     client = models.ForeignKey(
#         Client, on_delete=models.CASCADE, related_name='interests',)
#     amount = models.DecimalField(decimal_places=2, max_digits=15, validators=[
#                                  MinValueValidator(Decimal('10.00'))])
#     transaction_time = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return str(self.client)
