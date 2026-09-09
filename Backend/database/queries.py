"""MongoDB query helpers for viewing and inspecting backend data."""

from api.models import Booking, ServiceOffer, ServiceProvider, UserAccount


def view_all_users():
    return list(UserAccount.objects().order_by('-created_at'))


def view_all_services():
    return list(ServiceOffer.objects().order_by('-rating'))


def view_all_providers():
    return list(ServiceProvider.objects().order_by('-rating'))


def view_all_bookings():
    return list(Booking.objects().order_by('-created_at'))


def view_user_by_email(email: str):
    return UserAccount.objects(email=email.strip().lower()).first()


def view_services_by_city(city: str):
    return list(ServiceOffer.objects(city__icontains=city.strip()))


def view_bookings_by_email(email: str):
    return list(Booking.objects(customer_email__iexact=email.strip()).order_by('-created_at'))


def print_database_summary():
    """Simple summary function for quick database inspection."""
    return {
        'users': len(view_all_users()),
        'services': len(view_all_services()),
        'providers': len(view_all_providers()),
        'bookings': len(view_all_bookings()),
    }
