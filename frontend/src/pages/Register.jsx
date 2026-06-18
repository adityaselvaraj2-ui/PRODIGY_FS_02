import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { AuthShell } from './Login.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Register" subtitle="Create your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name">
          <input required className="input-arc" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Email">
          <input type="email" required className="input-arc" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Password (min 8)">
          <input type="password" required minLength={8} className="input-arc" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <button disabled={busy} className="btn-arc w-full">{busy ? 'Creating…' : 'Create account'}</button>
        <p className="text-center text-xs text-slate-400">
          Already enrolled?{' '}
          <Link to="/login" className="text-arc-400 hover:text-arc-300 underline-offset-4 hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
