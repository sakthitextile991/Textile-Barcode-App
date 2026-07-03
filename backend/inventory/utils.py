from django.utils import timezone
from django.db.models import Max
from .models import Dispatch
from django.core.cache import cache

def get_financial_year():

    today = timezone.now()

    if today.month >= 4:
        start_year = today.year % 100
        end_year = (today.year + 1) % 100
    else:
        start_year = (today.year - 1) % 100
        end_year = today.year % 100

    return f"{start_year:02d}/{end_year:02d}"


def create_dispatch(
    customer_name,
    vehicle_no,
    fabric_type_id,
    total_meters,
    total_weight,
    total_rolls
):

    fy = get_financial_year()

    max_seq = Dispatch.objects.filter(
        financial_year=fy
    ).aggregate(
        max_seq=Max("sequence_no")
    )["max_seq"]

    next_seq = (
        1
        if max_seq is None
        else max_seq + 1
    )

    dispatch_no = (
        f"{fy.replace('/', '')}/{next_seq:04d}"
    )
    
    cache.delete("recent_dispatch")

    return Dispatch.objects.create(
        customer_name=customer_name,
        vehicle_no=vehicle_no,
        fabric_type_id=fabric_type_id,
        financial_year=fy,
        sequence_no=next_seq,
        dispatch_no=dispatch_no,
        total_meters=total_meters,
        total_weight=total_weight,
        total_rolls=total_rolls,
    )


def clear_stock_caches():

    cache.delete("fabric_list")
    cache.delete("stock_distribution")


    
   
