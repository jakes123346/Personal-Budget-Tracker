from rest_framework import serializers
from .models import Transaction, Budget, Category

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Transaction
        fields = ['id','user','type','category','category_id','amount','date']


class BudgetSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),source='category',write_only=True
    )

    class Meta:
        model = Budget
        fields = ['id','user','category','category_id','amount','month','year']
        