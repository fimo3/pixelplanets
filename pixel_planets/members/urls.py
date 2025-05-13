from django.urls import path
from . import views

urlpatterns = [
    path('members/', views.MemberListCreate.as_view(), name='member-list-create'),
    path('members/<int:pk>/', views.MemberDetail.as_view(), name='member-detail'),
    path("signup/", views.SignupView.as_view(), name="signup"),
]
