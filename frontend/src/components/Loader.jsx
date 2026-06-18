export default function Loader({ label = 'Synchronizing system' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-arc-500/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-arc-500 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-arc-500/10 animate-pulseGlow" />
      </div>
      <p className="font-display text-arc-400 uppercase tracking-[0.3em] text-xs">{label}</p>
    </div>
  );
}
