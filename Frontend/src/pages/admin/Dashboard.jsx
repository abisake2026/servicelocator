import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { servicesAPI, providersAPI, bookingsAPI, authAPI } from '../../utils/api';

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon"><i className={`fa-solid ${icon}`} /></div>
      <div className="stat-info">
        <strong>{value ?? <i className="fa-solid fa-spinner fa-spin" />}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [counts, setCounts] = useState({ services: null, providers: null, bookings: null, users: null });
  const [activity, setActivity] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      servicesAPI.getAll(),
      providersAPI.getAll(),
      bookingsAPI.getAll(),
      authAPI.getUsers(),
      authAPI.getActivity(),
    ]).then(([svc, prv, bkg, usr, act]) => {
      setCounts({
        services: svc.value?.length ?? 0,
        providers: prv.value?.length ?? 0,
        bookings: bkg.value?.length ?? 0,
        users: usr.value?.length ?? 0,
      });
      if (act.value) setActivity(act.value);
      if (bkg.value) setRecentBookings(bkg.value.slice(0, 8));
    });
  }, []);

  const STATUS_CLASSES = { PENDING: 'status-pending', CONFIRMED: 'status-confirmed', COMPLETED: 'status-completed', CANCELLED: 'status-cancelled' };

  return (
    <AdminLayout>
      <h2 className="admin-section-title">Dashboard</h2>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard icon="fa-briefcase" label="Services" value={counts.services} color="blue" />
        <StatCard icon="fa-users-gear" label="Providers" value={counts.providers} color="green" />
        <StatCard icon="fa-calendar-check" label="Bookings" value={counts.bookings} color="orange" />
        <StatCard icon="fa-users" label="Users" value={counts.users} color="purple" />
      </div>

      {/* Activity */}
      {activity && (
        <div className="admin-row">
          <div className="admin-card">
            <h3 className="card-title">User Breakdown</h3>
            <div className="mini-stats">
              <div><span className="mini-label">Admins</span><strong>{activity.admins}</strong></div>
              <div><span className="mini-label">Customers</span><strong>{activity.customers}</strong></div>
              <div><span className="mini-label">Providers</span><strong>{activity.providers}</strong></div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="card-title">Recent Registrations</h3>
            <ul className="activity-list">
              {activity.recentRegistrations?.slice(0, 5).map((u) => (
                <li key={u.id}>
                  <i className="fa-solid fa-user-plus" />
                  <span>{u.name}</span>
                  <span className="activity-role">{u.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-card">
            <h3 className="card-title">Recent Logins</h3>
            <ul className="activity-list">
              {activity.recentLogins?.slice(0, 5).map((u) => (
                <li key={u.id}>
                  <i className="fa-solid fa-right-to-bracket" />
                  <span>{u.name}</span>
                  <span className="activity-role">{u.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="admin-card mt-4">
        <h3 className="card-title">Recent Bookings</h3>
        {recentBookings.length === 0 ? (
          <p className="empty-text">No bookings yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>City</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.customer_name}</td>
                    <td>{b.service_name}</td>
                    <td>{b.city}</td>
                    <td>{b.booking_date}</td>
                    <td><span className={`status-badge ${STATUS_CLASSES[b.status] || ''}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
