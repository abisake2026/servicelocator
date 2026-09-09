"""
mongoengine Document models – no Django ORM.
"""

import datetime
from mongoengine import (
    Document, StringField, FloatField, IntField,
    BooleanField, DateTimeField,
)


def _now():
    return datetime.datetime.utcnow()


class UserAccount(Document):
    meta = {'collection': 'users', 'strict': False}

    name = StringField(required=True, max_length=200)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(default='customer')
    created_at = DateTimeField(default=_now)
    last_login_at = DateTimeField(null=True)
    last_password_changed_at = DateTimeField(null=True)
    login_count = IntField(default=0)
    active = BooleanField(default=True)


class ServiceOffer(Document):
    meta = {'collection': 'services', 'strict': False}

    name = StringField(required=True, max_length=200)
    category = StringField(default='OTHER')
    city = StringField(required=True)
    description = StringField(required=True)
    icon = StringField(default='fa-tools')
    price = FloatField(default=0.0)
    rating = FloatField(default=0.0)
    provider_id = StringField(null=True)


class ServiceProvider(Document):
    meta = {'collection': 'providers', 'strict': False}

    name = StringField(required=True, max_length=200)
    location = StringField(required=True)
    specialty = StringField(required=True)
    phone = StringField()
    email = StringField(required=True)
    rating = FloatField(default=0.0)
    jobs_completed = IntField(default=0)
    experience_years = IntField(default=0)
    verified = BooleanField(default=False)


class Booking(Document):
    meta = {'collection': 'bookings', 'strict': False}

    customer_name = StringField(required=True)
    customer_email = StringField(required=True)
    service_name = StringField(required=True)
    service_category = StringField(required=True)
    provider_name = StringField(default='Local Service Team')
    city = StringField()
    state = StringField()
    phone = StringField()
    door_no = StringField()
    street = StringField()
    pincode = StringField()
    landmark = StringField()
    booking_date = StringField(required=True)
    status = StringField(default='PENDING')
    notes = StringField(default='')
    created_at = DateTimeField(default=_now)
