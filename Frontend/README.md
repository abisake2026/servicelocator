# Local Services Connect – React Frontend

## Requirements
- Node.js 18+

## Setup

```bash
# 1. Install dependencies
npm installn

# 2. Run the dev server (proxies /api → http://localhost:8000)
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── App.jsx                  # Route definitions
├── main.jsx                 # Entry point
├── context/
│   └── AuthContext.jsx      # Auth state (login/logout, isAdmin)
├── utils/
│   ├── api.js               # All fetch calls (authAPI, servicesAPI, etc.)
│   └── constants.js         # Categories, statuses, state-city map
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── BookingModal.jsx      # Full booking form with state→city cascade
│   └── AdminLayout.jsx      # Sidebar + topbar shell for admin pages
├── pages/
│   ├── Home.jsx
│   ├── Services.jsx         # Search + filter + book
│   ├── Providers.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── MyBookings.jsx
│   └── admin/
│       ├── Dashboard.jsx    # Stats, activity, recent bookings
│       ├── AdminServices.jsx
│       ├── AdminProviders.jsx
│       ├── AdminBookings.jsx
│       └── AdminUsers.jsx
└── styles/
    └── style.css            # Global CSS3 stylesheet
```

## Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Home | Public |
| `/services` | Services listing | Public |
| `/providers` | Providers listing | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/my-bookings` | My Bookings | Login required |
| `/admin` | Dashboard | Admin only |
| `/admin/services` | Manage Services | Admin only |
| `/admin/providers` | Manage Providers | Admin only |
| `/admin/bookings` | Manage Bookings | Admin only |
| `/admin/users` | Manage Users | Admin only |
