from django.urls import  reverse 
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User 
from rest_framework_simplejwt.tokens import RefreshToken
from transactions.models import Category, Budget, Transaction

class CategoryAPITestCase(APITestCase):

    def setUp(self):

        # create user and token
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        # common headers for authenticated requests
        self.auth_headers = {"HTTP_AUTHORIZATION" : f"Bearer {self.access_token}"}

        # create a sample category
        self.category = Category.objects.create(name="Groceries")

    # Category Tests
    def test_create_category(self):

        """Ensure a user can create a new category"""
        url = reverse("category-list-create")
        data = {"name": "Entertainment"}
        response = self.client.post(url, data, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)

    def test_get_category_list(self):
        
        """Ensure authenticated user can fetch categories """
        url = reverse("category-list-create")
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_category_detail(self):
        
        """Ensure category detail endpoint works """
        url = reverse("category-detail", args=[self.category.id])
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Groceries")


class BudgetAPITestCase(APITestCase):

    def setUp(self):

        # create two users: regular and admin
        self.user = User.objects.create_user(username="user1", password="testpass123")
        self.admin = User.objects.create_superuser(username="admin1",password="adminpass123")

        # Create categories
        self.category1 = Category.objects.create(name="Groceries")
        self.category2 = Category.objects.create(name="Travel")

        # Generate tokens
        self.user_token = str(RefreshToken.for_user(self.user).access_token)
        self.admin_token = str(RefreshToken.for_user(self.admin).access_token)

        # Auth headers
        self.user_headers = {"HTTP_AUTHORIZATION": f"Bearer {self.user_token}"}
        self.admin_headers = {"HTTP_AUTHORIZATION": f"Bearer {self.admin_token}"}

        # Create sample budgets
        self.budget1 = Budget.objects.create(
            user=self.user, category=self.category1, amount=5000, month=10, year=2025
        )
        self.budget2 = Budget.objects.create(
            user=self.admin, category=self.category2, amount=15000, month=10, year=2025
        )

    def test_user_can_see_only_their_budgets(self):

        """ Regular user should only see their own budgets """
        url = reverse("budget-list-create")
        response = self.client.get(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        category_field = response.data[0]['category']
        if isinstance(category_field, dict):
            self.assertEqual(category_field["id"], self.category1.id)
        else:
            self.assertEqual(category_field,self.category1.id)

    def test_admin_can_see_all_budgets(self):
        
        """Admin should see all budgets"""
        url = reverse("budget-list-create")
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(url)
        self.client.force_authenticate(user=None)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data),2)

    def test_user_can_create_budget(self):

        """ Regular user should be able to create their own budget"""
        url = reverse("budget-list-create")
        data = {
            "category_id": self.category2.id,
            "amount": 3000,
            "month": 11,
            "year": 2025,
        }
        response = self.client.post(url,data,**self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Budget.objects.filter(user=self.user).count(),2)

    def test_user_can_retrieve_their_budget(self):

        """ Regular use should retrieve their budget """
        url = reverse("budget-detail", args=[self.budget1.id])
        response = self.client.get(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["amount"],"5000.00")     

    def test_user_cannot_retrieve_others_budget(self):

        """Regular use should not retrieve someone else's budget """
        url = reverse("budget-detail", args=[self.budget2.id])
        response = self.client.get(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_retrive_any_budget(self):

        """ Admin should retrieve any budget """
        url = reverse("budget-detail", args=[self.budget1.id])
        response = self.client.get(url, **self.admin_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_update_their_budget(self):

        """ Regular user can update their own budget"""
        url = reverse("budget-detail", args=[self.budget1.id])
        data = {"amount":8000, "category_id":self.category1.id, "month":10, "year": 2025}
        response = self.client.put(url, data, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.budget1.refresh_from_db()
        self.assertEqual(float(self.budget1.amount), 8000.00)

    
    def test_user_cannot_delete_others_budget(self):

        """ User cannot delete another user's budget """
        url = reverse("budget-detail", args=[self.budget2.id])
        response = self.client.delete(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_delete_any_budget(self):

        """ Admin can delete any user's budget"""
        url = reverse("budget-detail", args=[self.budget1.id])
        response = self.client.delete(url, **self.admin_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class TransactionAPITestCase(APITestCase):


    def setUp(self):

        # Create two users: regular and admin
        self.user = User.objects.create_user(username="user1", password="testpass123")
        self.admin = User.objects.create_superuser(username="admin1", password="adminpass123")

        # create categories
        self.food = Category.objects.create(name="Food")
        self.travel = Category.objects.create(name="Travel")

        # Generate tokens
        self.user_token = str(RefreshToken.for_user(self.user).access_token)
        self.admin_token = str(RefreshToken.for_user(self.admin).access_token)

        # Auth headers
        self.user_headers = {"HTTP_AUTHORIZATION" : f"Bearer {self.user_token}"}
        self.admin_headers = {"HTTP_AUTHORIZATION": f"Bearer {self.admin_token}"}

        # Create sample transactions
        self.transaction1 = Transaction.objects.create(
            user=self.user,
            category_id=self.food.id,
            type="expense",
            amount=200,
            date="2025-11-01",
        )

        self.transaction2 = Transaction.objects.create(
            user=self.admin,
            category_id=self.travel.id,
            type="income",
            amount=1000,
            date="2025-11-02",
        )

    def test_user_can_see_only_their_transactions(self):
         
        """ Regular user should only see their own transactions"""
        url = reverse("transaction-list-create")
        response = self.client.get(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data),1)
        self.assertEqual(response.data[0]["category"]["name"], "Food")

    def test_admin_can_see_all_transactions(self):

        """Admin should see all transactions"""
        url = reverse("transaction-list-create")
        response = self.client.get(url, **self.admin_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_user_can_create_transaction(self):

        """User can create a transaction successfully"""
        url = reverse("transaction-list-create")
        data = {
            "type":"expense",
            "category_id": self.travel.id,
            "amount": 500,
            "date": "2025-11-03",
        }
        response = self.client.post(url, data, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.filter(user=self.user).count(),2)

    def test_user_cannot_create_transaction_without_authentication(self):
        
        """Unauthenticated  user cannot create transactions"""
        url = reverse("transaction-list-create")
        data = {
            "type":"income",
            "category_id": self.food.id,
            "amount": 700,
            "date": "2025-11-04",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_filter_transactions_by_type(self):
        
        """ Fiter by type(expense/income)"""
        url = reverse("transaction-list-create") + "?type=expense"
        response = self.client.get(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(all(tx["type"] == "expense" for tx in response.data))

    def test_filter_transactions_by_category_name(self):

        """ Filter by category name"""
        url = reverse("transaction-list-create") + "?category=Food"
        response = self.client.get(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(all("Food" in tx["category"]["name"] for tx in response.data))

    def test_filter_transactions_by_date(self):

        """Filter by date """
        url = reverse("transaction-list-create") + "?date=2025-11-01"
        response = self.client.get(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(all(tx['date'] == "2025-11-01" for tx in response.data))

    def test_user_can_retrieve_own_transaction(self):

        """Regular user can retrieve their own transaction"""
        url = reverse("transaction-detail", args=[self.transaction1.id])
        response = self.client.get(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["amount"], "200.00")

    def test_user_cannot_retrieve_others_transaction(self):

        """User cannot retrieve another user's transaction """
        url = reverse("transaction-detail", args=[self.transaction2.id])
        response = self.client.get(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_retrieve_any_transaction(self):

        """Admin can retrieve any transaction"""
        url = reverse("transaction-detail", args=[self.transaction1.id])
        response = self.client.get(url, **self.admin_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_update_own_transaction(self):

        """User can update their own transaction"""
        url = reverse("transaction-detail", args=[self.transaction1.id])
        data = {
            "type": "expense",
            "category_id": self.food.id,
            "amount": 250,
            "date": "2025-11-01",
        }
        response = self.client.put(url, data, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.transaction1.refresh_from_db()
        self.assertEqual(float(self.transaction1.amount), 250.00)
       
    def test_user_cannot_delete_others_transaction(self):

        """User cannot delete another user's transaction """
        url = reverse("transaction-detail", args=[self.transaction2.id])
        response = self.client.delete(url, **self.user_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_admin_can_delete_any_transaction(self):

        """ Admin can delete any user's transaction"""
        url = reverse("transaction-detail", args=[self.transaction1.id])
        response = self.client.delete(url, **self.admin_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)