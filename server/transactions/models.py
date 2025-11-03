from django.db import models
from django.contrib.auth.models import User 

class Category(models.Model):

    name = models.CharField(max_length=50,unique=True)

    def __str__(self):
        return self.name


class Budget(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name='budgets')
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    month = models.PositiveIntegerField()
    year = models.PositiveIntegerField()

    class Meta:
        unique_together = ('user','category','month','year')

    def __str__(self):
        return f"{self.user.username} - {self.category.name} ({self.month}/{self.year})"


class Transaction(models.Model):

    TYPE_CHOICES = [
        ('income','Income'),
        ('expense','Expense'),
    ]
    
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    type = models.CharField(max_length=10,choices=TYPE_CHOICES)
    category =  models.ForeignKey(Category,on_delete=models.CASCADE,related_name='transactions')
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.category.name} - {self.amount}"

        