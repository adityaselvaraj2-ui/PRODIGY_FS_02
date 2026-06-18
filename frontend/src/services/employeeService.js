import { apiFetch } from '../config/api.js';

export const employeeService = {
  list: (token, { q, department } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (department) params.set('department', department);
    const qs = params.toString();
    return apiFetch(`/api/employees${qs ? `?${qs}` : ''}`, { token });
  },
  create: (token, payload) =>
    apiFetch('/api/employees', { method: 'POST', token, body: payload }),
  update: (token, id, payload) =>
    apiFetch(`/api/employees/${id}`, { method: 'PUT', token, body: payload }),
  remove: (token, id) =>
    apiFetch(`/api/employees/${id}`, { method: 'DELETE', token }),
};
