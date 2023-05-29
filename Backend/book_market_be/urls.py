from books_manager.views import *
from books_recommender.views import *

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)


router = routers.DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),

    path(r'login', TokenObtainPairView.as_view(), name='login'),
    path(r'logout', TokenBlacklistView.as_view(), name='logout'),
    
    path(r'register', UserRegister.as_view(), name='register'),
    path(r'user/retrieve/<str:username>', UserRetrieveUpdate.as_view(), name="user_retrieve"),
    path(r'user/update/<str:username>', UserRetrieveUpdate.as_view(), name="user_update"),
    path(r'user/update/password/<str:username>', change_user_password, name="user_update_password"),
    
    path(r'book/create', BookCreate.as_view(), name='book_create'),
    path(r'book/info/<int:pk>', BookRetrieve.as_view(), name='book_info'),
    path(r'book/list', BookList.as_view(), name='book_list'),
    path(r'book/search', BookSearch.as_view(), name='book_search'),
    
    path(r'book/rate/', RateBookView.as_view(), name="rate_Book"),
    path(r'book/rate/retrieve/<int:user>/<int:book>', RetrieveDestroyRateBookView.as_view(), name="retrieve_rate"),
    path(r'book/rate/delete/<int:user>/<int:book>', RetrieveDestroyRateBookView.as_view(), name="delete_rate"),
    path(r'book/rate/list/<str:username>', ListRateBookView.as_view(), name="list_rate"),
    
    path(r'cart/items/add', AddToCart.as_view(), name="add_to_cart"),
    path(r'cart/items/delete/<int:pk>', CartItemRetrieveDelete.as_view(), name="del_from_cart"),
    path(r'cart/items/list/<int:cart>', CartItemList.as_view(), name="list_from_cart"),
    path(r'cart/list/<int:user>', CartList.as_view(), name="list_cart"),
    path(r'cart/delete/<int:pk>', CartRetrieveDestroy.as_view(), name="delete_cart"),
    
    path(r'book/recommender/collaborative/<int:user>', CollaborativeFiltering.as_view(), name="get_cf"),
    path(r'book/recommender/content/<int:book>', ContentBasedRecommendation.as_view(), name="get_cb"),
]
