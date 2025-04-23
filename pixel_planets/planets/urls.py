from django.urls import path
from .views import PlanetListCreateView

urlpatterns = [
    path('', PlanetListCreateView.as_view(), name='planet-list-create'),
]
