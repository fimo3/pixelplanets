from rest_framework import generics
from .models import Planet
from .serializers import PlanetSerializer

class PlanetListCreateView(generics.ListCreateAPIView):
    queryset = Planet.objects.all().order_by('-created_at')
    serializer_class = PlanetSerializer
