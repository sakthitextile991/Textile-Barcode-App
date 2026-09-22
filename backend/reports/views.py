from datetime import datetime

from django.db.models import (Sum,Count)

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from inventory.models import (Fabric,Dispatch)

from inventory.serializer import (DispatchSerializer)


class ReportViewSet(ModelViewSet):

    queryset = (
        Dispatch.objects
        .select_related(
            "fabric_type"
        )
        .all()
    )

    serializer_class = (DispatchSerializer)
    permission_classes = [IsAuthenticated]


    @action(detail=False,methods=["get"],url_path="dispatch")

    def dispatch_report(self,request):

        # Get the parameters

        criteria = (request.query_params.get("criteria","")
            .strip()
            .upper()
        )

        category = (request.query_params.get("category","")
            .strip()
            .lower()
        )

        fabric_id = (request.query_params.get("fabric_id"))

        specific_date = (request.query_params.get("date"))

        from_date = (request.query_params.get("from_date"))

        to_date = (request.query_params.get("to_date"))



        # Validate paramters

        if criteria not in ["ST","NF"]:

            return Response(
                {
                    "error":
                    "Criteria must be "
                    "ST or NF."
                },
                status=
                status.HTTP_400_BAD_REQUEST
            )

        if category not in ["single","all"]:

            return Response(
                {
                    "error":
                    "Report category must "
                    "be Single or All."
                },
                status=
                status.HTTP_400_BAD_REQUEST
            )


        dispatches = (self.get_queryset()
            .filter(
                fabric_type__type__istartswith=criteria
            )
        )


        # Parse Specific Date

        if specific_date:
            try:

                parsed_date = (
                    datetime.strptime(
                        specific_date,
                        "%Y-%m-%d"
                    ).date()
                )

                dispatches = (dispatches.filter(dispatched_at__date=parsed_date))

            except ValueError:

                return Response(
                    {
                        "error":
                        "Invalid date format. "
                        "Use YYYY-MM-DD."
                    },
                    status=
                    status.HTTP_400_BAD_REQUEST
                )


        # Parse Date range

        elif (from_date and to_date):

            try:

                parsed_from_date = (
                    datetime.strptime(
                        from_date,
                        "%Y-%m-%d"
                    ).date()
                )

                parsed_to_date = (
                    datetime.strptime(
                        to_date,
                        "%Y-%m-%d"
                    ).date()
                )

            except ValueError:

                return Response(
                    {
                        "error":
                        "Invalid date format. "
                        "Use YYYY-MM-DD."
                    },
                    status=
                    status.HTTP_400_BAD_REQUEST
                )


            if (parsed_from_date > parsed_to_date):

                return Response(
                    {
                        "error":
                        "From date cannot "
                        "be after To date."
                    },
                    status=
                    status.HTTP_400_BAD_REQUEST
                )
            
            dispatches = (dispatches.filter(
                    dispatched_at__date__range=(
                        parsed_from_date,
                        parsed_to_date
                    )
                )
            )


        # No date provided handler

        else:

            return Response(
                {
                    "error":
                    "Select a specific "
                    "date or date range."
                },
                status=
                status.HTTP_400_BAD_REQUEST
            )


        # Report for single fabric

        if category == "single":

            if not fabric_id:

                return Response(
                    {
                        "error":
                        "Fabric is required "
                        "for a Single report."
                    },
                    status=
                    status.HTTP_400_BAD_REQUEST
                )

            try:

                fabric = (Fabric.objects.get(
                        id=fabric_id,
                        type__istartswith=criteria
                    )
                )

            except Fabric.DoesNotExist:

                return Response(
                    {
                        "error":
                        "The selected fabric "
                        f"does not belong to "
                        f"{criteria}."
                    },
                    status=
                    status.HTTP_404_NOT_FOUND
                )


            dispatches = (dispatches
                .filter(
                    fabric_type=fabric
                )
                .order_by(
                    "-dispatched_at"
                )
            )

            report_data = []

            for dispatch in dispatches:

                report_data.append(
                    {
                        "id": dispatch.id,

                        "date": dispatch.dispatched_at.date(),

                        "dispatch_no": dispatch.dispatch_no,

                        "customer_name": dispatch.customer_name,

                        "total_meters": dispatch.total_meters,

                        "total_weight":float(dispatch.total_weight),

                        "total_rolls":dispatch.total_rolls,
                    }
                )


            return Response(
                {
                    "criteria": criteria,

                    "category": "single",

                    "fabric":{
                                "id": fabric.id,
                                "name": fabric.type,
                            },
                            "count":len(report_data),

                    "results": report_data,
                },
                status=
                status.HTTP_200_OK
            )


        # Report for all fabric

        aggregated_data = (dispatches
            .values(
                "fabric_type__id",
                "fabric_type__type",
            )
            .annotate(

                total_rolls=Sum("total_rolls"),

                total_meters=Sum("total_meters"),

                total_weight=Sum("total_weight"),

                dispatch_count=Count("id"),

            )
            .order_by("fabric_type__type")
        )

        report_data = []

        for item in aggregated_data:

            report_data.append(
                {
                    "fabric_id": item["fabric_type__id"],

                    "fabric_name": item["fabric_type__type"],

                    "total_rolls": item["total_rolls"] or 0,

                    "total_meters": item["total_meters"] or 0,

                    "total_weight": float(item["total_weight"] or 0),

                    "dispatch_count": item["dispatch_count"],
                }
            )


        return Response(
            {
                "criteria": criteria,

                "category": "all",

                "count": len(report_data),

                "results": report_data,
            },
            status=
            status.HTTP_200_OK
        )