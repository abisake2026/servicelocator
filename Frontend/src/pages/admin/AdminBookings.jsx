import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { bookingsAPI } from '../../utils/api';
import { BOOKING_STATUSES } from '../../utils/constants';

const STATUS_CLASSES = { PENDING: 'status-pending', CONFIRMED: 'status-confirmed', COMPLETED: 'status-completed', CANCELLED: 'status-cancelled' };

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setBookings((await bookingsAPI.getAll()) || []); }
    catch { setBookings([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await bookingsAPI.updateStatus(id, newStatus);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: updated.status } : b));
    } catch (err) { alert(err.message || 'Failed to update status.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await bookingsAPI.delete(id);
      setBookings((b) => b.filter((x) => x.id !== id));
    } catch (err) { alert(err.message || 'Failed to delete.'); }
  };

  const filtered = bookings.filter((b) => {
    const statusMatch = filter === 'All' || b.status === filter;
    const searchMatch = !search.trim() ||
      `${b.customer_name} ${b.customer_email} ${b.service_name} ${b.city}`.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Bookings</h2>
        <span className="count-badge">{bookings.length} total</span>
      </div>

      <div className="admin-filters">
        <input
          type="text"
          className="form-control admin-search"
          placeholder="Search by customer, service, city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-strip">
          {['All', ...BOOKING_STATUSES].map((s) => (
            <button key={s} className={`filter-btn${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><i className="fa-solid fa-spinner fa-spin" /><p>Loading…</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><i className="fa-solid fa-calendar-xmark" /><h4>No bookings found</h4></div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Customer</th><th>Service</th><th>City</th><th>Date</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div>{b.customer_name}</div>
                    <small className="text-muted">{b.customer_email}</small>
                  </td>
                  <td>{b.service_name}</td>
                  <td>{[b.city, b.state].filter(Boolean).join(', ')}</td>
                  <td>{b.booking_date}</td>
                  <td>{b.phone || '—'}</td>
                  <td>
                    <select
                      className={`status-select ${STATUS_CLASSES[b.status] || ''}`}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    >
                      {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(b.id)} title="Delete"><i className="fa-solid fa-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
