import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../utils/api';
import { BOOKING_STATUSES } from '../utils/constants';

const STATUS_CLASSES = {
  PENDING: 'status-pending',
  CONFIRMED: 'status-confirmed',
  CANCELLED: 'status-cancelled',
  COMPLETED: 'status-completed',
};

export default function ProviderBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingsAPI.getAll();
      setBookings(data || []);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Unable to load customer bookings.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id, status) => {
    setSavingId(id);
    setMessage(null);
    try {
      const updated = await bookingsAPI.updateStatus(id, status);
      setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status: updated.status } : booking));
      setMessage({ type: 'success', text: `Booking ${status.toLowerCase()} successfully.` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Unable to update booking.' });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    setMessage(null);
    try {
      await bookingsAPI.delete(id);
      setBookings((current) => current.filter((booking) => booking.id !== id));
      setMessage({ type: 'success', text: 'Booking deleted successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Unable to delete booking.' });
    }
  };

  const visibleBookings = bookings.filter((booking) => {
    const statusMatch = statusFilter === 'All' || booking.status === statusFilter;
    const searchMatch = !search.trim() || `${booking.customer_name} ${booking.customer_email} ${booking.service_name} ${booking.city} ${booking.booking_date} ${booking.phone}`.toLowerCase().includes(search.trim().toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-banner">
        <div className="container">
          <div className="banner-breadcrumb"><span>Provider</span><i className="fa-solid fa-chevron-right" /><span>Bookings</span></div>
          <h1><i className="fa-solid fa-calendar-check" /> Customer Bookings</h1>
          <p>Review customer requests and manage your accepted bookings.</p>
        </div>
      </div>
      <main className="section bg-gray">
        <div className="container provider-bookings-page">
          <div className="provider-bookings-header">
            <div>
              <h2>Bookings</h2>
              <p>Welcome, {user?.name}. Respond to your customer requests here.</p>
            </div>
            <div className="provider-bookings-header-actions">
              <span className="count-badge">{bookings.length} total</span>
              <button className="btn btn-outline btn-sm" onClick={load} disabled={loading}><i className="fa-solid fa-rotate" /> Refresh</button>
            </div>
          </div>
          {message && <div className={`form-message ${message.type}`}>{message.text}</div>}
          <div className="admin-filters provider-booking-filters">
            <input
              type="text"
              className="form-control admin-search"
              placeholder="Search by customer, service, city..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="filter-strip">
              {['All', ...BOOKING_STATUSES].map((status) => (
                <button key={status} className={`filter-btn${statusFilter === status ? ' active' : ''}`} onClick={() => setStatusFilter(status)}>{status}</button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="loading-state"><i className="fa-solid fa-spinner fa-spin" /><p>Loading customer bookings…</p></div>
          ) : visibleBookings.length === 0 ? (
            <div className="empty-state"><i className="fa-solid fa-calendar-xmark" /><h4>No bookings found</h4><p>Customer bookings will appear here.</p></div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Customer</th><th>Service</th><th>City</th><th>Date</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {visibleBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td><div>{booking.customer_name}</div><small className="text-muted">{booking.customer_email}</small></td>
                      <td>{booking.service_name}</td>
                      <td>{[booking.city, booking.state].filter(Boolean).join(', ')}</td>
                      <td>{booking.booking_date}</td>
                      <td>{booking.phone || '—'}</td>
                      <td>
                        <select
                          className={`status-select ${STATUS_CLASSES[booking.status] || ''}`}
                          value={booking.status}
                          disabled={savingId === booking.id}
                          onChange={(event) => handleStatusChange(booking.id, event.target.value)}
                        >
                          {BOOKING_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </td>
                      <td><button className="btn-icon btn-icon-danger" onClick={() => handleDelete(booking.id)} title="Delete"><i className="fa-solid fa-trash" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
