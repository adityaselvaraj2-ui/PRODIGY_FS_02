import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success('Access granted');
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Sign in" subtitle="Authenticate to access the dashboard">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Labeled label="Email">
          <input type="email" required className="input-arc" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Labeled>
        <Labeled label="Password">
          <input type="password" required className="input-arc" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Labeled>
        <button disabled={busy} className="btn-arc w-full">{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="text-center text-xs text-slate-400">
          New operator?{' '}
          <Link to="/register" className="text-arc-400 hover:text-arc-300 underline-offset-4 hover:underline">Register</Link>
        </p>
      </form>
    </AuthShell>
  );
}

function Labeled({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid place-items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-arc [background-size:48px_48px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-arc pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-[10px] uppercase tracking-[0.5em] text-arc-400">Employee Management System</p>
          <h1 className="font-display text-3xl mt-2 text-slate-100">{title}</h1>
          <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="glass-panel-strong scan-line relative p-6">{children}</div>
      </div>
    </div>
  );
}
