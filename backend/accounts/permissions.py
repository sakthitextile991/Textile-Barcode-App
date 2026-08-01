from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):

    message = "Only administrators are allowed to perform this action."

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False
        
        return ( request.user.profile.role == "ADMIN" )