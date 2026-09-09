import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../utils/api';
import { STATE_CITIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({ service, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    phone: '',
    serviceName: service?.name || '',
    serviceCategory: service?.category || 'HOME',
    state: '',
    city: '',
    doorNo: '',
    street: '',
    pincode: '',
    landmark: '',
    bookingDate: '',
    notes: '',
  });

  const [cities, setCities] = useState([]);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCities(STATE_CITIES[form.state] || []);
    setForm((f) => ({ ...f, city: '' }));
  }, [form.state]);

  // Update service fields if prop changes
  useEffect(() => {
    if (service) {
      setForm((f) => ({
        ...f,
        serviceName: service.name,
        serviceCategory: service.category || 'HOME',
      }));
    }
  }, [service]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const required = ['customerName', 'customerEmail', 'phone', 'state', 'city', 'doorNo', 'street', 'pincode', 'landmark', 'bookingDate'];
    for (const k of required) {
      if (!form[k]) {
        setMsg({ type: 'error', text: 'Please fill in all required fields.' });
        return;
      }
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setMsg({ type: 'error', text: 'Pincode must be exactly 6 digits.' });
      return;
    }

    setLoading(true);
    try {
      const booking = await bookingsAPI.create({
        customer_name: form.customerName,
        customer_email: form.customerEmail.toLowerCase(),
        service_name: form.serviceName,
        service_category: form.serviceCategory,
        provider_name: 'Local Service Team',
        city: form.city,
        state: form.state,
        phone: form.phone,
        door_no: form.doorNo,
        street: form.street,
        pincode: form.pincode,
        landmark: form.landmark,
        booking_date: form.bookingDate,
        notes: form.notes,
        status: 'PENDING',
      });
      const smsMessage = booking?.sms?.sent
        ? ' SMS confirmation sent.'
        : booking?.sms?.configured
          ? ' Booking saved, but SMS delivery failed.'
          : ' Booking saved. SMS notifications are not configured yet.';
      setMsg({ type: 'success', text: `Booking confirmed for ${form.serviceName} on ${form.bookingDate}!${smsMessage}` });
      setTimeout(() => {
        onClose();
        navigate('/my-bookings');
      }, 1800);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Booking could not be created. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Book Service</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          {msg && <div className={`form-message ${msg.type}`}>{msg.text}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Service *</label>
              <input value={form.serviceName} readOnly className="form-control readonly" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input value={form.serviceCategory} readOnly className="form-control readonly" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="b-name">Full Name *</label>
              <input id="b-name" className="form-control" value={form.customerName} onChange={set('customerName')} required />
            </div>
            <div className="form-group">
              <label htmlFor="b-email">Email *</label>
              <input id="b-email" type="email" className="form-control" value={form.customerEmail} onChange={set('customerEmail')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="b-phone">Phone *</label>
              <input id="b-phone" type="tel" className="form-control" value={form.phone} onChange={set('phone')} required />
            </div>
            <div className="form-group">
              <label htmlFor="b-date">Preferred Date *</label>
              <input id="b-date" type="date" className="form-control" value={form.bookingDate} onChange={set('bookingDate')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="b-state">State *</label>
              <select id="b-state" className="form-control" value={form.state} onChange={set('state')} required>
                <option value="">Select state</option>
                {Object.keys(STATE_CITIES).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="b-city">City *</label>
              <select id="b-city" className="form-control" value={form.city} onChange={set('city')} required disabled={!form.state}>
                <option value="">Select city</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="b-door">Door / Flat No. *</label>
              <input id="b-door" className="form-control" value={form.doorNo} onChange={set('doorNo')} required />
            </div>
            <div className="form-group">
              <label htmlFor="b-pincode">Pincode *</label>
              <input id="b-pincode" className="form-control" value={form.pincode} onChange={set('pincode')} maxLength={6} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="b-street">Street / Area *</label>
            <input id="b-street" className="form-control" value={form.street} onChange={set('street')} required />
          </div>

          <div className="form-group">
            <label htmlFor="b-landmark">Landmark *</label>
            <input id="b-landmark" className="form-control" value={form.landmark} onChange={set('landmark')} required />
          </div>

          <div className="form-group">
            <label htmlFor="b-notes">Notes (optional)</label>
            <textarea id="b-notes" className="form-control" rows={2} value={form.notes} onChange={set('notes')} />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Processing…' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
