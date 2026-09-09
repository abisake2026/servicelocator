"""All API views using mongoengine Documents."""

import datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Booking, ServiceOffer, ServiceProvider, UserAccount
from .sms import send_order_confirmation
from .serializers import (
    BookingCreateSerializer, BookingStatusSerializer,
    LoginSerializer, ProviderSerializer, RegisterSerializer,
    ServiceSerializer, UpdatePasswordSerializer, UpdateRoleSerializer,
    booking_to_dict, check_password, hash_password,
    provider_to_dict, service_to_dict, user_to_dict,
)


def _now():
    return datetime.datetime.utcnow()


# ── Health ─────────────────────────────────────────────────────────────────────

@api_view(['GET'])
def health(request):
    return Response('Local Services Connect API is running (Django + mongoengine)')


# ── Auth ───────────────────────────────────────────────────────────────────────

@api_view(['POST'])
def register(request):
    s = RegisterSerializer(data=request.data)
    if not s.is_valid():
        msg = next(iter(s.errors.values()))
        msg = msg[0] if isinstance(msg, list) else str(msg)
        return Response({'message': str(msg)}, status=status.HTTP_400_BAD_REQUEST)

    email = s.validated_data['email'].strip().lower()
    if UserAccount.objects(email=email).first():
        return Response({'message': 'An account with this email already exists.'}, status=status.HTTP_409_CONFLICT)

    user = UserAccount(
        name=s.validated_data['name'].strip(),
        email=email,
        password=hash_password(s.validated_data['password']),
        role=s.validated_data['role'],
        last_password_changed_at=_now(),
    )
    user.save()
    return Response(
        {'id': str(user.id), 'name': user.name, 'email': user.email,
         'role': user.role, 'createdAt': user.created_at.isoformat(),
         'message': 'Account created successfully.'},
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
def login(request):
    s = LoginSerializer(data=request.data)
    if not s.is_valid():
        return Response({'message': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    email = s.validated_data['email'].strip().lower()
    password = s.validated_data['password']
    user = UserAccount.objects(email=email).first()

    if not user or not check_password(password, user.password):
        return Response({'message': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    user.last_login_at = _now()
    user.login_count = (user.login_count or 0) + 1
    user.active = True
    user.save()

    return Response({
        'id': str(user.id), 'name': user.name, 'email': user.email,
        'role': user.role, 'loginCount': user.login_count,
        'lastLoginAt': user.last_login_at.isoformat(),
        'message': 'Login successful.',
    })


@api_view(['GET'])
def get_all_users(request):
    users = UserAccount.objects().order_by('-created_at')
    return Response([user_to_dict(u) for u in users])


@api_view(['GET'])
def activity_summary(request):
    users = list(UserAccount.objects())
    total = len(users)
    admins    = sum(1 for u in users if u.role == 'admin')
    customers = sum(1 for u in users if u.role == 'customer')
    providers = sum(1 for u in users if u.role == 'provider')

    recent_logins = sorted(
        [u for u in users if u.last_login_at],
        key=lambda u: u.last_login_at, reverse=True
    )[:8]
    recent_registrations = sorted(users, key=lambda u: u.created_at, reverse=True)[:8]

    return Response({
        'totalUsers': total, 'admins': admins,
        'customers': customers, 'providers': providers,
        'recentLogins': [user_to_dict(u) for u in recent_logins],
        'recentRegistrations': [user_to_dict(u) for u in recent_registrations],
        'message': 'Activity summary loaded successfully.',
    })


@api_view(['PUT'])
def update_user_password(request, user_id):
    s = UpdatePasswordSerializer(data=request.data)
    if not s.is_valid():
        return Response({'message': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = UserAccount.objects.get(id=user_id)
    except Exception:
        return Response({'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    user.password = hash_password(s.validated_data['password'])
    user.last_password_changed_at = _now()
    user.active = True
    user.save()
    return Response({'id': str(user.id), 'name': user.name, 'email': user.email,
                     'role': user.role, 'message': 'Password updated successfully.'})


@api_view(['PUT'])
def update_user_role(request, user_id):
    s = UpdateRoleSerializer(data=request.data)
    if not s.is_valid():
        return Response({'message': 'Role is required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = UserAccount.objects.get(id=user_id)
    except Exception:
        return Response({'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    user.role = s.validated_data['role']
    user.save()
    return Response({'id': str(user.id), 'name': user.name, 'email': user.email,
                     'role': user.role, 'message': 'Role updated successfully.'})


@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = UserAccount.objects.get(id=user_id)
    except Exception:
        return Response({'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    user.delete()
    return Response({'message': 'User deleted successfully.'})


# ── Services ───────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def services_list(request):
    if request.method == 'GET':
        return Response([service_to_dict(s) for s in ServiceOffer.objects()])

    s = ServiceSerializer(data=request.data)
    if not s.is_valid():
        return Response({'message': str(s.errors)}, status=status.HTTP_400_BAD_REQUEST)
    svc = ServiceOffer(**s.validated_data)
    svc.save()
    return Response(service_to_dict(svc), status=status.HTTP_201_CREATED)


@api_view(['GET'])
def services_search(request):
    q        = request.query_params.get('q', '').strip()
    city     = request.query_params.get('city', '').strip()
    category = request.query_params.get('category', '').strip().upper()

    seen = {}
    if q:
        for s in ServiceOffer.objects(name__icontains=q): seen[str(s.id)] = s
    if city:
        for s in ServiceOffer.objects(city__icontains=city): seen[str(s.id)] = s
    if category:
        for s in ServiceOffer.objects(category=category): seen[str(s.id)] = s
    if not seen:
        seen = {str(s.id): s for s in ServiceOffer.objects()}

    return Response([service_to_dict(s) for s in seen.values()])


@api_view(['GET', 'PUT', 'DELETE'])
def service_detail(request, service_id):
    try:
        svc = ServiceOffer.objects.get(id=service_id)
    except Exception:
        return Response({'message': 'Service not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(service_to_dict(svc))
    if request.method == 'PUT':
        for field, val in request.data.items():
            if hasattr(svc, field) and val is not None:
                setattr(svc, field, val)
        svc.save()
        return Response(service_to_dict(svc))
    svc.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── Providers ──────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def providers_list(request):
    if request.method == 'GET':
        return Response([provider_to_dict(p) for p in ServiceProvider.objects()])

    s = ProviderSerializer(data=request.data)
    if not s.is_valid():
        return Response({'message': str(s.errors)}, status=status.HTTP_400_BAD_REQUEST)
    provider = ServiceProvider(**s.validated_data)
    provider.save()
    return Response(provider_to_dict(provider), status=status.HTTP_201_CREATED)


@api_view(['GET'])
def providers_search(request):
    location  = request.query_params.get('location', '').strip()
    specialty = request.query_params.get('specialty', '').strip()

    if location:
        qs = ServiceProvider.objects(location__icontains=location)
    elif specialty:
        qs = ServiceProvider.objects(specialty__icontains=specialty)
    else:
        qs = ServiceProvider.objects()
    return Response([provider_to_dict(p) for p in qs])


@api_view(['GET', 'PUT', 'DELETE'])
def provider_detail(request, provider_id):
    try:
        provider = ServiceProvider.objects.get(id=provider_id)
    except Exception:
        return Response({'message': 'Provider not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(provider_to_dict(provider))
    if request.method == 'PUT':
        for field, val in request.data.items():
            if hasattr(provider, field) and val is not None:
                setattr(provider, field, val)
        provider.save()
        return Response(provider_to_dict(provider))
    provider.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── Bookings ───────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def bookings_list(request):
    if request.method == 'GET':
        return Response([booking_to_dict(b) for b in Booking.objects().order_by('-created_at')])

    s = BookingCreateSerializer(data=request.data)
    if not s.is_valid():
        parts = [f'{k}: {v[0] if isinstance(v, list) else v}' for k, v in s.errors.items()]
        return Response({'message': ' | '.join(parts)}, status=status.HTTP_400_BAD_REQUEST)
    booking = Booking(**s.validated_data)
    booking.save()
    response = booking_to_dict(booking)
    response['sms'] = send_order_confirmation(booking)
    return Response(response, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def bookings_by_email(request, email):
    bookings = Booking.objects(customer_email__iexact=email.strip()).order_by('-created_at')
    return Response([booking_to_dict(b) for b in bookings])


@api_view(['GET', 'PUT', 'DELETE'])
def booking_detail(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
    except Exception:
        return Response({'message': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(booking_to_dict(booking))
    if request.method == 'PUT':
        s = BookingStatusSerializer(data=request.data)
        if not s.is_valid():
            return Response({'message': 'Invalid status value.'}, status=status.HTTP_400_BAD_REQUEST)
        booking.status = s.validated_data['status']
        booking.save()
        return Response(booking_to_dict(booking))
    booking.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
