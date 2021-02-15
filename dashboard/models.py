from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse

from .validators import validate_image_extension


class User(AbstractUser):
    is_manager = models.BooleanField(default=False)
    is_teller = models.BooleanField(default=False)
    profile_pic = models.ImageField(
        upload_to='users/profile/', blank=True, null=True, validators=[validate_image_extension])

    def get_absolute_url(self):
        return reverse('dashboard:user_profile')
