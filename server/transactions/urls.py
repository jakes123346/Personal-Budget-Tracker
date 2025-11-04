from django.urls import path  
# from .views import TransactionListCreateView, BudgetListCreateView
from . import views

urlpatterns = [

    # Category endpoints
    path('categories/',views.CategoryListCreateView.as_view(),name='category-list-create'),
    path('categories/<int:pk>/',views.CategoryDetailView.as_view(),name='category-detail'),

    # Transaction endpoints
    path('transactions/',views.TransactionListCreateView.as_view(),name='transaction-list-create'),
    path('transactions/<int:pk>/',views.TransactionDetailView.as_view(),name='transaction-detail'),

    # Budget endpoints
    path('budgets/',views.BudgetListCreateView.as_view(),name='budget-list-create'),
    path('budgets/<int:pk>/',views.BudgetDetailView.as_view(),name='budget-detail'),
    
]