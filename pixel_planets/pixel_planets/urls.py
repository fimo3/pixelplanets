from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/planets/', include('planets.urls')),
    path('api/members/', include('members.urls')),
]
