import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';

const NOTIFICATION_KEY = 'adminNotificationSettings';
const SECURITY_KEY = 'adminSecuritySettings';
const DEFAULT_NOTIFICATIONS = {
  email: true,
  bookings: true,
  userActivity: false,
};
const SMS_TEMPLATES_KEY = 'adminSmsTemplates';
const SMS_MAX_LENGTH = 159;

const createSmsTemplates = (brand, category) => {
  const safeBrand = brand.trim().slice(0, 24) || 'Local Service Connect';
  const safeCategory = category.trim().slice(0, 20) || 'Plumbing';
  return [
    `Hi {First_Name}, your ${safeCategory} order #{Order_Number} with ${safeBrand} is confirmed. Track: {Short_URL}`,
    `${safeBrand}: Hi {First_Name}, order #{Order_Number} for ${safeCategory} is confirmed. View details: {Short_URL}. Reply STOP to cancel.`,
    `Thanks, {First_Name}. ${safeBrand} confirmed order #{Order_Number} for ${safeCategory}. Track updates: {Short_URL}. Reply STOP to cancel.`,
    `Order confirmed, {First_Name}! ${safeBrand} is handling your ${safeCategory} request #{Order_Number}. Details: {Short_URL}. STOP to cancel.`,
  ];
};

const SMS_VARIATION_LABELS = ['Minimal & direct', 'Clear & compliant', 'Warm & concise', 'Professional & brief'];

export default function Settings() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '', otp: '' });
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [smsBrand, setSmsBrand] = useState('Local Service Connect');
  const [smsCategory, setSmsCategory] = useState('Plumbing');
  const [smsTemplates, setSmsTemplates] = useState(() => createSmsTemplates('Local Service Connect', 'Plumbing'));
  const [copiedTemplate, setCopiedTemplate] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(NOTIFICATION_KEY));
      if (saved) setNotifications((current) => ({ ...current, ...saved }));
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
    try {
      const savedSecurity = JSON.parse(localStorage.getItem(SECURITY_KEY));
      if (savedSecurity) setTwoStepEnabled(Boolean(savedSecurity.twoStepEnabled));
    } catch {
      setTwoStepEnabled(false);
    }
    try {
      const savedSms = JSON.parse(localStorage.getItem(SMS_TEMPLATES_KEY));
      if (savedSms?.brand && savedSms?.category && Array.isArray(savedSms.templates)) {
        setSmsBrand(savedSms.brand);
        setSmsCategory(savedSms.category);
        setSmsTemplates(savedSms.templates);
      }
    } catch {
      setSmsTemplates(createSmsTemplates('Local Service Connect', 'Plumbing'));
    }
  }, []);

  const updatePasswordField = (field) => (event) => {
    setPasswords((current) => ({ ...current, [field]: event.target.value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage(null);

    if (!passwords.current || !passwords.next || !passwords.confirm || (twoStepEnabled && !passwords.otp)) {
      setPasswordMessage({ type: 'error', text: 'Complete all required fields.' });
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
    if (twoStepEnabled && !/^\d{6}$/.test(passwords.otp)) {
      setPasswordMessage({ type: 'error', text: 'OTP must be exactly 6 digits.' });
      return;
    }

    setSavingPassword(true);
    try {
      await authAPI.login({ email: user.email, password: passwords.current });
      await authAPI.updatePassword(user.id, passwords.next);
      setPasswords({ current: '', next: '', confirm: '', otp: '' });
      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.message || 'Unable to update password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleTwoStepChange = (event) => {
    const enabled = event.target.checked;
    setTwoStepEnabled(enabled);
    localStorage.setItem(SECURITY_KEY, JSON.stringify({ twoStepEnabled: enabled }));
    if (!enabled) setPasswords((current) => ({ ...current, otp: '' }));
  };

  const handleNotificationChange = (field) => (event) => {
    const next = { ...notifications, [field]: event.target.checked };
    setNotifications(next);
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(next));
    setNotificationMessage('Notification preferences saved.');
    window.setTimeout(() => setNotificationMessage(null), 2500);
  };

  const regenerateSmsTemplates = (brand, category) => {
    const nextTemplates = createSmsTemplates(brand.trim() || 'Local Service Connect', category.trim() || 'Plumbing');
    setSmsTemplates(nextTemplates);
    localStorage.setItem(SMS_TEMPLATES_KEY, JSON.stringify({ brand, category, templates: nextTemplates }));
  };

  const handleSmsInputChange = (setter, field) => (event) => {
    const value = event.target.value;
    setter(value);
    regenerateSmsTemplates(field === 'brand' ? value : smsBrand, field === 'category' ? value : smsCategory);
  };

  const handleSmsTemplateChange = (index) => (event) => {
    const value = event.target.value;
    setSmsTemplates((current) => {
      const nextTemplates = current.map((template, templateIndex) => (templateIndex === index ? value : template));
      localStorage.setItem(SMS_TEMPLATES_KEY, JSON.stringify({ brand: smsBrand, category: smsCategory, templates: nextTemplates }));
      return nextTemplates;
    });
  };

  const copySmsTemplate = async (template, index) => {
    try {
      await navigator.clipboard.writeText(template);
      setCopiedTemplate(index);
      window.setTimeout(() => setCopiedTemplate(null), 1800);
    } catch {
      setCopiedTemplate(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Settings</h2>
          <p className="settings-subtitle">Manage your administrator account and notifications.</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="admin-card settings-card">
          <div className="settings-card-heading">
            <div className="settings-icon"><i className="fa-solid fa-key" /></div>
            <div>
              <h3 className="card-title">Password management</h3>
              <p>Update the password for your administrator account.</p>
            </div>
          </div>

          <form className="settings-form" onSubmit={handlePasswordSubmit} noValidate>
            {passwordMessage && <div className={`form-message ${passwordMessage.type}`}>{passwordMessage.text}</div>}
            <div className="form-group">
              <label htmlFor="settings-username">Username</label>
              <input id="settings-username" type="email" className="form-control readonly" value={user?.email || ''} readOnly autoComplete="username" />
            </div>
            <div className="form-group">
              <label htmlFor="current-password">Current password</label>
              <input id="current-password" type="password" className="form-control" value={passwords.current} onChange={updatePasswordField('current')} autoComplete="current-password" required />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New password</label>
              <input id="new-password" type="password" className="form-control" value={passwords.next} onChange={updatePasswordField('next')} autoComplete="new-password" minLength={6} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input id="confirm-password" type="password" className="form-control" value={passwords.confirm} onChange={updatePasswordField('confirm')} autoComplete="new-password" minLength={6} required />
            </div>
            {twoStepEnabled && (
              <div className="form-group">
                <label htmlFor="otp-verification">OTP verification</label>
                <input id="otp-verification" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} className="form-control" value={passwords.otp} onChange={updatePasswordField('otp')} placeholder="Enter 6-digit OTP" autoComplete="one-time-code" required />
                <small className="settings-help">Enter the OTP sent to your registered contact.</small>
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={savingPassword}>
              <i className="fa-solid fa-lock" /> {savingPassword ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <label className="notification-option settings-two-step">
            <span><strong>Two-step verification</strong><small>Require an OTP when changing your password.</small></span>
            <input type="checkbox" checked={twoStepEnabled} onChange={handleTwoStepChange} />
          </label>
        </section>

        <section className="admin-card settings-card">
          <div className="settings-card-heading">
            <div className="settings-icon"><i className="fa-solid fa-bell" /></div>
            <div>
              <h3 className="card-title">Notifications</h3>
              <p>Choose which administrator updates you receive.</p>
            </div>
          </div>

          <div className="notification-list">
            <label className="notification-option">
              <span><strong>Email notifications</strong><small>Receive important updates by email.</small></span>
              <input type="checkbox" checked={notifications.email} onChange={handleNotificationChange('email')} />
            </label>
            <label className="notification-option">
              <span><strong>Booking alerts</strong><small>Notify me when a booking is created or changed.</small></span>
              <input type="checkbox" checked={notifications.bookings} onChange={handleNotificationChange('bookings')} />
            </label>
            <label className="notification-option">
              <span><strong>User activity</strong><small>Notify me about new registrations and logins.</small></span>
              <input type="checkbox" checked={notifications.userActivity} onChange={handleNotificationChange('userActivity')} />
            </label>
          </div>
          {notificationMessage && <div className="form-message success">{notificationMessage}</div>}
        </section>

        <section className="admin-card settings-card sms-settings-card">
          <div className="settings-card-heading">
            <div className="settings-icon"><i className="fa-solid fa-comment-sms" /></div>
            <div>
              <h3 className="card-title">Order confirmation SMS</h3>
              <p>Generate four ready-to-use messages for your service bookings.</p>
            </div>
          </div>

          <div className="form-row sms-inputs">
            <div className="form-group">
              <label htmlFor="sms-brand">Brand name</label>
              <input id="sms-brand" className="form-control" value={smsBrand} onChange={handleSmsInputChange(setSmsBrand, 'brand')} maxLength={24} />
            </div>
            <div className="form-group">
              <label htmlFor="sms-category">Service category</label>
              <input id="sms-category" className="form-control" value={smsCategory} onChange={handleSmsInputChange(setSmsCategory, 'category')} maxLength={20} placeholder="Plumbing, electrical, garden care" />
            </div>
          </div>

          <div className="sms-template-list">
            {smsTemplates.map((template, index) => {
              const remaining = SMS_MAX_LENGTH - template.length;
              const isTooLong = remaining < 0;
              return (
                <div className="sms-template" key={SMS_VARIATION_LABELS[index]}>
                  <div className="sms-template-heading">
                    <strong>Option {index + 1}: {SMS_VARIATION_LABELS[index]}</strong>
                    <span className={isTooLong ? 'sms-count too-long' : 'sms-count'}>{template.length}/160</span>
                  </div>
                  <textarea
                    className={`form-control sms-textarea${isTooLong ? ' too-long' : ''}`}
                    value={template}
                    onChange={handleSmsTemplateChange(index)}
                    maxLength={SMS_MAX_LENGTH}
                    rows={3}
                    aria-label={`SMS option ${index + 1}`}
                  />
                  <div className="sms-template-footer">
                    <small>{isTooLong ? 'Shorten this message before using it.' : `${remaining} characters remaining`}</small>
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => copySmsTemplate(template, index)} disabled={isTooLong}>
                      <i className={`fa-solid ${copiedTemplate === index ? 'fa-check' : 'fa-copy'}`} /> {copiedTemplate === index ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="sms-placeholder-help">Placeholders: {'{First_Name}'} {'{Order_Number}'} {'{Short_URL}'}. Messages are kept under one SMS segment.</p>
        </section>
      </div>
    </AdminLayout>
  );
}
