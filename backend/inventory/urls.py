from django.contrib import admin
from django.urls import path, include
from .views import FabricViewSet, RollViewSet, DispatchViewSet, DashboardAPIView
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register("fabrics",FabricViewSet)
router.register("barcode",RollViewSet)
router.register("dispatch",DispatchViewSet)


urlpatterns = [
    
    path(
        "",
        include(router.urls)
    ),
    path(
        "dashboard/",
        DashboardAPIView.as_view(),
        name="dashboard"
    ),

]