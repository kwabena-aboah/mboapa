from django.contrib import admin
from import_export import resources
from import_export.fields import Field
from import_export.admin import ImportExportActionModelAdmin

from . models import User


class UserResource(resources.ModelResource):
    delete = Field()

    def for_delete(self, row, instance):
        return self.fields['delete'].clean(row)

    class Meta:
        model = User


class UserAdmin(ImportExportActionModelAdmin, admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'email',
                    'last_login', 'date_joined', 'is_manager', 'is_teller',)
    list_filter = ('date_joined', 'last_login',
                   'is_teller', 'is_manager',)
    search_fields = ('username', 'date_joined',
                     'is_manager', 'is_teller',)
    resource_class = UserResource


admin.site.register(User, UserAdmin)
