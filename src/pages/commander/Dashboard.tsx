import { useState } from "react";
import { Mic } from "lucide-react";
import { useSim } from "../../store/sim";
import { DOMAINS } from "../../data/domains";
import { StatusBadge, ProgressBar } from "../../components/ui/common";
import { MapPanel } from "../../components/MapPanel";
import { TimelinePanel } from "../../components/TimelinePanel";
import { AudioCommandModal } from "../../components/AudioCommandModal";

export function Dashboard() {
  const { teams, commIssues, reportsSubmitted, decisionsTaken, domain, reports, scenario } = useSim();
  const [audio, setAudio] = useState(false);
  const def = domain ? DOMAINS[domain] : null;
  const pending = reports.filter((r) => !r.acknowledged).length;
  const labels = def?.resourceLabels ?? ["Personnel", "Medical", "Water", "Comms", "Transport"];

  return (
    <div className="space-y-6">
      {def && (
        <div className="panel p-4">
          <p className="kicker text-[#b7c79a]">OPERATIONAL PICTURE — {def.title}</p>
          <p className="mt-1 text-sm text-slate-300">{def.description}</p>
          <p className="mt-2 text-xs text-muted">Active Scenario: <span className="text-white font-semibold">{scenario}</span></p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="panel p-4"><p className="kicker">TOTAL UNITS</p><p className="text-3xl font-bold text-white font-display">{teams.length}</p></div>
        <div className="panel p-4"><p className="kicker">ACTIVE</p><p className="text-3xl font-bold text-emerald-400 font-display">{teams.filter((t) => t.status === "ACTIVE").length}</p></div>
        <div className="panel p-4"><p className="kicker">WARNING</p><p className="text-3xl font-bold text-amber-400 font-display">{teams.filter((t) => t.status === "WARNING").length}</p></div>
        <div className="panel p-4"><p className="kicker">COMM ALERTS</p><p className="text-3xl font-bold text-red-400 font-display">{teams.filter((t) => t.communication === "DEGRADED" || t.communication === "OFFLINE").length}</p></div>
        <div className="panel p-4"><p className="kicker">PENDING REPORTS</p><p className="text-3xl font-bold text-sky-300 font-display">{pending}</p></div>
        <div className="panel p-4"><p className="kicker">RESOURCE REQUESTS</p><p className="text-3xl font-bold text-amber-300 font-display">{teams.filter((t) => t.requirement !== "None").length}</p></div>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">{def?.assetLabel ?? "UNIT STATUS"}</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {teams.map((t) => (
            <div key={t.id} className="panel p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white tracking-wider">{t.name}</p>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-xs text-muted">Leader: <span className="text-slate-300">{t.leader}</span></p>
              <p className="text-xs text-muted">{t.sector} — {t.members} members</p>
              <p className="text-xs text-slate-400 italic">“{t.situation}”</p>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>RESOURCES</span><span>{t.resource}%</span></div>
                <ProgressBar value={t.resource} />
              </div>
              <p className="text-xs"><span className="text-muted">Requirement:</span> <span className="text-amber-300">{t.requirement}</span></p>
              <p className="text-xs"><span className="text-muted">Comms:</span> <span className={t.communication === "DEGRADED" ? "text-amber-300" : t.communication === "OFFLINE" ? "text-red-400" : "text-emerald-300"}>{t.communication}</span></p>
              <p className="text-[10px] text-slate-500 font-mono pt-1">LAST UPDATED {t.lastComm}</p>
            </div>
          ))}
        </div>
      </div>

      <MapPanel />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-4">
          <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">RESOURCE MONITOR</h3>
          <div className="space-y-4">
            {teams.map((t) => (
              <div key={t.id}>
                <p className="text-xs font-bold text-slate-200 tracking-widest mb-1">{t.name}</p>
                {(
                  [
                    [labels[0], `${Math.round((t.personnel / 8) * 100)}%`, (t.personnel / 8) * 100],
                    [labels[1], `${t.medical}%`, t.medical],
                    [labels[2], `${t.water}%`, t.water],
                    [labels[3], `${t.comm}%`, t.comm],
                    [labels[4], `${t.transport}%`, t.transport],
                  ] as [string, string, number][]
                ).map(([label, v, pct]) => (
                  <div key={label} className="flex items-center gap-3 mb-1">
                    <span className="w-24 text-[11px] text-slate-500">{label}</span>
                    <div className="flex-1"><ProgressBar value={Math.max(2, pct)} /></div>
                    <span className="w-12 text-right font-mono text-[11px] text-slate-300">{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel p-4">
            <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">SIGNAL / COMMUNICATION</h3>
            <div className="space-y-2.5">
              {teams.map((t) => (
                <div key={t.id} className="flex items-center gap-3 text-xs">
                  <span className="w-32 font-bold text-slate-200">{t.name}</span>
                  <span className={`status-dot ${t.communication === "CONNECTED" || t.communication === "STABLE" ? "bg-emerald-500 pulse-green" : t.communication === "DEGRADED" ? "bg-amber-400 pulse-amber" : "bg-red-500 pulse-red"}`} />
                  <span className={`w-20 ${t.communication === "DEGRADED" ? "text-amber-300" : t.communication === "OFFLINE" ? "text-red-400" : "text-emerald-300"}`}>{t.communication}</span>
                  <span className="text-slate-500">Signal {t.signal}%</span>
                  <span className="ml-auto font-mono text-slate-500">{t.delay}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setAudio(true)} className="mt-4 w-full btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434]"><Mic size={15} /> SEND AUDIO COMMAND</button>
          </div>
          <TimelinePanel />
        </div>
      </div>
      <AudioCommandModal open={audio} onClose={() => setAudio(false)} />
      <p className="text-center text-[10px] text-slate-600 tracking-widest">REPORTS: {reportsSubmitted} • DECISIONS: {decisionsTaken} • COMM ISSUES LOGGED: {commIssues}</p>
    </div>
  );
}
