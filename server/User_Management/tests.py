from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User 
from rest_framework_simplejwt.tokens import RefreshToken

class UserManagementAPITestCase(APITestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="StrongPass123",
            first_name="Monika",
            last_name="Gajjar",
        )
        self.admin = User.objects.create_superuser(
            username="adminuser",
            email="admin@example.com",
            password="AdminPass123"
        )

        # Token setup
        self.refresh_token = RefreshToken.for_user(self.user)
        self.access_token = str(self.refresh_token.access_token)
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}

    def test_register_user_success(self):

        """ Register a new user successfully"""
        url = reverse("register")
        data = {
            "username":"Nihar.Madhavi",
            "email": "nihar.madhavi@gmail.com",
            "password": "NewStrongPass123",
            "first_name": "Nihar",
            "last_name": "Madhavi"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message",response.data)
        self.assertTrue(User.objects.filter(username="Nihar.Madhavi").exists())

    
    def test_register_with_existing_email(self):

        """Cannot register with duplicate email"""
        url = reverse("register")
        data = {
            "username":"otheruser",
            "email": "test@example.com", # already exists
            "password": "Password123!",
        }

    def test_register_with_existing_username(self):

        """Cannot register with duplicate username"""
        url = reverse("register")
        data = {
            "username":"testuser", # already exists
            "email": "another@example.com",
            "password": "PaWd135!",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username",response.data)

    def test_login_successful(self):

        """User can login with correct credentials"""
        url = reverse("login")
        data = {"email":"test@example.com", "password": "StrongPass123"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["email"], "test@example.com")    

    def test_login_with_invalid_email(self):

        """Login fails for wrong email"""
        url = reverse('login')
        data = {"email": "abcd@example.com", "password" : "StrongPass123"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_login_with_incorrect_password(self):

        """Login fails for wrong password"""
        url = reverse("login")
        data = {"email" : "test@example.com", "password" : "Qty890!"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


