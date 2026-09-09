import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Footer from '../components/Footer';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((current) => ({ ...current, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!form.email || !form.password) {
      setMsg({ type: 'error', text: 'Email and password are required.' });
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.login(form);
      if (data.role !== 'admin') {
        throw new Error('This account does not have administrator access.');
      }
      login(data);
      navigate('/admin');
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Invalid administrator credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <i className="fa-solid fa-shield-halved auth-logo" />
            <h2>Administrator sign in</h2>
            <p>Access the Local Services Connect dashboard</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {msg && <div className={`form-message ${msg.type}`}>{msg.text}</div>}

            <div className="form-group">
              <label htmlFor="admin-login-email">Email address</label>
              <input
                id="admin-login-email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={set('email')}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-login-password">Password</label>
              <input
                id="admin-login-password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={set('password')}
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Signing in…</> : 'Sign In as Admin'}
            </button>
          </form>

          <p className="auth-footer-text">
            <Link to="/login">Back to customer sign in</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
