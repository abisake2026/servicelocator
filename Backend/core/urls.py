"""Root URL configuration."""

from django.http import JsonResponse
from django.urls import include, path


def api_root(request):
    return JsonResponse({
        'message': 'Local Services Connect API is running.',
        'endpoints': {
            'health': '/api/health',
            'auth': '/api/auth/login',
            'services': '/api/services',
            'providers': '/api/providers',
            'bookings': '/api/bookings',
        },
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', include('api.urls')),
]
