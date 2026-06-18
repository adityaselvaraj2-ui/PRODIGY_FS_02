import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { admin, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-abyss-950/70 border-b border-arc-500/15">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-md bg-gradient-to-br from-arc-500 to-arc-700 shadow-glow grid place-items-center">
            <span className="font-display font-black text-abyss-950">P</span>
            <span className="absolute -inset-0.5 rounded-md border border-arc-500/50 animate-pulseGlow pointer-events-none" />
          </div>
          <div>
            <p className="font-display text-lg tracking-[0.05em] text-arc-300">Employee Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {admin && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm text-slate-200">{admin.name}</span>
              <span className="text-[10px] uppercase tracking-widest text-arc-400">{admin.email}</span>
            </div>
          )}
          <button onClick={logout} className="btn-ghost">Sign out</button>
        </div>
      </div>
    </header>
  );
}
