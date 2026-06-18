// Centralized API config. Strips trailing slash defensively so concatenations
// like `${API_URL}/api/foo` never produce `//api/foo`.
const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = raw.replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function apiFetch(path, { method = 'GET', body, token, signal } = {}) {
  if (!path.startsWith('/')) path = `/${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (e) {
    throw new ApiError(
      'Cannot reach the server. It may be waking up — please retry in a moment.',
      0,
      { cause: String(e) }
    );
  }

  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
  }

  if (!res.ok) {
    throw new ApiError(
      data?.error || `Request failed (${res.status})`,
      res.status,
      data?.details
    );
  }
  return data;
}

export async function pingHealth(signal) {
  try {
    await apiFetch('/api/health', { signal });
    return true;
  } catch {
    return false;
  }
}
