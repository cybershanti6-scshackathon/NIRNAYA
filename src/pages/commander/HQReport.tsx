import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSim } from "../../store/sim";
import { downloadAARPdf } from "../../utils/pdf";

const teamPerf = [
  { team: "Alpha", response: 2.4, accuracy: 92, comm: 95, resources: 72 },
  { team: "Bravo", response: 3.1, accuracy: 84, comm: 80, resources: 54 },
  { team: "Charlie", response: 5.8, accuracy: 71, comm: 38, resources: 38 },
  { team: "Delta", response: 8.2, accuracy: 60, comm: 10, resources: 61 },
];

const metrics = [
  { metric: "Avg Response (min)", value: 4.9 },
  { metric: "Comm Reliability %", value: 56 },
  { metric: "Info Accuracy %", value: 77 },
  { metric: "Resource Util %", value: 63 },
  { metric: "Decision Time (min)", value: 3.7 },
];

export function HQReport() {
  const { pushToast, scenario } = useSim();
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">HEADQUARTERS TRAINING REPORT</h2>

      <div className="panel p-5 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
        {[["Scenario", scenario.split("—")[0] ?? scenario], ["Duration", "24:16 min"], ["Commander", "Maj. S. Kapoor"], ["Teams", "4"], ["Participants", "26"]].map(([k, v]) => (
          <div key={k}><p className="kicker">{k}</p><p className="text-white font-bold">{v}</p></div>
        ))}
      </div>

      <div className="panel p-5">
        <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">TEAM PERFORMANCE</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300">
            <thead><tr className="text-slate-500 text-left"><th className="pb-2">Team</th><th>Response Time</th><th>Situation Accuracy</th><th>Comm Reliability</th><th>Resource Status</th></tr></thead>
            <tbody>
              {teamPerf.map((t) => (
                <tr key={t.team} className="border-t border-white/5"><td className="py-2 font-bold text-white">Team {t.team}</td><td>{t.response} min</td><td>{t.accuracy}%</td><td>{t.comm}%</td><td>{t.resources}%</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">SITUATION DIFFERENTIATION</h3>
        <div className="flex flex-col items-start gap-1 text-sm">
          {["INITIAL SITUATION", "EVENT 1 — CHARLIE COMM DEGRADED", "EVENT 2 — BRAVO WATER SHORTAGE", "EVENT 3 — DELTA STATUS UPDATE", "COMMANDER DECISION", "FINAL SIMULATED SITUATION"].map((s, i) => (
            <div key={s} className="w-full">
              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-bold tracking-wider text-slate-200">{s}</div>
              {i < 5 && <p className="text-center text-emerald-400 leading-tight">↓</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">SITUATION ANALYSIS</h3>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-xs text-slate-400">
          {[["Initial Situation", "Four teams deployed across sectors A–D"], ["Situation Changes", "Charlie link degraded at 10:44"], ["Major Events", "Bravo resource request at 10:43"], ["Communication Issues", "Charlie degraded"], ["Resource Changes", "Bravo water below 50%"], ["Commander Decisions", "3 recorded"], ["Team Responses", "All reports acknowledged within SLA"]].map(([k, v]) => (
            <p key={k}><span className="text-slate-200 font-semibold">{k}:</span> {v}</p>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5 h-64">
          <h3 className="font-display text-xs font-bold tracking-widest text-white mb-2">COMMUNICATION RELIABILITY BY TEAM</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={teamPerf}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" /><XAxis dataKey="team" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-primary)" }} /><Bar dataKey="comm" fill="#9caf88" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel p-5 h-64">
          <h3 className="font-display text-xs font-bold tracking-widest text-white mb-2">PERFORMANCE METRICS</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={metrics}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" /><XAxis dataKey="metric" stroke="#64748b" fontSize={9} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-primary)" }} /><Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => pushToast("Report generated successfully.", "ok")}>GENERATE REPORT</button>
        <button className="btn-ghost" onClick={() => { downloadAARPdf(); pushToast("PDF export complete — file downloaded.", "ok"); }}>EXPORT PDF</button>
        <button className="rounded-xl bg-[#556b2f]/30 border border-[#9caf88]/40 px-5 py-2.5 text-sm font-bold text-[#d3e2b3] hover:bg-[#556b2f]/50" onClick={() => pushToast("Training report submitted successfully.", "ok")}>SEND TO HQ</button>
      </div>
    </div>
  );
}
