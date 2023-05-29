from rest_framework import serializers
from books_manager.models import *
from .models import *


class UserSerializer(serializers.ModelSerializer):
    age = serializers.IntegerField(allow_null=True)
    location = serializers.CharField(allow_null=True)
    usr_id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['username', 'password', 'age', 'location', 'usr_id']
        extra_kwargs = {
            'password': {'write_only': True},
            'usr_id': {'required': False},
        }
        
    def get_usr_id(self, obj):
        return obj.id

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        
        instance = self.Meta.model(**validated_data)
        
        if password is not None:
            instance.set_password(password)
        
        instance.is_active = True
        instance.save()
        return instance
    
    
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'year_publication', 'publisher',
            'img_s', 'img_m', 'img_l', 'genres', 'total_pages', 'description',
            'price',
        ]
        extra_kwargs = {
            'id': {'required': False},
            'author': {'required': False},
            'year_publication': {'required': False},
            'publisher': {'required': False},
            'img_s': {'required': False},
            'img_m': {'required': False},
            'img_l': {'required': False},
            'genres': {'required': False},
            'total_pages': {'required': False},
            'description': {'required': False},
            'price': {'required': False},
        }
        
class RatingSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='book.title', required=False)
    author = serializers.CharField(source='book.author', required=False)
    genres = serializers.CharField(source='book.genres', required=False)
    book_id = serializers.IntegerField(source='book.id', required=False)
    
    class Meta:
        model = Rating
        fields = ['id', 'user', 'book', 'star', 'title', 'genres', 'author', 'book_id']
        extra_kwargs = {
            'title': {'required': False},
            'genres': {'required': False},
            'author': {'required': False},
            'id': {'required': False},
        }
        
    def create(self, validated_data):
        book = validated_data['book']
        user = validated_data['user']
        rate_set = Rating.objects.filter(book=book, user=user)
        
        if rate_set.exists():
            rate_obj = rate_set.first()
            rate_obj.star = validated_data['star']
        else:
            rate_obj = self.Meta.model(**validated_data)

        rate_obj.save()
        return rate_obj
    
    
class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id', 'status', 'created_at', 'user', 'total_amount']
        extra_kwargs = {
            'created_at': {'required': False},
            'total_amount': {'required': False},
        }
    
    
class CartItemSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='cart.user.id')
    book_title = serializers.CharField(source='book.title', required=False)
    book_author = serializers.CharField(source='book.author', required=False)
    cart_time = serializers.DateTimeField(source='cart.created_at', required=False)
    book_price = serializers.FloatField(source='book.price', required=False)
    
    class Meta:
        model = CartItem
        fields = [
                'id', 'cart', 'total_amount', 'user_id',
                'book_title', 'book_author', 'book',
                'created_at', 'quantity', 'cart_time',
                'book_price',
            ]
        extra_kwargs = {
            'created_at': {'required': False},
            'cart': {'required': False},
            'book': {'required': True},
            'quantity': {'required': False},
        }
        
    def create(self, validated_data):
        print(validated_data)
        usr_id = validated_data.pop('cart').pop('user').pop('id')
        cart_set = Cart.objects.filter(user=usr_id, status='no')
        
        if cart_set.exists():
            if 'cart_time' in validated_data:
                cart_date = validated_data.pop('cart_time')
                cart_set = cart_set.filter(created_at=cart_date)
            cart_obj = cart_set.first()
            cartItem_set = CartItem.objects.filter(
                cart=cart_obj.id, book=validated_data.get('book')
                )
            
            if cartItem_set.exists():
                cartItem = cartItem_set.first()
                cartItem.quantity += 1
                cartItem.save()
                return cartItem
            
            validated_data['cart'] = cart_obj
        else:
            user = User.objects.filter(id=usr_id).first()
            cart = Cart.objects.create(user=user, status='no')
            cart.save()
            validated_data['cart'] = cart
        
        validated_data['quantity'] = 1
        cartItem = self.Meta.model(**validated_data)
            
        
        cartItem.save()
        return cartItem
    
    
