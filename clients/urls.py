from django.urls import path
from . import views
from . views import (ClientListView, ClientCreateView,
                     ClientEditView, ClientDetailView)

app_name = 'clients'
urlpatterns = [
    path('clients/', ClientListView.as_view(), name='client_list'),
    path('clients/create/new/',
         ClientCreateView.as_view(), name='create_client'),
    path('clients/update/<int:pk>/',
         ClientEditView.as_view(), name='edit_client'),
    path('clients/detail/<int:pk>/',
         ClientDetailView.as_view(), name='client_detail'),
    path('clients/inactive/<int:pk>/',
         views.delete_client, name='delete_client'),
    # path('clients/permanent/delete/<int:pk>/',
    #      views.permanent_delete, name='permanent_delete'),
    path('deposits/', views.deposit_view, name='deposits'),
    path('withdrawals', views.withdrawal_view, name='withdrawals'),
    path('transaction_view/', views.transaction_view, name='transaction_view'),
    path('deposit/receipt/<int:pk>/', views.print_client_deposit,
         name='print_client_deposit'),
    path('withdrawal/receipt/<int:pk>/', views.print_client_withdrawal,
         name='print_client_withdrawal'),
]
