import { apiFetch } from '../config/api.js';

export const authService = {
  login: (email, password) =>
    apiFetch('/api/auth/login', { method: 'POST', body: { email, password } }),
  register: (name, email, password) =>
    apiFetch('/api/auth/register', { method: 'POST', body: { name, email, password } }),
  me: (token) => apiFetch('/api/auth/me', { token }),
};
