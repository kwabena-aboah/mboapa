from django.shortcuts import reverse, get_object_or_404
from django.http import HttpResponseRedirect

from django.views.generic.edit import CreateView, UpdateView
from django.views.generic import ListView, DetailView

from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required

from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from dashboard.decorators import manager_required
from django.contrib.messages.views import SuccessMessageMixin

from . models import Branch


@method_decorator([login_required, manager_required], name='dispatch')
class BranchCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    template_name = 'branch/creation_form.html'
    model = Branch
    success_message = 'Opened new branch'
    fields = ['name', 'opening_date', 'country',
              'region', 'city', 'phone_number']


@method_decorator([login_required, manager_required], name='dispatch')
class BranchListView(LoginRequiredMixin, ListView):
    template_name = 'branch/list_form.html'
    model = Branch
    field_list = ['name', 'opening_date',
                  'country', 'region', 'city', 'phone_number', 'is_active']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['panel_name'] = 'Bank Branches'
        context['panel_title'] = 'Bank Branch'
        return context


@method_decorator([login_required, manager_required], name='dispatch')
class BranchEditView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    template_name = 'branch/update_form.html'
    model = Branch
    success_message = 'Branch has been successfully updated'
    fields = ['name', 'opening_date', 'country',
              'region', 'city', 'phone_number', 'is_active']


@method_decorator([login_required, manager_required], name='dispatch')
class BranchDetailView(LoginRequiredMixin, DetailView):
    template_name = 'branch/detail_form.html'
    model = Branch

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['panel_name'] = 'Branch Details'
        context['panel_title'] = 'Branch Detail'
        return context


@staff_member_required
@login_required
@manager_required
def delete_branch(request, pk):
    if request.user.is_staff:
        branch = get_object_or_404(Branch, id=pk)
        if branch.is_active:
            branch.is_active = False
        else:
            branch.is_active = True
        branch.save()
    return HttpResponseRedirect(reverse('branch:branch_list'))
