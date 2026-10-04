import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const response = [
  { team: "Alpha", time: 2.4 }, { team: "Bravo", time: 3.1 }, { team: "Charlie", time: 5.8 }, { team: "Delta", time: 8.2 },
];
const progress = [
  { t: "10:00", p: 10 }, { t: "10:10", p: 28 }, { t: "10:20", p: 45 }, { t: "10:30", p: 58 }, { t: "10:40", p: 71 }, { t: "10:50", p: 84 },
];

export function Performance() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">PERFORMANCE ANALYSIS</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5 h-64">
          <h3 className="font-display text-xs font-bold tracking-widest text-white mb-2">TEAM RESPONSE TIME (MIN)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={response}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" /><XAxis dataKey="team" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-primary)" }} /><Bar dataKey="time" fill="#9caf88" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel p-5 h-64">
          <h3 className="font-display text-xs font-bold tracking-widest text-white mb-2">SIMULATION PROGRESS %</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={progress}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" /><XAxis dataKey="t" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-primary)" }} /><Line type="monotone" dataKey="p" stroke="#38bdf8" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
