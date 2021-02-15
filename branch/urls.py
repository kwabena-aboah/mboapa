from django.urls import path
from . import views
from . views import (BranchCreateView, BranchDetailView,
                     BranchEditView, BranchListView)

app_name = 'branch'

urlpatterns = [
    path('branch/', BranchListView.as_view(), name='branch_list'),
    path('branch/create/', BranchCreateView.as_view(), name='create_branch'),
    path('branch/detail/<int:pk>/',
         BranchDetailView.as_view(), name='branch_detail'),
    path('branch/edit/<int:pk>/',
         BranchEditView.as_view(), name='edit_branch'),
    path('branch/inactive/<int:pk>/',
         views.delete_branch, name='delete_branch'),
]
