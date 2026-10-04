import type { ReactNode } from "react";

export const statusColor: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  CONNECTED: "bg-emerald-500",
  STABLE: "bg-emerald-500",
  WARNING: "bg-amber-400",
  DEGRADED: "bg-amber-400",
  OFFLINE: "bg-red-500",
  RESTING: "bg-sky-400",
  High: "bg-red-500",
  Medium: "bg-amber-400",
  Low: "bg-emerald-500",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold tracking-widest">
      <span className={`status-dot ${statusColor[status] ?? "bg-slate-400"} ${status === "WARNING" || status === "DEGRADED" ? "pulse-amber" : status === "ACTIVE" || status === "CONNECTED" || status === "STABLE" ? "pulse-green" : status === "OFFLINE" || status === "High" ? "pulse-red" : ""}`} />
      {status}
    </span>
  );
}

export function ProgressBar({ value, tone }: { value: number; tone?: string }) {
  const color = tone ?? (value > 66 ? "bg-emerald-500" : value > 33 ? "bg-amber-400" : "bg-red-500");
  return (
    <div className="progress-track">
      <div className={`progress-fill ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function StatCard({ label, value, sub, icon }: { label: string; value: ReactNode; sub?: string; icon?: ReactNode }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <p className="kicker">{label}</p>
        {icon && <span className="text-[#9aa7c7]">{icon}</span>}
      </div>
      <p className="mt-1 text-2xl font-bold text-white font-display">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, width }: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`panel w-full ${width ?? "max-w-lg"} p-6 animate-fade-in-up`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-display">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
