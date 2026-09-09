import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const SETTINGS_KEY = 'providerSettings';
const DEFAULT_NOTIFICATIONS = { email: true, bookings: true, messages: true };

export default function ProviderSettings() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`${SETTINGS_KEY}:${user?.id}`));
      if (stored?.notifications) setNotifications((current) => ({ ...current, ...stored.notifications }));
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, [user?.id]);

  const setPassword = (field) => (event) => {
    setPasswords((current) => ({ ...current, [field]: event.target.value }));
  };

  const updateNotifications = (field) => (event) => {
    const next = { ...notifications, [field]: event.target.checked };
    setNotifications(next);
    localStorage.setItem(`${SETTINGS_KEY}:${user.id}`, JSON.stringify({ notifications: next }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage(null);
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPasswordMessage({ type: 'error', text: 'Complete all password fields.' });
      return;
    }
    if (passwords.next.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setSavingPassword(true);
    try {
      await authAPI.login({ email: user.email, password: passwords.current });
      await authAPI.updatePassword(user.id, passwords.next);
      setPasswords({ current: '', next: '', confirm: '' });
      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.message || 'Unable to update password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-banner">
        <div className="container">
          <div className="banner-breadcrumb"><Link to="/">Home</Link><i className="fa-solid fa-chevron-right" /><span>Settings</span></div>
          <h1><i className="fa-solid fa-gear" /> Provider Settings</h1>
          <p>Manage your provider account and notification preferences.</p>
        </div>
      </div>

      <main className="section bg-gray provider-settings-page">
        <div className="container">
          <div className="settings-grid">
            <section className="admin-card settings-card">
              <div className="settings-card-heading">
                <div className="settings-icon"><i className="fa-solid fa-key" /></div>
                <div><h3 className="card-title">Password management</h3><p>Update the password for {user?.email}.</p></div>
              </div>
              <form className="settings-form" onSubmit={handlePasswordSubmit} noValidate>
                {passwordMessage && <div className={`form-message ${passwordMessage.type}`}>{passwordMessage.text}</div>}
                <div className="form-group"><label htmlFor="provider-username">Username</label><input id="provider-username" className="form-control readonly" value={user?.email || ''} readOnly /></div>
                <div className="form-group"><label htmlFor="provider-current-password">Current password</label><input id="provider-current-password" type="password" className="form-control" value={passwords.current} onChange={setPassword('current')} autoComplete="current-password" required /></div>
                <div className="form-group"><label htmlFor="provider-new-password">New password</label><input id="provider-new-password" type="password" className="form-control" value={passwords.next} onChange={setPassword('next')} autoComplete="new-password" minLength={6} required /></div>
                <div className="form-group"><label htmlFor="provider-confirm-password">Confirm password</label><input id="provider-confirm-password" type="password" className="form-control" value={passwords.confirm} onChange={setPassword('confirm')} autoComplete="new-password" minLength={6} required /></div>
                <button type="submit" className="btn btn-primary" disabled={savingPassword}><i className="fa-solid fa-lock" /> {savingPassword ? 'Updating…' : 'Update password'}</button>
              </form>
            </section>

            <section className="admin-card settings-card">
              <div className="settings-card-heading">
                <div className="settings-icon"><i className="fa-solid fa-bell" /></div>
                <div><h3 className="card-title">Notifications</h3><p>Choose the updates you receive as a provider.</p></div>
              </div>
              <div className="notification-list">
                <label className="notification-option"><span><strong>Email notifications</strong><small>Receive important account updates.</small></span><input type="checkbox" checked={notifications.email} onChange={updateNotifications('email')} /></label>
                <label className="notification-option"><span><strong>Booking alerts</strong><small>Get notified about new service bookings.</small></span><input type="checkbox" checked={notifications.bookings} onChange={updateNotifications('bookings')} /></label>
                <label className="notification-option"><span><strong>Customer messages</strong><small>Receive notifications for customer enquiries.</small></span><input type="checkbox" checked={notifications.messages} onChange={updateNotifications('messages')} /></label>
              </div>
              {saved && <div className="form-message success">Notification preferences saved.</div>}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
