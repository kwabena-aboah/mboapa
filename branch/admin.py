from django.contrib import admin

from . models import Branch


admin.site.site_header = 'MBOA PA FINANCIAL SERVICE'
admin.site.site_title = 'MBOA PA FINANCIAL SERVICE'


class BranchAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'opening_date', 'country',
                    'region', 'city', 'phone_number', 'is_active')
    list_display_links = ('id',)
    list_editable = ('name', 'country', 'region', 'city',
                     'phone_number', 'is_active',)
    search_fields = ('name', 'is_active')


admin.site.register(Branch, BranchAdmin)
