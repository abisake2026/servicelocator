import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  const close = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={close}>
          <i className="fa-solid fa-location-dot" />
          <span>LocalServices</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
        </button>

        <ul className={`nav-links${open ? ' open' : ''}`}>
          <li>
            <NavLink to="/" end onClick={close}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" onClick={close}>
              Services
            </NavLink>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <NavLink to="/my-bookings" onClick={close}>
                  My Bookings
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink to="/admin" onClick={close}>
                    <i className="fa-solid fa-gauge me-1" />
                    Admin
                  </NavLink>
                </li>
              )}
              <li className="nav-profile">
                <button
                  className="nav-profile-trigger"
                  onClick={() => setProfileOpen((current) => !current)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                >
                  <i className="fa-solid fa-circle-user" />
                  <span>Profile</span>
                  <i className="fa-solid fa-chevron-down nav-profile-chevron" />
                </button>
                {profileOpen && (
                  <div className="nav-profile-menu" role="menu">
                    <div className="nav-profile-summary">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <small>{isAdmin ? 'Administrator' : user.role === 'provider' ? 'Service Provider' : 'Customer'}</small>
                    </div>
                    {isAdmin && <Link to="/admin/settings" onClick={close}><i className="fa-solid fa-gear" /> Settings</Link>}
                    {user.role === 'provider' && <Link to="/provider/bookings" onClick={close}><i className="fa-solid fa-calendar-check" /> Customer bookings</Link>}
                    {user.role === 'customer' && <Link to="/customer" onClick={close}><i className="fa-solid fa-house" /> Customer dashboard</Link>}
                    <Link to="/my-bookings" onClick={close}><i className="fa-solid fa-calendar-check" /> My Bookings</Link>
                    <button className="nav-profile-logout" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket" /> Logout</button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className="btn btn-outline btn-sm" onClick={close}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className="btn btn-primary btn-sm" onClick={close}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
