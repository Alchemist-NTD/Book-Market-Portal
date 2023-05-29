from django.shortcuts import render

# Create your views here.
from book_market_be.settings import CF_FILTER
from books_manager.serializers import *
from books_manager.models import *
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
import os, time, json
import numpy as np
from surprise import SVD


class CollaborativeFiltering(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if CF_FILTER != None:
            usr_id = self.kwargs['user']

            def predict(user_id):
                items_id = list(Book.objects.values_list('id', flat=True))
                pred_val = np.array([CF_FILTER.predict(user_id, i).est for i in items_id])
                # print(pred_val)
                sorted_weight = np.argsort(pred_val)
                return [items_id[x] for x in sorted_weight][-64:]
            
            start = time.time()
            rec_id = predict(usr_id)
            end = time.time()
            exec_time = end - start
            print(f"prediction time take {exec_time} seconds")
            return Book.objects.filter(id__in=rec_id)
        
        
class ContentBasedRecommendation(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        book = self.kwargs['book']
        sim_top = Book.objects.filter(id=book).first().top_64_sim
        sim_top = sim_top.split('|')
        sim_top = [int(x) for x in sim_top]
        return Book.objects.filter(id__in=sim_top)