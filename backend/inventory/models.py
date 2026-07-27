from django.db import models

# Create your models here.

class Fabric(models.Model):
    type = models.CharField(max_length=50, unique=True)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return self.type  


class Dispatch(models.Model):

    dispatch_no = models.CharField(
        max_length=50, 
        unique=True
    )
    fabric_type = models.ForeignKey(
        Fabric,
        on_delete=models.PROTECT,
        related_name="dispatches"
    )
    financial_year = models.CharField(
        max_length=5
    )
    sequence_no = models.IntegerField(
        blank=True,
        null=True
    )
    total_meters = models.IntegerField(
        default=0
    )

    total_weight = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    total_rolls = models.IntegerField(
        default=0
    )
    customer_name = models.CharField(max_length = 100)
    vehicle_no = models.CharField(max_length = 30)
    dispatched_at = models.DateTimeField(auto_now_add= True)


    def __str__(self):
        return self.dispatch_no



class Roll(models.Model):

    fabric_type = models.ForeignKey(
        Fabric,
        on_delete = models.CASCADE,
        related_name = 'rolls'
    )
    roll_no = models.CharField(
                unique=True, 
                blank=True,
                null=True
            )
    sequence_no = models.IntegerField(
        blank=True,
        null=True
    )
    machine_no = models.IntegerField()
    meters = models.IntegerField()
    weight = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    date = models.DateField(auto_now_add=True)
    dispatch_status = models.CharField( max_length = 15,
            default = 'not_dispatched',
            choices = [
                ('not_dispatched', 'Yet to dispatch'),
                ('dispatched', 'Dispatched')
            ]
        )
    dispatched = models.ForeignKey(
        Dispatch,
        on_delete = models.CASCADE,
        null = True,
        blank = True,
        related_name = "rolls"
    )
    
    def __str__(self):
        return self.roll_no
    


class Barcode(models.Model):
    roll = models.OneToOneField(
        Roll,
        on_delete = models.CASCADE,
        related_name = 'barcode'
    )
    barcode = models.CharField(
        max_length=50,
        blank=True
    )
    
    def __str__(self):
        return self.barcode
    

