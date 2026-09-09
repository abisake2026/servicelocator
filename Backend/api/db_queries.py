"""Reusable MongoDB query helpers for the service locator backend."""

from api.models import Booking, ServiceOffer, ServiceProvider, UserAccount


def get_user_by_email(email: str):
    """Return a single user by normalized email."""
    return UserAccount.objects(email=email.strip().lower()).first()


def get_users_by_role(role: str):
    """Return all users for a specific role."""
    return UserAccount.objects(role=role).order_by('-created_at')


def get_services_by_city(city: str):
    """Return services in a city, case-insensitive."""
    return ServiceOffer.objects(city__icontains=city.strip())


def get_service_by_id(service_id: str):
    """Return a single service by id."""
    return ServiceOffer.objects(id=service_id).first()


def get_providers_by_location(location: str):
    """Return providers located in a given area."""
    return ServiceProvider.objects(location__icontains=location.strip())


def get_provider_by_id(provider_id: str):
    """Return a single provider by id."""
    return ServiceProvider.objects(id=provider_id).first()


def get_bookings_by_email(email: str):
    """Return bookings matching a customer email."""
    return Booking.objects(customer_email__iexact=email.strip()).order_by('-created_at')


def get_booking_by_id(booking_id: str):
    """Return a single booking by id."""
    return Booking.objects(id=booking_id).first()
