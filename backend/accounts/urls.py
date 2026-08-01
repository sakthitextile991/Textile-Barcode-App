from django.urls import path, include

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, CurrentUserView, LogoutView, UserViewSet

router = DefaultRouter()

router.register(
    "users",
    UserViewSet,
    basename="users",
)

urlpatterns = [

    path(
        "",
        include(router.urls),
    ),

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
