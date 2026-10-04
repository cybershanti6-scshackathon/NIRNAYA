import { useState } from "react";
import { Filter, Layers, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useSim } from "../store/sim";
import { DOMAINS } from "../data/domains";

const colors: Record<string, string> = {
  ACTIVE: "#10b981",
  WARNING: "#f59e0b",
  DEGRADED: "#f59e0b",
  OFFLINE: "#ef4444",
};

export function MapPanel({ compact }: { compact?: boolean }) {
  const { teams, domain } = useSim();
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const visible = teams.filter((t) => (filter === "ALL" || t.name === filter) && (statusFilter === "ALL" || t.status === statusFilter));

  return (
    <div className="panel p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="font-display text-sm font-bold tracking-widest text-white">{domain ? DOMAINS[domain].assetLabel : "LIVE OPERATIONAL MAP"}</h3>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] tracking-widest text-slate-500">LIVE — TRAINING COORDINATES</span>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="btn-ghost !px-2.5 !py-1.5" onClick={() => setZoom((z) => Math.min(2, z + 0.25))}><ZoomIn size={14} /></button>
          <button className="btn-ghost !px-2.5 !py-1.5" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}><ZoomOut size={14} /></button>
          <button className="btn-ghost !px-2.5 !py-1.5" onClick={() => { setZoom(1); setFilter("ALL"); }}><RotateCcw size={14} /></button>
          <button className={`btn-ghost !px-2.5 !py-1.5 ${layers ? "text-emerald-300" : ""}`} onClick={() => setLayers(!layers)}><Layers size={14} /></button>
          <select className="input !w-auto !py-1.5 !px-2 text-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All Teams</option>
            {teams.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
          <select className="input !w-auto !py-1.5 !px-2 text-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="WARNING">Warning</option>
            <option value="OFFLINE">Offline</option>
          </select>
          <span className="text-slate-500"><Filter size={14} /></span>
        </div>
      </div>
      <div className={`overflow-hidden rounded-xl border border-white/10 bg-[#0b1124] ${compact ? "h-[380px]" : "h-[440px]"}`}>
        <svg viewBox="0 0 800 420" className="h-full w-full transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="420" fill="url(#grid)" />
          <path d="M0 210 Q 200 170 400 215 T 800 200" stroke="rgba(56,189,248,0.12)" strokeWidth="10" fill="none" />
          <path d="M120 0 Q 150 220 110 420" stroke="rgba(148,163,184,0.10)" strokeWidth="4" fill="none" strokeDasharray="8 6" />
          {visible.map((t) => (
            <g key={t.id}>
              {layers && t.trail.length > 1 && (
                <polyline points={t.trail.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={colors[t.status]} strokeOpacity="0.4" strokeWidth="2" strokeDasharray="4 4" />
              )}
              <circle cx={t.x} cy={t.y} r="14" fill={colors[t.status]} opacity="0.15">
                <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={t.x} cy={t.y} r="6" fill={colors[t.status]} stroke="#0b1124" strokeWidth="2" />
              {layers && (
                <text x={t.x + 12} y={t.y - 10} fill="#e2e8f0" fontSize="11" fontWeight="700">{t.name}</text>
              )}
              {layers && (
                <text x={t.x + 12} y={t.y + 4} fill="#8b98b8" fontSize="9">{t.sector} • {t.communication}</text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-400">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> ACTIVE</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> WARNING</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> CRITICAL</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-500" /> OFFLINE</span>
        <span className="mx-1 text-slate-600">|</span>
        {teams.map((t) => (
          <span key={t.id} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: colors[t.status] }} /> {t.name} — {t.communication}
          </span>
        ))}
      </div>
    </div>
  );
}
