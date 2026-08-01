from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import UserProfile
from .serializers import CustomTokenSerializer, UserProfileSerializer
from .permissions import IsAdmin



class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

class CurrentUserView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "role": request.user.profile.role,
        })

class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:
            refresh = request.data.get("refresh")

            token = RefreshToken(refresh)

            token.blacklist()

            return Response(
                {"message": "Logged out successfully"},
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

class UserViewSet(ModelViewSet):

    permission_classes = [
            IsAuthenticated,
            IsAdmin,
        ]

    queryset = User.objects.select_related(
        "profile"
    ).all().order_by("username")

    serializer_class = UserProfileSerializer


    def get_queryset(self):

        queryset = super().get_queryset()

        search = self.request.query_params.get("search")

        if search:

            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search)
            )

        role = self.request.query_params.get("role")

        if role:

            queryset = queryset.filter(profile__role=role)

        return queryset.order_by("username")
    

    def destroy(self, request, *args, **kwargs):

        user = self.get_object()

        if user == request.user:

            return Response(
                {
                    "error":
                    "You cannot delete your own account."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_destroy(user)

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):

        user = self.get_object()

        if user == request.user:

            return Response(
                {
                    "error":
                    "You cannot deactivate your own account."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.is_active:

            return Response(
                {
                    "message":
                    "User is already inactive."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        user.is_active = False
        user.save( update_fields=["is_active"] )

        return Response({
            "message": "User deactivated"
        })


    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):

        user = self.get_object()

        if user.is_active:

            return Response(
                {
                    "message":
                    "User is already active."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        user.is_active = True
        user.save( update_fields=["is_active"] )

        return Response({
            "message": "User activated"
        })


    @action(detail=True, methods=["post"])
    def change_role(self, request, pk=None):

        user = self.get_object()

        role = request.data.get("role")

        valid_roles = [
            UserProfile.Role.ADMIN,
            UserProfile.Role.USER,
        ]

        if role not in valid_roles:

            return Response(
                {"error": "Invalid role"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user == request.user:

            return Response(
                {
                    "error": "You cannot change your own role."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        user.profile.role = role
        user.profile.save( update_fields=["role"] ) 

        return Response(
            {"message": "Role updated"},
            status=status.HTTP_200_OK,
        )
        