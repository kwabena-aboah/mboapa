from django.contrib import admin
from import_export import resources
from import_export.fields import Field
from import_export.admin import ImportExportActionModelAdmin
from . models import Client, Deposit, Withdrawal


admin.site.site_header = 'MBOA PA FINANCIAL SERVICE'
admin.site.site_title = 'MBOA PA FINANCIAL SERVICE'
admin.site.index_title = "Welcome to MBOA PA FINANCIAL SERVICE"


class ClientResource(resources.ModelResource):
    delete = Field()

    def for_delete(self, row, instance):
        return self.fields['delete'].clean(row)

    class Meta:
        model = Client


class DepositResource(resources.ModelResource):
    delete = Field()

    def for_delete(self, row, instance):
        return self.fields['delete'].clean(row)

    class Meta:
        model = Deposit


class WithdrawalResource(resources.ModelResource):
    delete = Field()

    def for_delete(self, row, instance):
        return self.fields['delete'].clean(row)

    class Meta:
        model = Withdrawal


class ClientAdmin(ImportExportActionModelAdmin, admin.ModelAdmin):
    list_display = ('account_name', 'account_number',
                    'account_balance', 'gender', 'created_on',)
    list_filter = ('created_on',)
    search_fields = ('account_number', 'gender', 'created_on')
    resource_class = ClientResource


admin.site.register(Client, ClientAdmin)


class DepositAdmin(ImportExportActionModelAdmin, admin.ModelAdmin):
    list_display = ('id', 'client', 'amount', 'transaction_time',)
    list_filter = ('transaction_time',)
    search_fields = ('id', 'client',)
    resource_class = DepositResource


admin.site.register(Deposit, DepositAdmin)


class WithdrawalAdmin(ImportExportActionModelAdmin, admin.ModelAdmin):
    list_display = ('id', 'client', 'amount', 'transaction_time',)
    list_filter = ('transaction_time',)
    search_fields = ('id', 'client',)
    resource_class = WithdrawalResource


admin.site.register(Withdrawal, WithdrawalAdmin)
