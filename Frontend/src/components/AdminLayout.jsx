import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-gauge' },
  { to: '/admin/services', label: 'Services', icon: 'fa-briefcase' },
  { to: '/admin/providers', label: 'Providers', icon: 'fa-users-gear' },
  { to: '/admin/bookings', label: 'Bookings', icon: 'fa-calendar-check' },
  { to: '/admin/users', label: 'Users', icon: 'fa-user-shield' },
  { to: '/admin/settings', label: 'Settings', icon: 'fa-gear' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-brand">
          <i className="fa-solid fa-location-dot" />
          <span>Admin Panel</span>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`fa-solid ${icon}`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <i className="fa-solid fa-circle-user" />
            <span>{user?.name}</span>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            <i className="fa-solid fa-bars" />
          </button>
          <h1 className="admin-page-title">Admin</h1>
          <div className="admin-topbar-right">
            <span className="admin-badge">Admin</span>
            <span>{user?.name}</span>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
