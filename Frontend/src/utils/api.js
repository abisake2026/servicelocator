/**
 * Centralised API client.
 * All fetch calls go through here so the base URL is defined in one place.
 */

const BASE = '/api';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  // 204 No Content
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || `Request failed with status ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getUsers: () => request('/auth/users'),
  getActivity: () => request('/auth/activity'),
  updatePassword: (id, password) =>
    request(`/auth/users/${id}/password`, { method: 'PUT', body: JSON.stringify({ password }) }),
  updateRole: (id, role) =>
    request(`/auth/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id) => request(`/auth/users/${id}`, { method: 'DELETE' }),
};

// ── Services ──────────────────────────────────────────────────────────────
export const servicesAPI = {
  getAll: () => request('/services'),
  search: (params) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/services/search${qs ? '?' + qs : ''}`);
  },
  getById: (id) => request(`/services/${id}`),
  create: (body) => request('/services', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/services/${id}`, { method: 'DELETE' }),
};

// ── Providers ─────────────────────────────────────────────────────────────
export const providersAPI = {
  getAll: () => request('/providers'),
  search: (params) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/providers/search${qs ? '?' + qs : ''}`);
  },
  getById: (id) => request(`/providers/${id}`),
  create: (body) => request('/providers', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/providers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/providers/${id}`, { method: 'DELETE' }),
};

// ── Bookings ──────────────────────────────────────────────────────────────
export const bookingsAPI = {
  getAll: () => request('/bookings'),
  getByEmail: (email) => request(`/bookings/by-email/${encodeURIComponent(email)}`),
  create: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  updateStatus: (id, bookingStatus) =>
    request(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify({ status: bookingStatus }) }),
  delete: (id) => request(`/bookings/${id}`, { method: 'DELETE' }),
};
