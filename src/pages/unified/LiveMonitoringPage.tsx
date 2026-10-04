import { useState } from "react";
import { useParams } from "react-router-dom";
import { Radar, Clock, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { useSim } from "../../store/sim";
import { DOMAINS, type Domain } from "../../data/domains";
import { MapPanel } from "../../components/MapPanel";
import { StatusBadge, ProgressBar } from "../../components/ui/common";

export function LiveMonitoringPage() {
  const { domain } = useParams();
  const {
    teams,
    events,
    scenario,
    simTime,
    escalations,
    domain: storeDomain,
  } = useSim();

  const currentDomain = (domain?.toUpperCase() as Domain) || storeDomain || "LAND";
  const def = DOMAINS[currentDomain] || DOMAINS.LAND;

  const [filterTone, setFilterTone] = useState<string>("ALL");

  const filteredEvents = events.filter((e) => {
    if (filterTone === "ALL") return true;
    return e.tone === filterTone;
  });

  const highThreatCount = teams.filter((t) => t.threat === "High").length;
  const overallThreat = highThreatCount > 1 ? "HIGH" : highThreatCount === 1 ? "ELEVATED" : "GUARDED";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="panel p-5 bg-black/40 border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker text-[#b7c79a]">LIVE OPERATIONAL MONITORING • {def.title}</p>
          <h1 className="text-xl font-black text-white font-display mt-0.5 tracking-wide">
            {scenario}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Real-time telemetry feeds, tactical coordinates tracking, communications integrity, and progressive event dispatches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs">
            <Clock size={15} className="text-emerald-400" />
            <span className="font-mono text-emerald-300 font-bold">
              {simTime instanceof Date ? simTime.toTimeString().slice(0, 8) : "--:--:--"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs">
            <Activity size={15} className={overallThreat === "HIGH" ? "text-red-400" : "text-amber-400"} />
            <span className="font-bold text-slate-300">THREAT: </span>
            <span className={`font-mono font-bold ${overallThreat === "HIGH" ? "text-red-400" : overallThreat === "ELEVATED" ? "text-amber-300" : "text-emerald-300"}`}>
              {overallThreat}
            </span>
          </div>

          {escalations > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300 font-bold">
              <AlertTriangle size={14} /> {escalations} ESCALATION(S)
            </div>
          )}
        </div>
      </div>

      {/* Tactical Map */}
      <MapPanel />

      {/* Unit Status Overview Grid */}
      <div>
        <h2 className="font-display text-sm font-bold tracking-widest text-white mb-3">
          SECTOR UNIT TELEMETRY &amp; READINESS
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((t) => (
            <div key={t.id} className="panel p-4 bg-black/40 border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs tracking-wider">{t.name}</span>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-[11px] text-slate-400">{t.sector} • Lead: {t.leader}</p>
              <p className="text-xs text-slate-300 italic line-clamp-2">“{t.situation}”</p>

              <div className="pt-1">
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Resources</span>
                  <span className="font-mono text-emerald-300">{t.resource}%</span>
                </div>
                <ProgressBar value={t.resource} />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                <span className="text-slate-400">Comms:</span>
                <span className={`font-semibold ${t.communication === "DEGRADED" ? "text-amber-300" : t.communication === "OFFLINE" ? "text-red-400" : "text-emerald-300"}`}>
                  {t.communication} ({t.signal}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progressive Live Event Stream */}
      <div className="panel p-5 bg-black/40 border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Radar size={16} className="text-emerald-400" />
            <h2 className="font-display text-sm font-bold tracking-widest text-white">
              PROGRESSIVE OPERATIONAL EVENT STREAM
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter:</span>
            <select
              className="input !w-auto text-xs py-1 px-2"
              value={filterTone}
              onChange={(e) => setFilterTone(e.target.value)}
              aria-label="Filter events by tone"
            >
              <option value="ALL">All Events</option>
              <option value="alert">Alerts Only</option>
              <option value="warn">Warnings Only</option>
              <option value="info">Info / Comms</option>
              <option value="ok">Resolved / OK</option>
            </select>
            <span className="text-xs font-mono text-slate-400">({filteredEvents.length})</span>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredEvents.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No matching events logged.</p>
          ) : (
            filteredEvents.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-3 p-2.5 rounded-lg border border-white/5 bg-white/[0.015] hover:bg-white/5 transition text-xs animate-fade-in-up"
              >
                <span className="font-mono text-emerald-400 font-semibold w-16 shrink-0 pt-0.5">
                  {e.time}
                </span>

                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                    e.tone === "alert"
                      ? "bg-red-500 shadow-sm shadow-red-500/50"
                      : e.tone === "warn"
                      ? "bg-amber-400"
                      : e.tone === "ok"
                      ? "bg-emerald-500"
                      : "bg-sky-400"
                  }`}
                />

                <p className="text-slate-200 leading-relaxed flex-1">
                  {e.message}
                </p>

                <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-white/5 shrink-0">
                  {e.tone}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-emerald-400" /> Event dispatch stream updates automatically with simulation clock
          </span>
          <span>Logged {events.length} event(s) total</span>
        </div>
      </div>
    </div>
  );
}
