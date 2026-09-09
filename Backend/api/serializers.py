"""Serializers / helpers. Works on plain dicts and mongoengine docs."""

import bcrypt
from rest_framework import serializers


# ── Password helpers ──────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def check_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


# ── mongoengine doc → dict helpers ────────────────────────────────────────────

def user_to_dict(u):
    return {
        'id': str(u.id),
        'name': u.name,
        'email': u.email,
        'role': u.role,
        'created_at': u.created_at.isoformat() if u.created_at else None,
        'last_login_at': u.last_login_at.isoformat() if u.last_login_at else None,
        'login_count': u.login_count,
        'active': u.active,
    }


def service_to_dict(s):
    return {
        'id': str(s.id),
        'name': s.name,
        'category': s.category,
        'city': s.city,
        'description': s.description,
        'icon': s.icon,
        'price': s.price,
        'rating': s.rating,
        'provider_id': s.provider_id,
    }


def provider_to_dict(p):
    return {
        'id': str(p.id),
        'name': p.name,
        'location': p.location,
        'specialty': p.specialty,
        'phone': p.phone,
        'email': p.email,
        'rating': p.rating,
        'jobs_completed': p.jobs_completed,
        'experience_years': p.experience_years,
        'verified': p.verified,
    }


def booking_to_dict(b):
    return {
        'id': str(b.id),
        'customer_name': b.customer_name,
        'customer_email': b.customer_email,
        'service_name': b.service_name,
        'service_category': b.service_category,
        'provider_name': b.provider_name,
        'city': b.city,
        'state': b.state,
        'phone': b.phone,
        'door_no': b.door_no,
        'street': b.street,
        'pincode': b.pincode,
        'landmark': b.landmark,
        'booking_date': b.booking_date,
        'status': b.status,
        'notes': b.notes,
        'created_at': b.created_at.isoformat() if b.created_at else None,
    }


# ── Input validators ──────────────────────────────────────────────────────────

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    role = serializers.CharField(default='customer')

    def validate_role(self, value):
        mapping = {'Customer': 'customer', 'Service Provider': 'provider'}
        return mapping.get(value, value.lower())


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UpdatePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6)


class UpdateRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=['admin', 'customer', 'provider'])


class BookingCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField()
    customer_email = serializers.EmailField()
    service_name = serializers.CharField()
    service_category = serializers.CharField()
    provider_name = serializers.CharField(default='Local Service Team')
    city = serializers.CharField(allow_blank=True, required=False, default='')
    state = serializers.CharField(allow_blank=True, required=False, default='')
    phone = serializers.CharField(allow_blank=True, required=False, default='')
    door_no = serializers.CharField(allow_blank=True, required=False, default='')
    street = serializers.CharField(allow_blank=True, required=False, default='')
    pincode = serializers.CharField(allow_blank=True, required=False, default='')
    landmark = serializers.CharField(allow_blank=True, required=False, default='')
    booking_date = serializers.CharField()
    status = serializers.CharField(default='PENDING')
    notes = serializers.CharField(allow_blank=True, required=False, default='')

    def validate_pincode(self, value):
        if value and (not value.isdigit() or len(value) != 6):
            raise serializers.ValidationError('Pincode must be exactly 6 digits.')
        return value


class BookingStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])


class ServiceSerializer(serializers.Serializer):
    name = serializers.CharField()
    category = serializers.CharField(default='OTHER')
    city = serializers.CharField()
    description = serializers.CharField()
    icon = serializers.CharField(default='fa-tools', required=False, allow_blank=True)
    price = serializers.FloatField(default=0.0, required=False)
    rating = serializers.FloatField(default=0.0, required=False)
    provider_id = serializers.CharField(allow_null=True, allow_blank=True, required=False)


class ProviderSerializer(serializers.Serializer):
    name = serializers.CharField()
    location = serializers.CharField()
    specialty = serializers.CharField()
    phone = serializers.CharField(allow_blank=True, required=False, default='')
    email = serializers.EmailField()
    rating = serializers.FloatField(default=0.0, required=False)
    jobs_completed = serializers.IntegerField(default=0, required=False)
    experience_years = serializers.IntegerField(default=0, required=False)
    verified = serializers.BooleanField(default=False, required=False)
