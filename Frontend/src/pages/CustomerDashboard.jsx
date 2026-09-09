import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, servicesAPI } from '../utils/api';

const STATUS_CLASSES = {
  PENDING: 'status-pending',
  CONFIRMED: 'status-confirmed',
  COMPLETED: 'status-completed',
  CANCELLED: 'status-cancelled',
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingsAPI.getByEmail(user.email),
      servicesAPI.getAll(),
    ]).then(([customerBookings, services]) => {
      setBookings(customerBookings || []);
      setServiceCount((services || []).length);
    }).catch(() => {
      setBookings([]);
    }).finally(() => setLoading(false));
  }, [user.email]);

  const activeBookings = bookings.filter((booking) => ['PENDING', 'CONFIRMED'].includes(booking.status));
  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="page-wrapper customer-dashboard">
      <Navbar />
      <main>
        <section className="customer-welcome">
          <div className="container customer-welcome-inner">
            <div>
              <span className="customer-eyebrow"><i className="fa-solid fa-sparkles" /> Customer dashboard</span>
              <h1>Welcome back, {user.name}</h1>
              <p>Find trusted professionals and keep your service bookings organized.</p>
            </div>
            <button className="btn btn-white" onClick={() => navigate('/services')}>
              <i className="fa-solid fa-magnifying-glass" /> Find a service
            </button>
          </div>
        </section>

        <section className="section bg-gray">
          <div className="container">
            <div className="customer-stats">
              <div className="customer-stat-card">
                <span className="customer-stat-icon blue"><i className="fa-solid fa-calendar-check" /></span>
                <div><strong>{activeBookings.length}</strong><span>Active bookings</span></div>
              </div>
              <div className="customer-stat-card">
                <span className="customer-stat-icon green"><i className="fa-solid fa-circle-check" /></span>
                <div><strong>{bookings.filter((booking) => booking.status === 'COMPLETED').length}</strong><span>Completed services</span></div>
              </div>
              <div className="customer-stat-card">
                <span className="customer-stat-icon orange"><i className="fa-solid fa-briefcase" /></span>
                <div><strong>{serviceCount}</strong><span>Services available</span></div>
              </div>
            </div>

            <div className="customer-dashboard-grid">
              <section className="customer-panel customer-recent-panel">
                <div className="customer-panel-heading">
                  <div><span className="panel-kicker">Your activity</span><h2>Recent bookings</h2></div>
                  <button className="text-button" onClick={() => navigate('/my-bookings')}>View all <i className="fa-solid fa-arrow-right" /></button>
                </div>
                {loading ? (
                  <div className="customer-loading"><i className="fa-solid fa-spinner fa-spin" /> Loading bookings...</div>
                ) : recentBookings.length === 0 ? (
                  <div className="customer-empty"><i className="fa-solid fa-calendar-plus" /><h3>No bookings yet</h3><p>Book your first local service today.</p><button className="btn btn-primary btn-sm" onClick={() => navigate('/services')}>Browse services</button></div>
                ) : (
                  <div className="customer-booking-list">
                    {recentBookings.map((booking) => (
                      <div className="customer-booking-row" key={booking.id}>
                        <div className="customer-booking-icon"><i className="fa-solid fa-briefcase" /></div>
                        <div className="customer-booking-info"><strong>{booking.service_name}</strong><span>{booking.booking_date} · {[booking.city, booking.state].filter(Boolean).join(', ')}</span></div>
                        <span className={`status-badge ${STATUS_CLASSES[booking.status] || ''}`}>{booking.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="customer-panel customer-actions-panel">
                <span className="panel-kicker">Quick actions</span>
                <h2>What do you need?</h2>
                <button className="customer-action" onClick={() => navigate('/services')}><i className="fa-solid fa-magnifying-glass" /><span><strong>Explore services</strong><small>Browse local professionals</small></span><i className="fa-solid fa-chevron-right" /></button>
                <button className="customer-action" onClick={() => navigate('/my-bookings')}><i className="fa-solid fa-calendar-days" /><span><strong>Track bookings</strong><small>See dates and statuses</small></span><i className="fa-solid fa-chevron-right" /></button>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
