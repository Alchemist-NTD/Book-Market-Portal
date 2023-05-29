from .models import *
from .serializers import *
from rest_framework import generics, status
from rest_framework.response import Response
from .filters import *
from django.urls import reverse
from rest_framework.permissions import IsAuthenticated, AllowAny
# from .settings import MATRIX
from django.http import HttpResponse
import os, time, json
import random
from django.http import HttpResponseRedirect
from django.http import JsonResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password


# Create your views here.
class UserRetrieveUpdate(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'username'
    
    def get_object(self):
        username = self.kwargs.get('username')
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return status.HTTP_404_NOT_FOUND


@csrf_exempt
def change_user_password(request, username):
    if request.method == 'POST':
        data = json.loads(request.body)
        password = data.get('password')
        new_password = data.get('new_password')

        try:
            user = User.objects.filter(username=username).first()
            if user.check_password(password):
                user.set_password(new_password)
                user.save()
                return JsonResponse({'success': True, 'message': 'Password changed successfully'})
            else:
                return HttpResponseBadRequest('Password incorrect!')
        except Exception as e:
            return status.HTTP_400_BAD_REQUEST
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'}) 


class UserRegister(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class BookSearch(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    filterset_class = BookFilter
    
    
class BookList(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        idxs = random.choices(list(range(Book.objects.count())), k=64)
        return Book.objects.filter(id__in=idxs)
    
    
class BookCreate(generics.CreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]


class BookRetrieve(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    

class RateBookView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]
    queryset = Rating.objects.all()
    
    
class ListRateBookView(generics.ListAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]
    queryset = Rating.objects.select_related('book').all()
    
    def get_queryset(self):
        username = self.kwargs.get('username')
        return self.queryset.filter(user__username=username)
    
    
class RetrieveDestroyRateBookView(generics.RetrieveDestroyAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]
    queryset = Rating.objects.all()

    def get_object(self):
        rate_set = Rating.objects.filter(user=self.kwargs['user'], book=self.kwargs['book'])
        if rate_set.exists():
            return rate_set.first()
        return status.HTTP_404_NOT_FOUND
    
    
class CartList(generics.ListAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.kwargs.get('user')
        return self.queryset.filter(user=user)
    
    
class CartRetrieveDestroy(generics.RetrieveDestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    
class CartItemRetrieveDelete(generics.RetrieveDestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    
class CartItemList(generics.ListAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        cart = self.kwargs.get('cart')
        return self.queryset.filter(cart=cart)
        
    
class AddToCart(generics.CreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    