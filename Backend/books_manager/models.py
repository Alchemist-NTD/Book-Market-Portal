from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import datetime


# Create your models here.
def default_created_at():
    now = datetime.datetime.now()
    now = now + datetime.timedelta(hours=7)
    return now.strftime("%Y-%m-%d %H:%M:%S")

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(null=False, default="", max_length=128, unique=True)
    age = models.IntegerField(null=True)
    location = models.CharField(null=True, max_length=256)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f'{self.id}_{self.username}'
    
    
class Book(models.Model):
    id = models.AutoField(primary_key=True)
    isbn = models.CharField(max_length=20, null=True)
    title = models.CharField(max_length=1024, null=True)
    author = models.CharField(max_length=1024, null=True)
    year_publication = models.IntegerField(null=True)
    publisher = models.CharField(max_length=1024, null=True)
    img_s = models.URLField(null=True)
    img_m = models.URLField(null=True)
    img_l = models.URLField(null=True)
    genres = models.CharField(max_length=10000, null=True)
    total_pages = models.IntegerField(null=True)
    description = models.CharField(max_length=100000, null=True)
    top_64_sim = models.CharField(max_length=1024, null=True)
    
    @property
    def price(self):
        return 1 if self.total_pages == 0 else self.total_pages * 800 / 20000
    
    def __str__(self):
        return str(self.title)
    
    
class Rating(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id', default=300000)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, to_field='id', default=1)
    star = models.IntegerField(null=False, default=0)
    
    
class Cart(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id', default=300000)
    status = models.CharField(max_length=3, null=False, default='no')
    
    @property
    def total_amount(self):
        cart_items = self.cartitem_set.all()
        if cart_items.exists():
            total = sum(item.total_amount for item in cart_items)
            return total
        
        return 0
    
    def save(self, *args, **kwargs):
        if not self.pk and not self.created_at:
            self.created_at = default_created_at()
        return super().save(*args, **kwargs)


class CartItem(models.Model):
    id = models.AutoField(primary_key=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, to_field='id', default=1)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, to_field='id', default=1)
    created_at = models.DateTimeField(blank=True, null=True)
    quantity = models.PositiveIntegerField()
    
    @property
    def total_amount(self):
        return self.book.price * self.quantity
    
    def save(self, *args, **kwargs):
        if not self.pk and not self.created_at:
            self.created_at = default_created_at()
        return super().save(*args, **kwargs)
    
    
