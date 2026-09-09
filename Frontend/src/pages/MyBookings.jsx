import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { BOOKING_STATUSES } from '../utils/constants';

const STATUS_CLASSES = {
  PENDING: 'status-pending',
  CONFIRMED: 'status-confirmed',
  COMPLETED: 'status-completed',
  CANCELLED: 'status-cancelled',
};

export default function MyBookings() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [filter, setFilter] = useState('All');
  const [msg, setMsg] = useState(null);

  // Auto-load on mount if logged in
  useEffect(() => {
    if (isLoggedIn && user?.email) fetchBookings(user.email);
  }, []); // eslint-disable-line

  const fetchBookings = async (lookupEmail) => {
    if (!lookupEmail?.trim()) {
      setMsg({ type: 'error', text: 'Please enter your email.' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const data = await bookingsAPI.getByEmail(lookupEmail.trim().toLowerCase());
      setBookings(data || []);
      if (!data?.length) setMsg({ type: 'info', text: 'No bookings found for this email.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to load bookings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings(email);
  };

  const filtered = filter === 'All' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <>
      <Navbar />

      <div className="page-banner">
        <div className="container">
          <h1>My Bookings</h1>
          <p>Track and manage your service bookings</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Email lookup */}
          <form className="bookings-lookup" onSubmit={handleSearch}>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email to find bookings"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <i className="fa-solid fa-spinner fa-spin" /> : 'Find Bookings'}
            </button>
          </form>

          {msg && <div className={`form-message ${msg.type} mt-3`}>{msg.text}</div>}

          {bookings.length > 0 && (
            <>
              {/* Status filter */}
              <div className="filter-strip mt-4">
                {['All', ...BOOKING_STATUSES].map((s) => (
                  <button
                    key={s}
                    className={`filter-btn${filter === s ? ' active' : ''}`}
                    onClick={() => setFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p className="results-count">{filtered.length} booking{filtered.length !== 1 ? 's' : ''} found</p>

              {filtered.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-solid fa-calendar-xmark" />
                  <h4>No bookings with this status</h4>
                </div>
              ) : (
                <div className="bookings-list">
                  {filtered.map((b) => (
                    <div key={b.id} className="booking-card">
                      <div className="booking-card-header">
                        <div>
                          <h3>{b.service_name}</h3>
                          <span className="badge-soft">{b.service_category}</span>
                        </div>
                        <span className={`status-badge ${STATUS_CLASSES[b.status] || ''}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="booking-card-body">
                        <div className="booking-detail">
                          <i className="fa-solid fa-user" />
                          <span>{b.customer_name}</span>
                        </div>
                        <div className="booking-detail">
                          <i className="fa-solid fa-calendar" />
                          <span>{b.booking_date}</span>
                        </div>
                        <div className="booking-detail">
                          <i className="fa-solid fa-location-dot" />
                          <span>{[b.city, b.state].filter(Boolean).join(', ')}</span>
                        </div>
                        {b.provider_name && (
                          <div className="booking-detail">
                            <i className="fa-solid fa-user-tie" />
                            <span>{b.provider_name}</span>
                          </div>
                        )}
                        {b.phone && (
                          <div className="booking-detail">
                            <i className="fa-solid fa-phone" />
                            <span>{b.phone}</span>
                          </div>
                        )}
                      </div>
                      {b.notes && (
                        <p className="booking-notes">
                          <i className="fa-solid fa-note-sticky" /> {b.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!isLoggedIn && !bookings.length && !msg && (
            <div className="empty-state">
              <i className="fa-solid fa-calendar-days" />
              <h4>No bookings yet</h4>
              <p>Enter your email above to look up your bookings, or browse services to make one.</p>
              <button className="btn btn-primary mt-3" onClick={() => navigate('/services')}>
                Browse Services
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
