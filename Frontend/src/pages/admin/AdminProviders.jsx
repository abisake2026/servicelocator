import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { providersAPI } from '../../utils/api';

const EMPTY_FORM = { name: '', location: '', specialty: '', phone: '', email: '', rating: '', jobs_completed: '', experience_years: '', verified: false };

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setProviders((await providersAPI.getAll()) || []); }
    catch { setProviders([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setMsg(null); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, location: p.location, specialty: p.specialty, phone: p.phone || '', email: p.email, rating: p.rating, jobs_completed: p.jobs_completed, experience_years: p.experience_years, verified: p.verified });
    setMsg(null);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.specialty || !form.email) {
      setMsg({ type: 'error', text: 'Name, location, specialty and email are required.' });
      return;
    }
    setSaving(true); setMsg(null);
    try {
      const payload = { ...form, rating: parseFloat(form.rating) || 0, jobs_completed: parseInt(form.jobs_completed) || 0, experience_years: parseInt(form.experience_years) || 0 };
      if (editing) { await providersAPI.update(editing.id, payload); }
      else { await providersAPI.create(payload); }
      setMsg({ type: 'success', text: `Provider ${editing ? 'updated' : 'added'} successfully.` });
      await load();
      setTimeout(closeModal, 900);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to save provider.' });
    } finally { setSaving(false); }
  };

  const toggleVerified = async (p) => {
    try {
      await providersAPI.update(p.id, { verified: !p.verified });
      setProviders((prev) => prev.map((x) => x.id === p.id ? { ...x, verified: !x.verified } : x));
    } catch (err) { alert(err.message || 'Failed to update.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this provider?')) return;
    try {
      await providersAPI.delete(id);
      setProviders((p) => p.filter((x) => x.id !== id));
    } catch (err) { alert(err.message || 'Failed to delete.'); }
  };

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Providers</h2>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="fa-solid fa-plus" /> Add Provider</button>
      </div>

      {loading ? (
        <div className="loading-state"><i className="fa-solid fa-spinner fa-spin" /><p>Loading…</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Specialty</th><th>Location</th><th>Rating</th><th>Verified</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><span className="badge-soft">{p.specialty}</span></td>
                  <td>{p.location}</td>
                  <td><i className="fa-solid fa-star text-yellow" /> {p.rating}</td>
                  <td>
                    <button
                      className={`toggle-btn${p.verified ? ' active' : ''}`}
                      onClick={() => toggleVerified(p)}
                      title={p.verified ? 'Unverify' : 'Verify'}
                    >
                      <i className={`fa-solid ${p.verified ? 'fa-circle-check' : 'fa-circle-xmark'}`} />
                      {p.verified ? ' Verified' : ' Unverified'}
                    </button>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => openEdit(p)} title="Edit"><i className="fa-solid fa-pen" /></button>
                    <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(p.id)} title="Delete"><i className="fa-solid fa-trash" /></button>
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
              <h3>{editing ? 'Edit Provider' : 'Add Provider'}</h3>
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
                  <label>Specialty *</label>
                  <input className="form-control" value={form.specialty} onChange={set('specialty')} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <input className="form-control" value={form.location} onChange={set('location')} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" className="form-control" value={form.email} onChange={set('email')} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" value={form.phone} onChange={set('phone')} />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input type="number" className="form-control" value={form.experience_years} onChange={set('experience_years')} min="0" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rating</label>
                  <input type="number" className="form-control" value={form.rating} onChange={set('rating')} min="0" max="5" step="0.1" />
                </div>
                <div className="form-group">
                  <label>Jobs Completed</label>
                  <input type="number" className="form-control" value={form.jobs_completed} onChange={set('jobs_completed')} min="0" />
                </div>
              </div>
              <div className="form-group form-check">
                <input type="checkbox" id="p-verified" checked={form.verified} onChange={set('verified')} />
                <label htmlFor="p-verified">Verified Provider</label>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                {saving ? 'Saving…' : (editing ? 'Update Provider' : 'Add Provider')}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
