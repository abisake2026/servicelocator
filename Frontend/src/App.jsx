import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public pages
import Home from './pages/Home';
import Services from './pages/Services';
import Providers from './pages/Providers';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderSettings from './pages/ProviderSettings';
import ProviderBookings from './pages/ProviderBookings';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminProviders from './pages/admin/AdminProviders';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import Settings from './pages/admin/Settings';

/** Redirect to /login if not logged in */
function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

/** Redirect to / if not admin */
function RequireAdmin({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function RequireProvider({ children }) {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== 'provider') return <Navigate to="/" replace />;
  return children;
}

function RequireCustomer({ children }) {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== 'customer') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/providers" element={<Providers />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/my-bookings"
        element={
          <RequireAuth>
            <MyBookings />
          </RequireAuth>
        }
      />
      <Route
        path="/customer"
        element={
          <RequireCustomer>
            <CustomerDashboard />
          </RequireCustomer>
        }
      />
      <Route
        path="/provider/settings"
        element={
          <RequireProvider>
            <ProviderSettings />
          </RequireProvider>
        }
      />
      <Route
        path="/provider/bookings"
        element={
          <RequireProvider>
            <ProviderBookings />
          </RequireProvider>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <Dashboard />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/services"
        element={
          <RequireAdmin>
            <AdminServices />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/providers"
        element={
          <RequireAdmin>
            <AdminProviders />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <RequireAdmin>
            <AdminBookings />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAdmin>
            <AdminUsers />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RequireAdmin>
            <Settings />
          </RequireAdmin>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
