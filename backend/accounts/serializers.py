from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework import serializers


class CustomTokenSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["role"] = user.profile.role
        token["username"] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "role": self.user.profile.role,
        }

        return data


class UserProfileSerializer(serializers.ModelSerializer):

    role = serializers.ChoiceField(
        choices=UserProfile.Role.choices,
        source="profile.role",
        required=True
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "is_active",
            "date_joined",
            "role",
        ]

        read_only_fields = [
            "id",
            "date_joined",
        ]

    def create(self, validated_data):

        # Extract role from:
        # {
        #     "profile": {
        #         "role": "USER"
        #     }
        # }
        profile_data = validated_data.pop(
            "profile",
            {}
        )

        password = validated_data.pop(
            "password"
        )
        
        # Create Django User with hashed password
        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        selected_role = profile_data.get(
            "role",
            UserProfile.Role.USER
        )
        # Update_or_create is used to handle if the signal.py already created a UserProfile beforehand for the newly created user 
        # created or updated profile explicitly with the role
        # Signal is kept to handle user creation from django admin

        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                "role": selected_role
            }
        )

        return user


    def update(self, instance, validated_data):

        password = validated_data.pop(
            "password",
            None
        )

        # Update normal User fields
        for field, value in validated_data.items():

            setattr(
                instance,
                field,
                value
            )

        # Hash the password if it was provided
        if password:

            instance.set_password(
                password
            )

        instance.save()

        return instance
