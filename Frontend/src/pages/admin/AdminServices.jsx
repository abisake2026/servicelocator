import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { servicesAPI } from '../../utils/api';
import { CATEGORY_LABELS } from '../../utils/constants';

const CATEGORIES = ['HOME', 'REPAIR', 'CLEANING', 'BEAUTY', 'OTHER'];

const EMPTY_FORM = { name: '', category: 'HOME', city: '', description: '', icon: 'fa-tools', price: '', rating: '' };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // service object or null
  const [form, setForm] = useState(EMPTY_FORM);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setServices((await servicesAPI.getAll()) || []); }
    catch { setServices([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setMsg(null); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, city: s.city, description: s.description, icon: s.icon || 'fa-tools', price: s.price, rating: s.rating });
    setMsg(null);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.description) {
      setMsg({ type: 'error', text: 'Name, city and description are required.' });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const payload = { ...form, price: parseFloat(form.price) || 0, rating: parseFloat(form.rating) || 0 };
      if (editing) { await servicesAPI.update(editing.id, payload); }
      else { await servicesAPI.create(payload); }
      setMsg({ type: 'success', text: `Service ${editing ? 'updated' : 'created'} successfully.` });
      await load();
      setTimeout(closeModal, 900);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to save service.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      setServices((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Services</h2>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          <i className="fa-solid fa-plus" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="loading-state"><i className="fa-solid fa-spinner fa-spin" /><p>Loading…</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Category</th><th>City</th><th>Price (₹)</th><th>Rating</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td><span className="badge-soft">{CATEGORY_LABELS[s.category] || s.category}</span></td>
                  <td>{s.city}</td>
                  <td>₹{s.price}</td>
                  <td><i className="fa-solid fa-star text-yellow" /> {s.rating}</td>
                  <td>
                    <button className="btn-icon" onClick={() => openEdit(s)} title="Edit"><i className="fa-solid fa-pen" /></button>
                    <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(s.id)} title="Delete"><i className="fa-solid fa-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Service' : 'Add Service'}</h3>
              <button className="modal-close" onClick={closeModal}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form className="modal-body" onSubmit={handleSave}>
              {msg && <div className={`form-message ${msg.type}`}>{msg.text}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input className="form-control" value={form.name} onChange={set('name')} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select className="form-control" value={form.category} onChange={set('category')}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input className="form-control" value={form.city} onChange={set('city')} required />
                </div>
                <div className="form-group">
                  <label>Icon (Font Awesome class)</label>
                  <input className="form-control" value={form.icon} onChange={set('icon')} placeholder="fa-tools" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" className="form-control" value={form.price} onChange={set('price')} min="0" step="0.01" />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input type="number" className="form-control" value={form.rating} onChange={set('rating')} min="0" max="5" step="0.1" />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={set('description')} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                {saving ? 'Saving…' : (editing ? 'Update Service' : 'Add Service')}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
