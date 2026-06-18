import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import Loader from '../components/Loader.jsx';
import EmployeeCard from '../components/EmployeeCard.jsx';
import EmployeeModal from '../components/EmployeeModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { employeeService } from '../services/employeeService.js';
import { pingHealth } from '../config/api.js';

export default function Dashboard() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverWaking, setServerWaking] = useState(false);
  const [q, setQ] = useState('');
  const [department, setDepartment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Cold-start nudge: if /health doesn't reply quickly, show a "waking" notice.
  useEffect(() => {
    const ctrl = new AbortController();
    const wakeTimer = setTimeout(() => setServerWaking(true), 1500);
    pingHealth(ctrl.signal).finally(() => {
      clearTimeout(wakeTimer);
      setServerWaking(false);
    });
    return () => { clearTimeout(wakeTimer); ctrl.abort(); };
  }, []);

  async function reload(filters = { q, department }) {
    setLoading(true);
    try {
      const res = await employeeService.list(token, filters);
      setEmployees(res.employees);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload({ q: '', department: '' }); /* eslint-disable-next-line */ }, []);

  // debounce search/filter
  useEffect(() => {
    const t = setTimeout(() => reload({ q, department }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [q, department]);

  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(set).sort();
  }, [employees]);

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      if (editing) {
        await employeeService.update(token, editing.id, payload);
        toast.success('Employee record updated');
      } else {
        await employeeService.create(token, payload);
        toast.success('Employee registered');
      }
      setModalOpen(false);
      setEditing(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(emp) {
    if (!confirm(`Delete ${emp.first_name} ${emp.last_name}?`)) return;
    try {
      await employeeService.remove(token, emp.id);
      toast.success('Record deleted');
      setEmployees((list) => list.filter((e) => e.id !== emp.id));
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {serverWaking && (
          <div className="glass-panel border-arc-500/40 px-4 py-3 text-sm text-arc-300 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-arc-400 animate-pulseGlow" />
            Awaiting server uplink — the remote node may be waking from dormant cycle…
          </div>
        )}

        <section className="glass-panel p-5 flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.4em] text-arc-400">Employee Directory</p>
            <h1 className="font-display text-2xl sm:text-3xl mt-1">Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">{employees.length} active record{employees.length === 1 ? '' : 's'}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
            <input
              type="search" placeholder="Search by name, email, position…"
              className="input-arc sm:w-72" value={q} onChange={(e) => setQ(e.target.value)}
            />
            <select className="input-arc sm:w-56" value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">All departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-arc whitespace-nowrap">
              + New Employee
            </button>
          </div>
        </section>

        {loading ? (
          <Loader label="Pulling roster" />
        ) : employees.length === 0 ? (
          <EmptyState onCreate={() => { setEditing(null); setModalOpen(true); }} hasFilters={Boolean(q || department)} />
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onEdit={(e) => { setEditing(e); setModalOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}
      </main>

      <EmployeeModal
        open={modalOpen}
        initial={editing}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}

function EmptyState({ onCreate, hasFilters }) {
  return (
    <div className="glass-panel p-12 text-center">
      <div className="mx-auto h-16 w-16 rounded-full border-2 border-arc-500/30 grid place-items-center mb-4">
        <span className="font-display text-arc-400 text-2xl">∅</span>
      </div>
      <h3 className="font-display text-lg">No records found</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
        {hasFilters
          ? 'No employees match the current filters. Clear them or add a new employee.'
          : 'The directory is empty. Add your first employee to populate the list.'}
      </p>
      <button onClick={onCreate} className="btn-arc mt-6">+ Register Employee</button>
    </div>
  );
}
