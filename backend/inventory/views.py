from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import action,api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_date
from django.db import transaction
from django.db.models import Max, Sum, Q, F, Count

from accounts.permissions import IsAdmin

from .models import Fabric,Barcode,Roll, Dispatch
from .serializer import FabricSerializer, RollSerializer, DispatchSerializer, DispatchRollSerializer
from django.db.models.functions import TruncMonth, Greatest
from .utils import create_dispatch,clear_stock_caches

from barcode import Code128
from barcode.writer import ImageWriter
from io import BytesIO
from django.http import HttpResponse
from datetime import timedelta

from django.core.cache import cache


class DispatchPagination(PageNumberPagination): # Serve-side pagination done in Dispatch list section
    page_size = 7

class FabricViewSet(ModelViewSet):

    queryset = Fabric.objects.all()
    serializer_class = FabricSerializer
    permission_classes = [IsAuthenticated]
    ADMIN_ACTIONS = (
        "destroy",
        "update",
        "partial_update",
    )

    def get_permissions(self):

        if self.action in self.ADMIN_ACTIONS:
            return [IsAdmin()]

        return [IsAuthenticated()]
    

    def list(self, request, *args, **kwargs):

        cached_data = cache.get("fabric_list")

        if cached_data:
            print("CACHE HIT")
            return Response(cached_data)

        print("CACHE MISS")

        queryset = self.get_queryset().annotate(
            total_rolls = Count(
                "rolls",
                filter=Q(rolls__dispatch_status="not_dispatched")
            )
        )

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        cache.set(
            "fabric_list",
            serializer.data,
            timeout=3600
        )

        return Response(serializer.data)

    def perform_create(self, serializer):

        fabric = serializer.save()
        
        #cache delete (when fabric created it affects the stock distribution)
        clear_stock_caches()

    def perform_update(self, serializer):

        serializer.save()

        # Clear the cached fabric list
        cache.delete("fabric_list")
        cache.delete("dashboard_chart")

        # Clear stock-related caches
        clear_stock_caches()

    
    @action( detail=False, methods=["get"] )
    def stock_distribution(self, request):

        #cache for stock distribution 
        cache_key = "stock_distribution"
        cached_data = cache.get(cache_key)
        
        if cached_data is not None:
            print(" CACHE HIT : stock_distribution")
            return Response(cached_data)
        print("CACHE MISS : stock_distribution")


        fabrics = Fabric.objects.order_by("-stock")
        
       
        top_five = fabrics[:5]
        remaining = fabrics[5:]

        chart_data = []
        

        for fabric in top_five:

            chart_data.append({
                "name": fabric.type,
                "value": fabric.stock
            })

        others_stock = sum(
            fabric.stock
            for fabric in remaining
        )

        if others_stock > 0:

            chart_data.append({
                "name": "Others",
                "value": others_stock
            })

        # Store in cache for 5 minutes
        cache.set(
            cache_key,
            chart_data,
            timeout=300
        )

        return Response(chart_data)
    

    # For view in fabric table
    @action(
        detail=True,
        methods=["get"]
    )
    def rolls(self, request, pk=None):

        fabric = self.get_object()

        rolls = Roll.objects.filter(
            fabric_type=fabric,
            dispatch_status="not_dispatched"
        ).order_by("-id")

        data = []

        total_meters = 0
        total_weight = 0

        for roll in rolls:

            total_meters += roll.meters
            total_weight += roll.weight

            data.append({
                "roll_no": roll.roll_no,
                "machine_no": roll.machine_no,
                "meters": roll.meters,
                "weight": roll.weight,
                "gram": round(
                    roll.weight / roll.meters,
                    3
                )
                if roll.meters else 0,
                "status": roll.dispatch_status
            })

        return Response({
            "fabric_name": fabric.type,
            "stock": fabric.stock,
            "total_rolls": rolls.count(),
            "total_meters": total_meters,
            "total_weight": total_weight,
            "rolls": data
        })



        
class RollViewSet(ModelViewSet):
    queryset = Roll.objects.all()
    serializer_class = RollSerializer
    permission_classes = [IsAuthenticated]
    
    ADMIN_ACTIONS = (
        "destroy",
        "update",
        "partial_update",
    )
    
    def get_permissions(self):
        if self.action in self.ADMIN_ACTIONS:
            return [IsAdmin()]
        return [IsAuthenticated()]

    def perform_create(self,serializer):

        now = timezone.now()

        # This year is used to filter the max sequence number
        year = now.year 
        month = now.month
        day = now.day

        last_sequence = Roll.objects.filter(
            date__year=year
        ).aggregate(
            max_seq=Max('sequence_no')
        )['max_seq']

        next_sequence = 1


        if last_sequence:
            next_sequence = last_sequence + 1
        

        roll_obj = serializer.save(
            sequence_no=next_sequence
        )
        
        # This year is used in roll number ex: 2026 -> 26 
        year = now.year % 100
        roll_no = (
            f"{year:02d}"
            f"{month:02d}"
            f"{day:02d}"
            f"{next_sequence:06d}"
        )

        roll_obj.roll_no = roll_no

        roll_obj.save()

        Barcode.objects.create(
            roll=roll_obj,
            barcode=f"ST{roll_no}"
        )

        Fabric.objects.filter(
                id=roll_obj.fabric_type_id
        ).update(
                stock=F('stock') + roll_obj.meters
        )

        # Clear related caches
        clear_stock_caches()

        cache.delete("dashboard_chart")
        
        return Response(
                {"message" : "Barcode created"},
                status = status.HTTP_200_OK
            )
    
    def destroy(self, request, *args, **kwargs):

        roll = self.get_object()

        fabric = roll.fabric_type
        meters = roll.meters

        fabric.stock = max(0, fabric.stock - meters)
        fabric.save()

        roll.delete()

        clear_stock_caches()
        cache.delete("dashboard_chart")

        return Response(
            {"message": "Roll deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    
    def perform_update(self, serializer):

        old_roll = self.get_object()

        old_meters = old_roll.meters

        updated_roll = serializer.save()

        difference = updated_roll.meters - old_meters

        Fabric.objects.filter(
            id=updated_roll.fabric_type_id
        ).update(
            stock=F("stock") + difference
        )

        clear_stock_caches()
        cache.delete("dashboard_chart")
    
    @action(detail=True, methods=["get"])
    def preview(self, request, pk=None):

        roll_obj = self.get_object()

        barcode_obj = roll_obj.barcode

        buffer = BytesIO()


        barcode = Code128(
            barcode_obj.barcode,
            writer=ImageWriter()
        )

        barcode.write(buffer)

        buffer.seek(0)

        return HttpResponse(
            buffer.getvalue(),
            content_type="image/png"
        )
    
    @action(detail=False, methods=["get"]) # Used in Barcode section to list out barcode
    def list_barcode(self, request):

        rolls = Roll.objects.filter(
            dispatch_status="not_dispatched"
        ).select_related(
                "barcode",
                "fabric_type"
        ).order_by("-id")

        serializer = self.get_serializer(
            rolls,
            many=True
        )

        return Response(serializer.data)

    

class DispatchViewSet(ModelViewSet):
    queryset = Dispatch.objects.all()
    serializer_class = DispatchSerializer
    pagination_class = DispatchPagination
    permission_classes = [IsAuthenticated]

    @action(
        detail=False,
        methods=["get"]
    )
    def recent_dispatch(self,request):

        cache_key = "recent_dispatch"

        cached_data = cache.get(cache_key)

        if cached_data:
            print("CACHE HIT - recent_dispatch")
            return Response(cached_data)      
        
        print("CACHE MISS - recent_dispatch")  
        
        queryset = Dispatch.objects.order_by(
            "-dispatched_at"
        )[:5]
        
        serializer = self.get_serializer(queryset, many=True)
            
        cache.set(
            cache_key,
            serializer.data,
            timeout=300
        )
        
        return Response(serializer.data)

    # Used to obtained filtered data using their month for dispatch list section
    @action(
        detail=False,
        methods=["get"]
    )
    def by_date(self, request):

        from_date = request.GET.get("from")
        to_date = request.GET.get("to")
        single_date = request.GET.get("date")

        queryset = Dispatch.objects.all()

        if single_date:

            queryset = queryset.filter(
                dispatched_at__date=parse_date(single_date)
            )

        elif from_date and to_date:

            queryset = queryset.filter(
                dispatched_at__date__range=[
                    parse_date(from_date),
                    parse_date(to_date)
                ]
            )

        queryset = queryset.order_by("-dispatched_at")

        page = self.paginate_queryset(queryset)

        serializer = DispatchSerializer(
            page,
            many=True
        )

        return self.get_paginated_response(
            serializer.data
        )


    @action( 
        detail=False,
        methods=["post"]
    )

    def add_roll(self, request):

        barcode_value = request.data.get( "barcode" )
        fabric_type_id = int(request.data.get("fabric_type")) #If frontend send string converts to int
        try:
            barcode = Barcode.objects.select_related(
                "roll",
                "roll__fabric_type"
            ).get(barcode=barcode_value)

        except Barcode.DoesNotExist:

            return Response(
                {"error":"Barcode not found"},
                status=400
            )
        
        roll = barcode.roll

        if (roll.fabric_type.id != fabric_type_id):

            return Response({
                    "error" : "Mismatching Fabric type"
                },status=400
            )
        
        if roll.dispatch_status == "dispatched":

            return Response({
                    "error":"Roll already dispatched"
                },status=400
            )
        
        return Response({
            "id": roll.id,
            "roll_no": roll.roll_no,
            "meters": roll.meters,
            "weight": roll.weight,
            "barcode": barcode.barcode,
            "fabric_name": roll.fabric_type.type
        })


    @action(
        detail=False,
        methods=["post"]
    )
    def preview(self, request):

        barcodes = request.data.get(
            "barcodes",
            []
        )

        customer_name = request.data.get(
            "customer_name"
        )

        vehicle_no = request.data.get(
            "vehicle_no"
        )

        fabric_type_id = request.data.get(
            "fabric_type"
        )

        rolls_data = []

        total_meters = 0
        total_weight = 0

        for index, barcode_value in enumerate(barcodes, start=1):

            try:

                barcode = Barcode.objects.select_related(
                    "roll",
                    "roll__fabric_type"
                ).get(
                    barcode=barcode_value
                )

            except Barcode.DoesNotExist:

                continue

            roll = barcode.roll

            rolls_data.append({

                "sno": index,

                "roll_no": roll.roll_no,

                "machine_no": roll.machine_no,

                "weight": roll.weight,

                "meters": roll.meters,

                "gram":
                    round(
                        roll.weight / roll.meters,
                        3
                    )
                    if roll.meters else 0

            })

            total_meters += roll.meters
            total_weight += roll.weight

        fabric_name = ""

        if fabric_type_id:

            fabric = Fabric.objects.get(
                id=fabric_type_id
            )

            fabric_name = fabric.type

        return Response({

            "customer_name": customer_name,

            "vehicle_no": vehicle_no,

            "fabric_name": fabric_name,

            "total_rolls": len(rolls_data),

            "total_meters": total_meters,

            "total_weight": total_weight,

            "rolls": rolls_data

        })


    @action(
        detail=False,
        methods=["post"]
    )
    def confirm_dispatch(self, request):

        customer_name = request.data.get(
            "customer_name"
        )

        vehicle_no = request.data.get(
            "vehicle_no"
        )

        fabric_type_id = request.data.get(
            "fabric_type"
        )

        barcodes = request.data.get(
            "barcodes",
            []
        )

        total_meters = request.data.get(
            "total_meters",
            0
        )

        total_weight = request.data.get(
            "total_weight",
            0
        )

        total_rolls = request.data.get(
            "total_rolls",
            0
        )
        if not barcodes:

            return Response(
                {
                    "error":
                    "No rolls selected"
                },
                status=400
            )

        with transaction.atomic():

            # Create Dispatch
            dispatch = create_dispatch(
                customer_name,
                vehicle_no,
                fabric_type_id,
                total_meters,
                total_weight,
                total_rolls
            )

            for barcode_value in barcodes:

                try:

                    barcode = Barcode.objects.select_related(
                        "roll",
                        "roll__fabric_type"
                    ).get(
                        barcode=barcode_value
                    )

                except Barcode.DoesNotExist:

                    raise ValidationError(
                        f"{barcode_value} not found"
                    )

                roll = barcode.roll

                # Fabric validation
                if (
                    roll.fabric_type_id
                    != fabric_type_id
                ):

                    raise ValidationError(
                        f"{roll.roll_no} fabric mismatch"
                    )

                # Already dispatched
                if roll.dispatch_status == "dispatched":

                    raise ValidationError(
                        f"{roll.roll_no} already dispatched"
                    )

                Fabric.objects.filter(
                    id=roll.fabric_type_id
                ).update(
                    stock=Greatest( F("stock") - roll.meters, 0 )
                )

               
                
                roll.dispatch_status = "dispatched"
                roll.dispatched = dispatch

                roll.save()

                barcode.delete()

            # Clear related caches
            clear_stock_caches()

            cache.delete("dashboard_chart")

            return Response({
                "id": dispatch.id,
                "message":
                "Dispatch completed",
                "dispatch_no": dispatch.dispatch_no
            })


    @action(
        detail=True,
        methods=["get"]
    )
    def dc(self, request, pk=None):

        dispatch = self.get_object()

        rolls = dispatch.rolls.all().order_by(
            "roll_no"
        )

        rolls_data = DispatchRollSerializer(
            rolls,
            many=True
        ).data

        return Response({

            "dispatch_no":
                dispatch.dispatch_no,

            "customer_name":
                dispatch.customer_name,

            "vehicle_no":
                dispatch.vehicle_no,

            "fabric_name":
                dispatch.fabric_type.type,

            "dispatched_at":
                dispatch.dispatched_at,

            "total_rolls":
                dispatch.total_rolls,

            "total_meters":
                dispatch.total_meters,

            "total_weight":
                dispatch.total_weight,

            "rolls":
                rolls_data

        })  

class DashboardAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cached_data = cache.get(
            "dashboard_chart"
        )

        if cached_data:

            print(
                "DASHBOARD CACHE HIT"
            )

            return Response(
                cached_data
            )

        print(
            "DASHBOARD CACHE MISS"
        )

        # Bar Chart Data
        today = timezone.now()

        current_month_dispatches = (
            Dispatch.objects
            .filter(
                dispatched_at__year=today.year,
                dispatched_at__month=today.month
            )
            .values("fabric_type__type")
            .annotate(
                total_meters=Sum("total_meters")
            )
            .order_by("-total_meters")
        )

        st_chart = []
        nf_chart = []

        for item in current_month_dispatches:

            data = {
                "fabric": item["fabric_type__type"],
                "meters": item["total_meters"]
            }

            if item["fabric_type__type"].startswith("ST"):
                st_chart.append(data)
            
            elif item["fabric_type__type"].startswith("NF"):
                nf_chart.append(data)


        dashboard_chart = {
            "st_chart" : st_chart,
            "nf_chart" : nf_chart
        }

        cache.set(
            "dashboard_chart",
            dashboard_chart,
            timeout=300
        )

        return Response(
            dashboard_chart
        )
