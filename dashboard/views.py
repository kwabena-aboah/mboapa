from django.utils import timezone
from dashboard.models import User
from django.views.generic import TemplateView
from django.views.generic.edit import CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.shortcuts import reverse, redirect, render

from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import authenticate, update_session_auth_hash
from django.contrib.auth.decorators import login_required

from django.db.models import Sum, Count, Min, Max, Avg

from branch.models import Branch
from clients.models import Client, Deposit, Withdrawal
# from django.utils.decorators import method_decorator
from .decorators import manager_required

from . forms import UserCreationForm


@login_required()
@manager_required()
def signupview(request):
    """Register a new user"""
    if request.method != 'POST':
        # Display blank registration form
        form = UserCreationForm()
    else:
        # PRocess completed form
        form = UserCreationForm(data=request.POST)
        if form.is_valid():
            form.save()
            # authenticated_user = authenticate(username=new_user.username,
            #                                   password=request.POST['password'])
            return HttpResponseRedirect(reverse('dashboard:user_profile'))

    context = {'form': form}
    template_name = 'registration/signup.html'
    return render(request, template_name, context)


# @method_decorator([login_required, manager_required], name='dispatch')
# class SignUpView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
#     template_name = 'registration/signup.html'

#     model = User
#     success_message = 'Successfully added a new user'
#     fields = ['username', 'first_name', 'last_name', 'email',
#               'password', 'is_manager', 'is_teller', 'profile_pic']


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'home/index.html'

    def get(self, request):
        ''' get branch info and count '''
        branch = Branch.objects.all()[0:10]
        branch_count = branch.count()
        branch_percent = (branch_count / 100)

        ''' get user info and count'''
        users = User.objects.all()[0:10]
        user_count = users.count()
        user_percent = (user_count / 100)

        ''' get client info and count'''
        clients = Client.objects.all()[0:10]
        new_clients = Client.objects.filter(created_on__gte=timezone.now(
        ).replace(month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(Count('id'))
        total_client_balance = Client.objects.aggregate(
            account_balance__sum=Sum('account_balance'))['account_balance__sum']
        client_count = clients.count()
        client_percent = (client_count / 100)
        # gender balance
        female_client_balance = Client.objects.filter(
            gender__startswith='Female').aggregate(account_balance__sum=Sum('account_balance'))['account_balance__sum']
        male_client_balance = Client.objects.filter(
            gender__startswith='Male').aggregate(account_balance__sum=Sum('account_balance'))['account_balance__sum']
        # gender count
        female_client_count = Client.objects.filter(
            gender__startswith='Female', created_on__gte=timezone.now(
            ).replace(month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(Count('gender'))
        male_client_count = Client.objects.filter(
            gender__startswith='Male', created_on__gte=timezone.now(
            ).replace(month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(Count('gender'))
        # dormant account count
        dormant_clients_total = Client.objects.filter(
            is_active__exact=False).aggregate(Count('is_active'))
        dormant_client_balance = Client.objects.filter(is_active__exact=False, created_on__gte=timezone.now(
        ).replace(month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(account_balance__sum=Sum('account_balance'))['account_balance__sum']

        max_savings = Client.objects.filter(created_on__gte=timezone.now(
        ).replace(month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(account_balance__max=Max('account_balance'))['account_balance__max']
        min_savings = Client.objects.filter(created_on__gte=timezone.now(
        ).replace(month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(account_balance__min=Min('account_balance'))['account_balance__min']
        avg_savings = Client.objects.filter(created_on__gte=timezone.now(
        ).replace(month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(account_balance__avg=Avg('account_balance'))['account_balance__avg']

        '''get withdrawals and deposits'''
        deposits = Deposit.objects.all()[0:10]
        total_deposits = Deposit.objects.filter(transaction_time__gte=timezone.now().replace(
            month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(amount__sum=Sum('amount'))['amount__sum']
        withdrawals = Withdrawal.objects.all()[0:10]
        total_withdrawals = Withdrawal.objects.filter(transaction_time__gte=timezone.now().replace(
            month=1, hour=0, minute=0, second=0, microsecond=0)).aggregate(amount__sum=Sum('amount'))['amount__sum']
        # total_transactions = total_deposits + total_withdrawals

        context = {
            'branch': branch, 'branch_count': branch_count,
            'branch_percent': branch_percent,
            'users': users, 'user_count': user_count,
            'user_percent': user_percent,
            'clients': clients, 'client_count': client_count,
            'client_percent': client_percent,
            'new_clients_per_month': new_clients['id__count'],
            'female_client_balance': female_client_balance,
            'male_client_balance': male_client_balance,
            'total_client_balance': total_client_balance,
            'female_client_count': female_client_count['gender__count'],
            'male_client_count': male_client_count['gender__count'],
            'dormant_clients_total': dormant_clients_total['is_active__count'],
            'dormant_client_balance': dormant_client_balance,
            'deposits': deposits,
            'total_deposits': total_deposits,
            'withdrawals': withdrawals,
            'total_withdrawals': total_withdrawals,
            # 'total_transactions': total_transactions,
            'max_savings': max_savings,
            'min_savings': min_savings,
            'avg_savings': avg_savings
        }
        return render(request, self.template_name, context)


def logout_view(request):
    """Log the user out."""
    logout(request)
    return HttpResponseRedirect(reverse('dashboard:login'))


@login_required()
def user_profile(request):
    if request.method == request.user.is_authenticated:
        return redirect('user_profile')
    else:
        users = User.objects.all()
        return render(request, 'registration/user_profile.html', {'users': users})


@login_required()
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(data=request.POST, user=request.user)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            messages.success(request, 'Password Changed Successfully !!')
            return redirect('user_profile')
        else:
            messages.error(request, form.errors)
            form = PasswordChangeForm(user=request.user)
            context = {'form': form}
            return render(request, 'registration/change_password_form.html', context)

    else:
        form = PasswordChangeForm(user=request.user)
        context = {
            'form': form
        }
        return render(request, 'registration/change_password_form.html', context)
