import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', accountType: 'customer' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!form.email || !form.password) {
      setMsg({ type: 'error', text: 'Email and password are required.' });
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.login({ email: form.email, password: form.password });
      if (form.accountType !== data.role) {
        const roleNames = { admin: 'Administrator', provider: 'Service Provider', customer: 'Customer' };
        throw new Error(`This account is not registered as ${roleNames[form.accountType]}.`);
      }
      login(data);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Invalid email or password.' });
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
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {msg && <div className={`form-message ${msg.type}`}>{msg.text}</div>}

            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-account-type">Account type</label>
              <select
                id="login-account-type"
                className="form-control"
                value={form.accountType}
                onChange={set('accountType')}
              >
                <option value="customer">Customer</option>
                <option value="provider">Service Provider</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={set('password')}
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Register here</Link>
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
