from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationApiTests(APITestCase):
    def test_register_view_creates_user(self):
        payload = {
            "username": "tester",
            "email": "tester@example.com",
            "password": "strongpass123",
        }

        response = self.client.post("/api/v1/auth/signup/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="tester").exists())

    def test_signin_view_returns_jwt_tokens(self):
        User.objects.create_user(username="tester", password="strongpass123")

        payload = {
            "username": "tester",
            "password": "strongpass123",
        }
        response = self.client.post("/api/v1/auth/signin/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_legacy_users_auth_signin_route_returns_jwt_tokens(self):
        User.objects.create_user(username="tester2", password="strongpass123")

        payload = {
            "username": "tester2",
            "password": "strongpass123",
        }
        response = self.client.post("/api/v1/users/auth/signin/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
