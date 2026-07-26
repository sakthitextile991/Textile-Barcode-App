from django.urls import path
from .views import LoginView, CurrentUserView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path(
        "login/", 
        LoginView.as_view(),
        name="login",
    ),
    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),

    path(
        "me/",
        CurrentUserView.as_view(),
        name="current_user",
    ),
]