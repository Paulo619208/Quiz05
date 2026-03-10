from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import register_view, MyTokenObtainPairView

urlpatterns = [
    path('signup/', register_view, name='auth-signup'),
    path('signin/', MyTokenObtainPairView.as_view(), name='auth-signin'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
