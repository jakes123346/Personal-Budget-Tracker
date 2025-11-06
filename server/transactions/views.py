from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer

# Category CRUD
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

# Transaction CRUD
# GET /transactions with filters and POST /transactions
class TransactionListCreateView(generics.ListCreateAPIView):

    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user 
        queryset = Transaction.objects.all()
        
        # Admin can see all transactions
        if not user.is_staff:
            queryset = queryset.filter(user=user)
        
        # Apply Filters
        type_filter = self.request.query_params.get('type')
        category_filter = self.request.query_params.get('category')
        date_filter = self.request.query_params.get('date')

        if type_filter:
            queryset = queryset.filter(type=type_filter)

        if category_filter:
            queryset = queryset.filter(category__name__icontains=category_filter)

        if date_filter:
            queryset = queryset.filter(date=date_filter)

        return queryset

    def perform_create(self,serializer):
        serializer.save(user=self.request.user)
        print("-------------------",self.request.user)


# GET(single transaction), PUT(update), DELETE(delete)
class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user 
        queryset = Transaction.objects.all()
        if not user.is_staff:
            queryset = queryset.filter(user=user)
        return queryset


# Budget CRUD
# GET /budget and POST /budget
class BudgetListCreateView(generics.ListCreateAPIView):

    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user 
        if user.is_staff or user.is_superuser:
            # Admin can see all budget details
            return Budget.objects.all()
        # Regular users only see their own
        return Budget.objects.filter(user=user)

    
    def perform_create(self,serializer):
        serializer.save(user=self.request.user)


class BudgetDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user 
        queryset = Budget.objects.all()
        if not user.is_staff:
            queryset = queryset.filter(user=user)
        return queryset


