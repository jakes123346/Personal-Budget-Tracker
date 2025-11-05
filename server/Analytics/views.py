from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status   
from transactions.models import Transaction , Budget
from django.db.models import Sum
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.permissions import AllowAny, IsAuthenticated

class AnalyticsSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        print(
            "Authorization Header:", request.headers.get("Authorization")
        )
        print("User:", request.user)
        user = request.user
        year = request.GET.get('year')
        month = request.GET.get('month')   
        mode = request.GET.get('mode', 'monthly')
        print(user)
        print(user.id)
        
        if not year:
            return Response({"error": "Year parameter is required."}, status=status.HTTP_400_BAD_REQUEST)   

        try:
            year = int(year)
            month = int(month) if month else None
        except ValueError:
            return Response({"error": "Year and month must be integers."}, status=status.HTTP_400_BAD_REQUEST)  

        filters = {
            'user_id': user.id,
            'date__year': year,
        }
        if mode == 'monthly' and month:
            filters['date__month'] = month  

        transactions = (
            Transaction.objects
            .filter(**filters)
            .values("category__name", "type")
            .annotate(total_amount=Sum("amount"))
            .order_by("category__name")
        )


        income_data = []
        expense_data = []   
        for t in transactions:
            entry = {
                "category":t["category__name"],
                "total_amount": t["total_amount"]
                }   
            if t["type"] == "income":
                income_data.append(entry)
            else:
                expense_data.append(entry)  
        
        budget_filters = {
            'user_id': user.id,
            'year': year,
        }
        if mode == 'monthly' and month: 
            budget_filters['month'] = month   
        budgets= (
            Budget.objects
            .filter(**budget_filters)
            .values("category__name")
            .annotate(budgeted_amount=Sum("amount"))
            .order_by("category__name")
        )

        budget_data = []
        for b in budgets:
            category = b["category__name"]
            spent =   next((t["total_amount"] for t in transactions if t["category__name"] == category and t["type"] == "expense"), 0)
            budget_data.append({
                "category": category,
                "budgeted_amount": float(b["budgeted_amount"]),
                "spent_amount": spent,
                "over_budget": spent > float(b["budgeted_amount"])
            })


        if mode == "annual":
            transactions = (
                Transaction.objects
                .filter(user_id=user.id, date__year=year)
                .values('month', 'type')
                .annotate(total_amount=Sum('amount'))
            )

            income_data = [
                {"category":t["category__name"],'amount': t["total_amount"]} for t in transactions if t["type"] == "income"
            ]

            expense_data = [
                {"category":t["category__name"],'amount': t["total_amount"]} for t in transactions if t["type"] == "expense"
            ]   
            budgets = (
                Budget.objects
                .filter(user_id=user.id, year=year)
                .values('month')
                .annotate(total_budget=Sum('amount'))
            )

            budget_data = [
                {"category":b["category"],
                'budgeted_amount': float(b["total_budget"]),
                "spent": next((t["total_amount"] for t in transactions if t["month"] == b["month"] and t["type"] == "expense"), 0),
                "over_budget": spent > float(b["total_budget"])
                } 
                for b in budgets   ]

        summary = {
            "year": year,
            "month": month,
            "mode": mode,
            "income_data": income_data,
            "expense_data": expense_data,
            "budget_data": budget_data,
        }
        print(summary)
        return Response(summary, status=status.HTTP_200_OK)

            