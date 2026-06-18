import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'prodigy_fs_02_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) { setAdmin(null); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    authService.me(token)
      .then((res) => { if (!cancelled) setAdmin(res.admin); })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setAdmin(null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  const value = useMemo(() => ({
    token,
    admin,
    loading,
    isAuthenticated: Boolean(token && admin),
    async login(email, password) {
      const res = await authService.login(email, password);
      localStorage.setItem(STORAGE_KEY, res.token);
      setToken(res.token);
      setAdmin(res.admin);
      return res.admin;
    },
    async register(name, email, password) {
      const res = await authService.register(name, email, password);
      localStorage.setItem(STORAGE_KEY, res.token);
      setToken(res.token);
      setAdmin(res.admin);
      return res.admin;
    },
    logout() {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setAdmin(null);
    },
  }), [token, admin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
