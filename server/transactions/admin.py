from django.contrib import admin
from .models import Category, Budget, Transaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id','name']
    search_fields = ['name']


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['id','user','category','amount','month','year']
    list_filter = ['month','year','category']
    search_fields = ['user__username','category__name']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id','user','type','category','amount','date']
    list_filter = ['type','date','category']
    search_fields = ['user__username','category__name']