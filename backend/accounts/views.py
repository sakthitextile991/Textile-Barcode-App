from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import CustomTokenSerializer



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