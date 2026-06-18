const fmtMoney = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n) || 0);

export default function EmployeeCard({ employee, onEdit, onDelete }) {
  const initials = `${employee.first_name[0] || ''}${employee.last_name[0] || ''}`.toUpperCase();
  return (
    <article className="glass-panel relative p-5 hover:border-arc-500/40 hover:shadow-glow transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-md bg-gradient-to-br from-arc-600 to-abyss-700 grid place-items-center font-display text-arc-300 text-lg border border-arc-500/30">
          {initials || '??'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base text-slate-100 truncate">
            {employee.first_name} {employee.last_name}
          </h3>
          <p className="text-xs text-slate-400 truncate">{employee.position}</p>
        </div>
        <span className="chip">{employee.department}</span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Field label="Email" value={employee.email} className="col-span-2 truncate" />
        <Field label="Phone" value={employee.phone || '—'} />
        <Field label="Hired" value={employee.hire_date} />
        <Field label="Salary" value={fmtMoney(employee.salary)} className="col-span-2 text-arc-300 font-semibold" />
      </dl>

      <div className="mt-5 flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(employee)} className="btn-ghost flex-1 !py-1.5 text-xs">Edit</button>
        <button onClick={() => onDelete(employee)} className="btn-danger !py-1.5 text-xs">Purge</button>
      </div>
    </article>
  );
}

function Field({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="uppercase tracking-widest text-[10px] text-slate-500">{label}</dt>
      <dd className="text-slate-200 truncate">{value}</dd>
    </div>
  );
}
