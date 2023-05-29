from django_filters import FilterSet, AllValuesFilter
from django_filters import NumberFilter
import django_filters
from .models import *

class BookFilter(FilterSet):
    
    title = django_filters.CharFilter(lookup_expr='icontains')
    genres = django_filters.CharFilter(lookup_expr='icontains')
    author = django_filters.CharFilter(lookup_expr='icontains')
    publisher = django_filters.CharFilter(lookup_expr='icontains')
    year_publication = django_filters.NumberFilter(lookup_expr='exact')
    
    class Meta:
        model = Book
        fields = (
                'title',
                'genres',
                'author',
                'publisher',
                'year_publication'
            )
