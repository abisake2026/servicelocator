import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { authAPI } from '../../utils/api';

const ROLE_OPTIONS = ['admin', 'customer', 'provider'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pwModal, setPwModal] = useState(null); // { userId, name }
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setUsers((await authAPI.getUsers()) || []); }
    catch { setUsers([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await authAPI.updateRole(userId, newRole);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) { alert(err.message || 'Failed to update role.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await authAPI.deleteUser(id);
      setUsers((u) => u.filter((x) => x.id !== id));
    } catch (err) { alert(err.message || 'Failed to delete user.'); }
  };

  const openPwModal = (user) => { setPwModal({ userId: user.id, name: user.name }); setNewPw(''); setPwMsg(null); };
  const closePwModal = () => { setPwModal(null); };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPw || newPw.length < 6) { setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
    setSaving(true); setPwMsg(null);
    try {
      await authAPI.updatePassword(pwModal.userId, newPw);
      setPwMsg({ type: 'success', text: 'Password updated successfully.' });
      setTimeout(closePwModal, 1000);
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally { setSaving(false); }
  };

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    return `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Users</h2>
        <span className="count-badge">{users.length} total</span>
      </div>

      <div className="admin-filters">
        <input
          type="text"
          className="form-control admin-search"
          placeholder="Search by name, email or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state"><i className="fa-solid fa-spinner fa-spin" /><p>Loading…</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><i className="fa-solid fa-users-slash" /><h4>No users found</h4></div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Logins</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-name-cell">
                      <i className="fa-solid fa-circle-user" />
                      {u.name}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="form-control role-select"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>{u.login_count ?? 0}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <button className="btn-icon" onClick={() => openPwModal(u)} title="Reset password"><i className="fa-solid fa-key" /></button>
                    <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(u.id)} title="Delete user"><i className="fa-solid fa-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pwModal && (
        <div className="modal-backdrop" onClick={closePwModal}>
          <div className="modal-box modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="modal-close" onClick={closePwModal}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form className="modal-body" onSubmit={handlePasswordReset}>
              <p>Set new password for <strong>{pwModal.name}</strong></p>
              {pwMsg && <div className={`form-message ${pwMsg.type}`}>{pwMsg.text}</div>}
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                {saving ? 'Saving…' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
