import { useEffect, useState } from 'react';

const EMPTY = {
  first_name: '', last_name: '', email: '', phone: '',
  department: '', position: '', salary: '', hire_date: '',
};

export default function EmployeeModal({ open, initial, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      initial
        ? { ...EMPTY, ...initial, phone: initial.phone ?? '' }
        : EMPTY
    );
  }, [open, initial]);

  if (!open) return null;

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function validate() {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.last_name.trim()) e.last_name = 'Required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.department.trim()) e.department = 'Required';
    if (!form.position.trim()) e.position = 'Required';
    if (form.salary === '' || Number(form.salary) < 0) e.salary = 'Must be ≥ 0';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.hire_date)) e.hire_date = 'YYYY-MM-DD';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, salary: Number(form.salary) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abyss-950/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="glass-panel-strong relative w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-arc-400">
              {initial ? 'Modify hunter' : 'Register hunter'}
            </p>
            <h2 className="font-display text-2xl mt-1">
              {initial ? `${initial.first_name} ${initial.last_name}` : 'New Recruit'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-arc-300 text-2xl leading-none" aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name" error={errors.first_name}>
            <input className="input-arc" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
          </Field>
          <Field label="Last name" error={errors.last_name}>
            <input className="input-arc" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
          </Field>
          <Field label="Email" error={errors.email} full>
            <input type="email" className="input-arc" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className="input-arc" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </Field>
          <Field label="Department" error={errors.department}>
            <input className="input-arc" value={form.department} onChange={(e) => update('department', e.target.value)} placeholder="Engineering" />
          </Field>
          <Field label="Position" error={errors.position} full>
            <input className="input-arc" value={form.position} onChange={(e) => update('position', e.target.value)} />
          </Field>
          <Field label="Salary (USD)" error={errors.salary}>
            <input type="number" min="0" step="100" className="input-arc" value={form.salary} onChange={(e) => update('salary', e.target.value)} />
          </Field>
          <Field label="Hire date" error={errors.hire_date}>
            <input type="date" className="input-arc" value={form.hire_date} onChange={(e) => update('hire_date', e.target.value)} />
          </Field>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-arc">
              {submitting ? 'Saving…' : initial ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, full, children }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-1.5">{label}</span>
      {children}
      {error && <span className="block mt-1 text-xs text-rose-400">{error}</span>}
    </label>
  );
}
