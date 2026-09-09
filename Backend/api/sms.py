"""SMS delivery helpers for booking notifications."""

import base64
import logging
import urllib.parse
import urllib.request

from django.conf import settings


logger = logging.getLogger(__name__)


def _phone_number(value):
    phone = ''.join(character for character in (value or '') if character.isdigit() or character == '+')
    if phone.startswith('0'):
        phone = f'+91{phone[1:]}'
    elif phone.isdigit() and len(phone) == 10:
        phone = f'+91{phone}'
    return phone


def send_order_confirmation(booking):
    """Send a confirmation through Twilio, or report why it was skipped."""
    account_sid = settings.TWILIO_ACCOUNT_SID
    auth_token = settings.TWILIO_AUTH_TOKEN
    from_number = settings.TWILIO_FROM_NUMBER
    if not all((account_sid, auth_token, from_number)):
        return {'sent': False, 'configured': False, 'message': 'SMS provider is not configured.'}

    phone = _phone_number(booking.phone)
    if not phone:
        return {'sent': False, 'configured': True, 'message': 'A valid customer phone number is required.'}

    brand = settings.SMS_BRAND_NAME
    message = (
        f'Hi {booking.customer_name}, your {booking.service_category} order '
        f'#{booking.id} with {brand} is confirmed. Reply STOP to cancel.'
    )
    url = f'https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json'
    payload = urllib.parse.urlencode({
        'To': phone,
        'From': from_number,
        'Body': message[:159],
    }).encode('utf-8')
    credentials = base64.b64encode(f'{account_sid}:{auth_token}'.encode('utf-8')).decode('ascii')
    request = urllib.request.Request(url, data=payload, method='POST')
    request.add_header('Authorization', f'Basic {credentials}')
    request.add_header('Content-Type', 'application/x-www-form-urlencoded')

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            if 200 <= response.status < 300:
                return {'sent': True, 'configured': True, 'message': 'SMS notification sent.'}
            return {'sent': False, 'configured': True, 'message': 'SMS provider rejected the notification.'}
    except Exception as error:
        logger.warning('Booking SMS delivery failed: %s', error)
        return {'sent': False, 'configured': True, 'message': 'SMS delivery failed; booking was still created.'}