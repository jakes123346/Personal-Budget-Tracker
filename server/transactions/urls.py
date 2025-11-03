from django.urls import path  
from .views import TransactionListCreateView, BudgetListCreateView

urlpatterns = [
    path('transactions/',TransactionListCreateView.as_view(),name='transaction'),
    path('budget/',BudgetListCreateView.as_view(),name='budget'),
]