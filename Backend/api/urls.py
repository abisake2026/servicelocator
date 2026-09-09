"""API URL routing – mirrors the original Spring Boot endpoint surface."""

from django.urls import path
from . import views

urlpatterns = [
    # Health
    path('health', views.health, name='health'),

    # Auth
    path('auth/register', views.register, name='auth-register'),
    path('auth/login', views.login, name='auth-login'),
    path('auth/users', views.get_all_users, name='auth-users'),
    path('auth/activity', views.activity_summary, name='auth-activity'),
    path('auth/users/<str:user_id>/password', views.update_user_password, name='auth-update-password'),
    path('auth/users/<str:user_id>/role', views.update_user_role, name='auth-update-role'),
    path('auth/users/<str:user_id>', views.delete_user, name='auth-delete-user'),

    # Services
    path('services/search', views.services_search, name='services-search'),
    path('services/<str:service_id>', views.service_detail, name='service-detail'),
    path('services', views.services_list, name='services-list'),

    # Providers
    path('providers/search', views.providers_search, name='providers-search'),
    path('providers/<str:provider_id>', views.provider_detail, name='provider-detail'),
    path('providers', views.providers_list, name='providers-list'),

    # Bookings – note: email route must come before <id> to avoid collision
    path('bookings/by-email/<str:email>', views.bookings_by_email, name='bookings-by-email'),
    path('bookings/<str:booking_id>', views.booking_detail, name='booking-detail'),
    path('bookings', views.bookings_list, name='bookings-list'),
]
