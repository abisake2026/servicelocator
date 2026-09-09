"""Custom DRF exception handler – returns { "message": "..." } for all errors."""

from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        # Flatten the error detail into a single message string
        data = response.data
        if isinstance(data, dict):
            if 'detail' in data:
                message = str(data['detail'])
            else:
                # Join all field errors
                parts = []
                for key, val in data.items():
                    if isinstance(val, list):
                        parts.append(f'{key}: {" ".join(str(v) for v in val)}')
                    else:
                        parts.append(str(val))
                message = ' | '.join(parts)
        elif isinstance(data, list):
            message = ' | '.join(str(i) for i in data)
        else:
            message = str(data)

        response.data = {'message': message}

    return response
