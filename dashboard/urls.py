from django.contrib.auth.views import LoginView
from django.urls import path
from . views import HomeView
from . import views

app_name = 'dashboard'
urlpatterns = [
    path('', HomeView.as_view(), name='index'),
    path('create/user/', views.signupview, name='signup'),
    path('login/', LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/user/', views.user_profile, name='user_profile'),
    path('change/password/user/', views.change_password, name='change_password'),
]
