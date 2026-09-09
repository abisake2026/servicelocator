# Local Services Connect – Django Backend

## Requirements
- Python 3.10+
- MongoDB running on `localhost:27017`

## Setup

```bash
# 1. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows PowerShell
# source venv/bin/activate   # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy and configure environment
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux

# 4. Seed the database (creates admin + demo data)
python manage.py seed

# 5. Run the development server
python manage.py runserver 8000
```

## SMS notifications

Booking confirmations are sent through Twilio when the following values are set in `.env`:

```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=+1234567890
SMS_BRAND_NAME=Local Service Connect
```

The customer phone number must be a valid mobile number. Indian 10-digit numbers are automatically formatted with `+91`; other numbers should use E.164 format.

## API Base URL
`http://localhost:8000/api/`

## Default Admin Credentials
- Email: `admin@localservices.com`
- Password: `admin123`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/users` | List all users |
| GET | `/api/auth/activity` | Activity summary |
| PUT | `/api/auth/users/<id>/password` | Update password |
| PUT | `/api/auth/users/<id>/role` | Update role |
| DELETE | `/api/auth/users/<id>` | Delete user |
| GET/POST | `/api/services` | List / create services |
| GET | `/api/services/search?q=&city=&category=` | Search services |
| GET/PUT/DELETE | `/api/services/<id>` | Service detail |
| GET/POST | `/api/providers` | List / create providers |
| GET | `/api/providers/search?location=&specialty=` | Search providers |
| GET/PUT/DELETE | `/api/providers/<id>` | Provider detail |
| GET/POST | `/api/bookings` | List / create bookings |
| GET | `/api/bookings/by-email/<email>` | Bookings by customer email |
| GET/PUT/DELETE | `/api/bookings/<id>` | Booking detail (PUT updates status) |
