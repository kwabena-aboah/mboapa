from django import forms
# import datetime
from . models import Deposit, Withdrawal


class DepositForm(forms.ModelForm):
    class Meta:
        model = Deposit
        fields = ['client', 'amount']


class WithdrawalForm(forms.ModelForm):
    class Meta:
        model = Withdrawal
        fields = ['client', 'amount']

    # def __init__(self, *args, **kwargs):
    #     self.client = kwargs.pop('client', None)
    #     super(WithdrawalForm, self).__init__(*args, **kwargs)

    # def clean_amount(self):
    #     amount = self.cleaned_data['amount']
    #     if self.client.account_balance < amount:
    #         raise forms.ValidationError(
    #             'Client Can Not Withdraw More Than Balance.')
    #     return amount
