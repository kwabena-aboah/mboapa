from django.utils import timezone

from django.shortcuts import render, reverse, get_object_or_404, redirect
from django.http import HttpResponseRedirect, Http404, HttpResponse

from dashboard.models import User
from django.db.models import Sum

from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.admin.views.decorators import staff_member_required

from django.views.generic.edit import CreateView, UpdateView
from django.views.generic import ListView, DetailView

from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.contrib.messages.views import SuccessMessageMixin

from . models import Client, Deposit, Withdrawal
from . forms import DepositForm, WithdrawalForm
from dashboard.decorators import manager_required, teller_required


#========================================================================================#
#                                   Handling Client views                                #
#========================================================================================#

class ClientListView(LoginRequiredMixin, ListView):
    template_name = 'client/list_form.html'

    model = Client
    field_list = ['id', 'account_name', 'account_number',
                  'account_balance', 'gender', 'account_photo', 'is_active', 'created_on']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['panel_name'] = 'Client Lists'
        context['panel_title'] = 'Client List'
        return context


@method_decorator([login_required, manager_required], name='dispatch')
class ClientCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    template_name = 'client/creation_form.html'

    model = Client
    success_message = 'Successfully created client'
    fields = ['name', 'mandate', 'account_purpose', 'is_saving_account', 'is_current_account',
              'is_active', 'account_photo', 'account_balance', 'marital_status', 'gender', 'place_of_birth', 'date_of_birth', 'nationality',
              'hometown', 'region_or_state', 'mother_name', 'father_name', 'occupation', 'ssnit_number', 'tin_number', 'residential_address', 'residential_city',
              'residential_region', 'residential_phone', 'residential_status', 'national_identity', 'id_number', 'id_issue_date', 'id_expiry_date',
              'country_of_issue', 'email', 'employment_type', 'city_of_employment', 'region_of_employment', 'nature_of_business', 'nxt_of_kin_name',
              'nxt_of_kin_contact', 'relation_with_kin', 'nxt_of_kin_residence', 'nxt_of_kin_region', 'emergency_contact_name', 'emergency_contact_phone',
              'relation_with_emergency_contact', 'emergency_contact_residence', 'emergency_contact_region']


@method_decorator([login_required, manager_required], name='dispatch')
class ClientEditView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    template_name = 'client/update_form.html'

    model = Client
    success_message = 'Successfully updated client'
    fields = ['name', 'mandate', 'account_purpose', 'is_saving_account', 'is_current_account',
              'is_active', 'account_photo', 'account_balance', 'marital_status', 'gender', 'place_of_birth', 'date_of_birth', 'nationality',
              'hometown', 'region_or_state', 'mother_name', 'father_name', 'occupation', 'ssnit_number', 'tin_number', 'residential_address', 'residential_city',
              'residential_region', 'residential_phone', 'residential_status', 'national_identity', 'id_number', 'id_issue_date', 'id_expiry_date',
              'country_of_issue', 'email', 'employment_type', 'city_of_employment', 'region_of_employment', 'nature_of_business', 'nxt_of_kin_name',
              'nxt_of_kin_contact', 'relation_with_kin', 'nxt_of_kin_residence', 'nxt_of_kin_region', 'emergency_contact_name', 'emergency_contact_phone',
              'relation_with_emergency_contact', 'emergency_contact_residence', 'emergency_contact_region']


class ClientDetailView(LoginRequiredMixin, DetailView):
    template_name = 'client/detail_form.html'
    model = Client

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['panel_name'] = 'Client Details'
        context['panel_title'] = 'Client Detail'
        return context


@staff_member_required
@login_required
@manager_required
def delete_client(request, pk):
    if request.user.is_staff:
        client = get_object_or_404(Client, id=pk)
        if client.is_active:
            client.is_active = False
        else:
            client.is_active = True
        client.save()
        messages.success(
            request, 'Client is now dormant!')
    return HttpResponseRedirect(reverse('clients:client_list'))


# @staff_member_required
# @login_required
# @manager_required
# # @permission_required('clients.permanent_delete', login_url='/accounts/login/', raise_exception=True)
# def permanent_delete(request, pk):
#     '''Permanently delete client'''
#     if request.user.is_staff:
#         client = get_object_or_404(Client, id=pk)
#         if client.is_closed_account and timezone.now().month:
#             client.is_closed_account = False
#         else:
#             client.is_closed_account = True
#         client.delete()
#         messages.success(request, "Permanently deleted client in a month time")
#         return HttpResponseRedirect(reverse('clients:client_list'))


#===================================================================================================#
#                   Handling Transactions(Deposits & Withdrawals) Views                             #
#===================================================================================================#

@login_required
def deposit_view(request):
    form = DepositForm(request.POST or None)

    if form.is_valid():
        deposit = form.save(commit=False)
        deposit.save()
        deposit.client.account_number = deposit.client.account_number
        # adds client deposit to balance
        deposit.client.account_balance += deposit.amount
        deposit.client.save()
        messages.success(
            request, 'Client Have Deposited {} GHc.'.format(deposit.amount))
        return redirect('clients:transaction_view')
    context = {'title': 'Deposit', 'form': form}
    return render(request, 'transactions/deposit.html', context)


@login_required
def withdrawal_view(request):
    form = WithdrawalForm(request.POST or None)

    if form.is_valid():
        withdrawal = form.save(commit=False)
        if withdrawal.client.account_balance >= withdrawal.amount:
            # subtracts client withdrawal from balance
            withdrawal.client.account_balance -= withdrawal.amount
            withdrawal.client.save()
            withdrawal.save()
            messages.success(
                request, 'Client have Withdrawn {} GHc.'.format(withdrawal.amount))
            return redirect('clients:transaction_view')
        else:
            messages.info(
                request, 'Client Can Not Withdraw More Than Balance. Please Return To Previous Page')
    context = {'title': 'Withdraw', 'form': form}
    return render(request, 'transactions/withdraw.html', context)


@login_required
# @permission_required('clients.transaction_view', login_url='/accounts/login/', raise_exception=True)
def transaction_view(request):
    deposits = Deposit.objects.all()
    withdrawals = Withdrawal.objects.all()
    total_deposits = Deposit.objects.filter(transaction_time__gte=timezone.now().replace(
        month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(amount__sum=Sum('amount'))['amount__sum']
    total_withdrawals = Withdrawal.objects.filter(transaction_time__gte=timezone.now().replace(
        month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(amount__sum=Sum('amount'))['amount__sum']
    context = {
        'deposits': deposits,
        'withdrawals': withdrawals,
        'total_deposits': total_deposits,
        'total_withdrawals': total_withdrawals
    }
    return render(request, 'transactions/list_form.html', context)


@login_required
def print_client_deposit(request, pk):
    deposits = get_object_or_404(Deposit, id=pk)
    context = {'deposits': deposits}
    return render(request, 'transactions/client_depostit.html', context)


@login_required
def print_client_withdrawal(request, pk):
    withdrawal = get_object_or_404(Withdrawal, id=pk)
    context = {'withdrawal': withdrawal}
    return render(request, 'transactions/client_withdrawal.html', context)
