import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'customer' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!form.name || !form.email || !form.password || !form.role) {
      setMsg({ type: 'error', text: 'All fields are required.' });
      return;
    }
    if (form.password !== form.confirm) {
      setMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (form.password.length < 6) {
      setMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      login(data);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Unable to create your account right now.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <i className="fa-solid fa-location-dot auth-logo" />
            <h2>Create an account</h2>
            <p>Join thousands of customers and service providers</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {msg && <div className={`form-message ${msg.type}`}>{msg.text}</div>}

            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input id="reg-name" className="form-control" value={form.name} onChange={set('name')} required />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email address</label>
              <input id="reg-email" type="email" className="form-control" value={form.email} onChange={set('email')} autoComplete="email" required />
            </div>

            <div className="form-group">
              <label htmlFor="reg-role">I am a</label>
              <select id="reg-role" className="form-control" value={form.role} onChange={set('role')}>
                <option value="customer">Customer</option>
                <option value="provider">Service Provider</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" className="form-control" value={form.password} onChange={set('password')} autoComplete="new-password" required />
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <input id="reg-confirm" type="password" className="form-control" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" required />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          <Link to="/admin/login" className="btn btn-outline btn-block auth-admin-link">
            <i className="fa-solid fa-shield-halved" /> Sign in as Administrator
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
