import { useSim } from "../../store/sim";

export function TrDashboard() {
  const { scenario, teams, simTime, startedAt, reportsSubmitted, decisionsTaken, commIssues, participants, events } = useSim();
  const elapsed = Math.floor((simTime.getTime() - startedAt.getTime()) / 1000);
  const items: [string, string | number][] = [
    ["Active Teams", teams.filter((t) => t.status !== "OFFLINE").length],
    ["Current Scenario", scenario.split("—")[0].trim()],
    ["Elapsed Time", `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`],
    ["Reports Submitted", reportsSubmitted],
    ["Decisions Taken", decisionsTaken],
    ["Communication Issues", commIssues],
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">LIVE TRAINING MONITOR</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(([k, v]) => (
          <div key={k} className="panel p-4"><p className="kicker">{k}</p><p className="mt-1 font-display text-xl font-bold text-white">{v}</p></div>
        ))}
      </div>
      <div className="panel p-5">
        <h3 className="font-display text-xs font-bold tracking-widest text-white mb-3">TRAINEE TASKS &amp; FEEDBACK</h3>
        {[
          { t: "Review the current scenario brief", done: scenario !== "NO ACTIVE SCENARIO" },
          { t: "Monitor the event timeline for 2 minutes", done: events.length > 3 },
          { t: "Log at least one command decision (via Commander)", done: decisionsTaken > 0 },
          { t: "Send a situation report to the commander", done: reportsSubmitted > 0 },
        ].map((x, i) => (
          <p key={i} className="text-sm text-slate-300 flex items-center gap-2 py-1">
            <span className={`grid h-4 w-4 place-items-center rounded border ${x.done ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" : "border-slate-600"} text-[10px]`}>{x.done ? "✓" : ""}</span>
            {x.t}
          </p>
        ))}
        <p className="mt-3 text-xs text-slate-400">
          Feedback: {decisionsTaken === 0 ? "No decisions logged yet — passive posture increases the chance of escalation." : decisionsTaken < 2 ? "Good start. Aim to close the decision loop faster and record a reason." : "Strong decision cadence. Review escalations and communication reliability for improvement."}
        </p>
      </div>
      <div className="panel p-5">
        <h3 className="font-display text-xs font-bold tracking-widest text-white mb-3">PARTICIPANT STATUS</h3>
        {participants.map((p, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-white/5 py-2 text-sm">
            <span className="text-white font-semibold flex-1">{p.name}</span>
            <span className="text-muted w-24">{p.role}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-300" : p.status === "DEGRADED" ? "bg-amber-500/15 text-amber-300" : "bg-red-500/15 text-red-300"}`}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
