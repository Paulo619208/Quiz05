from django.urls import path, include


urlpatterns = [
    path("auth/", include("authentication.urls")),
    path("users/auth/", include("authentication.urls")),
    path("", include("conversations.urls")),
]
