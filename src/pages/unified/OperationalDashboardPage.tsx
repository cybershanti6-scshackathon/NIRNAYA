import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  AlertTriangle,
  Play,
  Volume2,
  Send,
  MessageSquare,
  Package,
} from "lucide-react";
import { useSim } from "../../store/sim";
import { DOMAINS, type Domain } from "../../data/domains";
import { StatusBadge, ProgressBar } from "../../components/ui/common";
import { MapPanel } from "../../components/MapPanel";
import { TimelinePanel } from "../../components/TimelinePanel";
import { AudioCommandModal } from "../../components/AudioCommandModal";
import { AudioPlayer } from "../../components/AudioPlayer";

export function OperationalDashboardPage() {
  const { domain, role: roleParam } = useParams();
  const navigate = useNavigate();
  const {
    teams,
    commIssues,
    reportsSubmitted,
    decisionsTaken,
    domain: storeDomain,
    reports,
    scenario,
    scenarioId,
    simTime,
    messages,
    addMessage,
    updateTeam,
    events,
    participants,
    listened,
    markListened,
    addAudioLog,
    pushToast,
  } = useSim();

  const [audioModal, setAudioModal] = useState(false);
  const [tlMsg, setTlMsg] = useState("");

  const currentDomain = (domain?.toUpperCase() as Domain) || storeDomain || "LAND";
  const def = DOMAINS[currentDomain] || DOMAINS.LAND;
  const roleSlug = roleParam || "commander";
  const pending = reports.filter((r) => !r.acknowledged).length;
  const labels = def.resourceLabels;

  // Primary team assigned to Team Leader
  const leadTeam = teams[0] || {
    id: "alpha",
    name: "TEAM ALPHA",
    leader: "Rahul Sharma",
    sector: "Sector A",
    status: "ACTIVE",
    communication: "CONNECTED",
    resource: 80,
    requirement: "None",
    medical: 70,
    water: 75,
    comm: 85,
    transport: 80,
    personnel: 6,
    signal: 90,
    lastComm: "10:00:00",
    delay: "0.5s",
    threat: "Medium" as const,
    situation: "Patrol nominal",
  };

  // Section 30: Empty state handling if no scenario started
  if (!scenarioId || scenario === "NO ACTIVE SCENARIO") {
    return (
      <div className="panel p-10 text-center max-w-xl mx-auto my-12 border-white/10 bg-black/40 backdrop-blur-md">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 mb-4">
          <AlertTriangle size={32} />
        </span>
        <h2 className="font-display text-2xl font-black tracking-widest text-white mb-2">
          NO ACTIVE SCENARIO
        </h2>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Start a scenario to begin operational simulation in the {def.title} domain. You will be able to monitor live telemetry, evaluate field reports, and record tactical decisions.
        </p>
        <button
          onClick={() => navigate(`/domain/${currentDomain}/${roleSlug}/scenarios`)}
          className="btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] inline-flex items-center gap-2 px-8 py-3 text-sm font-extrabold tracking-widest text-white shadow-xl hover:scale-105 transition"
        >
          <Play size={16} fill="currentColor" /> START SCENARIO
        </button>
      </div>
    );
  }

  // --- Commander View ---
  if (roleSlug === "commander") {
    return (
      <div className="space-y-6">
        {/* Operational Picture Header Banner */}
        <div className="panel p-5 bg-black/40 border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker text-[#b7c79a]">OPERATIONAL COMMAND PICTURE — {def.title}</p>
            <h1 className="text-xl font-black text-white font-display mt-0.5 tracking-wide">
              {scenario}
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-3xl">{def.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAudioModal(true)}
              className="btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] inline-flex items-center gap-2 text-xs font-bold"
            >
              <Mic size={15} /> SEND AUDIO COMMAND
            </button>
          </div>
        </div>

        {/* 6 Key Status Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="panel p-4"><p className="kicker">TOTAL UNITS</p><p className="text-3xl font-bold text-white font-display mt-1">{teams.length}</p></div>
          <div className="panel p-4"><p className="kicker">ACTIVE</p><p className="text-3xl font-bold text-emerald-400 font-display mt-1">{teams.filter((t) => t.status === "ACTIVE").length}</p></div>
          <div className="panel p-4"><p className="kicker">WARNING</p><p className="text-3xl font-bold text-amber-400 font-display mt-1">{teams.filter((t) => t.status === "WARNING").length}</p></div>
          <div className="panel p-4"><p className="kicker">COMM ALERTS</p><p className="text-3xl font-bold text-red-400 font-display mt-1">{teams.filter((t) => t.communication === "DEGRADED" || t.communication === "OFFLINE").length}</p></div>
          <div className="panel p-4"><p className="kicker">PENDING REPORTS</p><p className="text-3xl font-bold text-sky-300 font-display mt-1">{pending}</p></div>
          <div className="panel p-4"><p className="kicker">RESOURCE REQ</p><p className="text-3xl font-bold text-amber-300 font-display mt-1">{teams.filter((t) => t.requirement !== "None").length}</p></div>
        </div>

        {/* Unit Status Cards */}
        <div>
          <h2 className="font-display text-sm font-bold tracking-widest text-white mb-3">
            {def.assetLabel}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {teams.map((t) => (
              <div key={t.id} className="panel p-4 space-y-2 bg-black/40">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white tracking-wider">{t.name}</p>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-xs text-muted">Lead: <span className="text-slate-200">{t.leader}</span> • {t.sector}</p>
                <p className="text-xs text-slate-300 italic line-clamp-2">“{t.situation}”</p>
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>RESOURCES</span>
                    <span className="font-mono text-emerald-300">{t.resource}%</span>
                  </div>
                  <ProgressBar value={t.resource} />
                </div>
                <p className="text-xs">
                  <span className="text-muted">Requirement: </span>
                  <span className={t.requirement === "None" ? "text-slate-400" : "text-amber-300 font-semibold"}>{t.requirement}</span>
                </p>
                <p className="text-xs">
                  <span className="text-muted">Comms: </span>
                  <span className={t.communication === "DEGRADED" ? "text-amber-300 font-bold" : t.communication === "OFFLINE" ? "text-red-400 font-bold" : "text-emerald-300"}>
                    {t.communication} ({t.signal}%)
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5">LAST COMM {t.lastComm}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Tactical Map */}
        <MapPanel />

        {/* Resource Monitor & Communication Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Resource Monitor */}
          <div className="panel p-4 bg-black/40">
            <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">RESOURCE MONITOR</h3>
            <div className="space-y-4">
              {teams.map((t) => (
                <div key={t.id} className="border-b border-white/5 pb-2 last:border-0">
                  <p className="text-xs font-bold text-slate-200 tracking-wider mb-1.5">{t.name}</p>
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
                      <span className="w-24 text-[11px] text-slate-400">{label}</span>
                      <div className="flex-1"><ProgressBar value={Math.max(2, pct)} /></div>
                      <span className="w-12 text-right font-mono text-[11px] text-slate-300">{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Signal / Comms & Timeline */}
          <div className="space-y-4">
            <div className="panel p-4 bg-black/40">
              <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">TACTICAL SIGNAL &amp; DISPATCH</h3>
              <div className="space-y-2.5">
                {teams.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 text-xs">
                    <span className="w-32 font-bold text-slate-200">{t.name}</span>
                    <span className={`status-dot ${t.communication === "CONNECTED" || t.communication === "STABLE" ? "bg-emerald-500 pulse-green" : t.communication === "DEGRADED" ? "bg-amber-400 pulse-amber" : "bg-red-500 pulse-red"}`} />
                    <span className={`w-24 ${t.communication === "DEGRADED" ? "text-amber-300 font-bold" : t.communication === "OFFLINE" ? "text-red-400 font-bold" : "text-emerald-300"}`}>
                      {t.communication}
                    </span>
                    <span className="text-slate-400">Sig {t.signal}%</span>
                    <span className="ml-auto font-mono text-slate-400">{t.delay}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setAudioModal(true)}
                className="mt-4 w-full btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] text-xs font-bold py-2.5"
              >
                <Mic size={15} /> SEND AUDIO COMMAND
              </button>
            </div>

            <TimelinePanel />
          </div>
        </div>

        <AudioCommandModal open={audioModal} onClose={() => setAudioModal(false)} />
        <p className="text-center text-[10px] text-slate-400 tracking-widest font-mono">
          REPORTS RECEIVED: {reportsSubmitted} • DECISIONS LOGGED: {decisionsTaken} • COMM ISSUES RECORDED: {commIssues}
        </p>
      </div>
    );
  }

  // --- Team Leader View ---
  if (roleSlug === "team-leader") {
    const clipFolder = currentDomain.toLowerCase();
    const handleSendMsg = () => {
      if (!tlMsg.trim()) return;
      addMessage({ from: leadTeam.name, to: "Commander", text: tlMsg.trim() });
      setTlMsg("");
      pushToast("Message transmitted to Commander.", "ok");
    };

    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Team Leader Banner */}
        <div className="panel p-6 bg-black/40 border-white/10">
          <p className="kicker text-[#b7c79a]">ASSIGNED OPERATIONAL UNIT • {def.title}</p>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-1">
            <h1 className="text-3xl font-black text-white font-display tracking-wider">
              {leadTeam.name}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/domain/${currentDomain}/team-leader/reports`)}
                className="btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] text-xs font-bold px-4 py-2"
              >
                SUBMIT SITUATION REPORT
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-xs pt-3 border-t border-white/10">
            <div><p className="text-slate-400">Team Leader</p><p className="text-white font-bold text-sm mt-0.5">{leadTeam.leader}</p></div>
            <div><p className="text-slate-400">Current Sector</p><p className="text-white font-bold text-sm mt-0.5">{leadTeam.sector}</p></div>
            <div><p className="text-slate-400">Unit Status</p><div className="mt-1"><StatusBadge status={leadTeam.status} /></div></div>
            <div><p className="text-slate-400">Communication</p><div className="mt-1"><StatusBadge status={leadTeam.communication} /></div></div>
            <div><p className="text-slate-400">Sim Time</p><p className="font-mono text-emerald-300 font-bold text-sm mt-0.5">{simTime instanceof Date ? simTime.toTimeString().slice(0, 8) : "--:--:--"}</p></div>
          </div>
        </div>

        {/* Current Mission & Resources Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Field Resources Adjustment */}
          <div className="panel p-5 bg-black/40 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-bold tracking-widest text-white flex items-center gap-2">
                <Package size={16} className="text-[#9caf88]" /> FIELD UNIT RESOURCES
              </h2>
              <span className="text-[10px] text-slate-400">Live sliders update Commander dashboard</span>
            </div>

            <div className="space-y-3">
              {[
                { key: "medical", name: labels[1], val: leadTeam.medical },
                { key: "water", name: labels[2], val: leadTeam.water },
                { key: "comm", name: labels[3], val: leadTeam.comm },
                { key: "transport", name: labels[4], val: leadTeam.transport },
                { key: "resource", name: "General Equipment", val: leadTeam.resource },
              ].map((r) => (
                <div key={r.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{r.name}</span>
                    <span className="font-mono text-emerald-300 font-semibold">{r.val}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={r.val}
                    onChange={(e) => updateTeam(leadTeam.id, { [r.key]: Number(e.target.value) } as never)}
                    className="w-full accent-[#9caf88] h-1.5 bg-slate-700 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Commander Comms & Outgoing Dispatch */}
          <div className="panel p-5 bg-black/40 space-y-4">
            <h2 className="font-display text-sm font-bold tracking-widest text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-[#9caf88]" /> COMMANDER DISPATCH NET
            </h2>

            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-400">No radio dispatches exchanged yet. Transmit a status report below.</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="p-2 rounded-lg bg-white/5 border border-white/5 text-xs">
                    <span className="font-mono text-emerald-400 mr-2">{m.time}</span>
                    <span className="font-bold text-white mr-1">{m.from} → {m.to}:</span>
                    <span className="text-slate-300">{m.text}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                className="input text-xs"
                placeholder="Transmit text message to Commander..."
                value={tlMsg}
                onChange={(e) => setTlMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMsg()}
              />
              <button onClick={handleSendMsg} className="btn-primary text-xs px-4">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Operational Voice Dispatches Player */}
        <div className="panel p-5 bg-black/40">
          <h2 className="font-display text-sm font-bold tracking-widest text-white mb-3 flex items-center gap-2">
            <Volume2 size={16} className="text-[#9caf88]" /> OPERATIONAL VOICE RECORDINGS — {def.title}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {def.comms.slice(0, 6).map((c, i) => {
              const src = `/audio/${clipFolder}/msg${String(i + 1).padStart(2, "0")}.wav`;
              const key = `${clipFolder}-${i}`;
              return (
                <div key={key} className="p-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{c.from} → {c.to}</span>
                    <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] tracking-wider text-slate-400 font-mono">{c.type}</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">“{c.text}”</p>
                  <AudioPlayer
                    src={src}
                    onPlay={() => {
                      markListened(key);
                      addAudioLog({ from: c.from, to: c.to, text: c.text, type: c.type }, "PLAYED");
                    }}
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className={listened[key] ? "text-emerald-400 font-bold" : ""}>
                      {listened[key] ? "✓ LISTENED" : "UNPLAYED"}
                    </span>
                    <span>Recording #{i + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <TimelinePanel />
      </div>
    );
  }

  // --- Trainee View ---
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Trainee Banner */}
      <div className="panel p-6 bg-black/40 border-white/10">
        <p className="kicker text-[#b7c79a]">OPERATIONAL EVALUATION CONSOLE • {def.title}</p>
        <h1 className="text-2xl font-black text-white font-display mt-0.5 tracking-wide">
          {scenario}
        </h1>
        <p className="mt-1 text-xs text-slate-300 max-w-3xl">
          Observe live sector telemetry, evaluate information reliability, test command reasoning, and track tactical performance.
        </p>
      </div>

      {/* Trainee Tasks & Guided Checklist */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-5 bg-black/40 space-y-4">
          <h2 className="font-display text-sm font-bold tracking-widest text-white">
            TRAINING OBJECTIVES &amp; PROGRESS
          </h2>
          <div className="space-y-2.5">
            {[
              { t: "Review active scenario brief & threat intensity", done: scenario !== "NO ACTIVE SCENARIO" },
              { t: "Monitor live event timeline for battlefield occurrences", done: events.length > 2 },
              { t: "Execute command decision in Decision Center", done: decisionsTaken > 0 },
              { t: "Review team situation reports and verify confidence", done: reportsSubmitted > 0 },
              { t: "Compile and export After Action Review (AAR)", done: false },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs">
                <span className={`grid h-5 w-5 place-items-center rounded ${task.done ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-slate-800 text-slate-500 border border-slate-700"}`}>
                  {task.done ? "✓" : (i + 1)}
                </span>
                <span className={task.done ? "text-slate-200 line-through" : "text-white font-medium"}>
                  {task.t}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg border border-[#9caf88]/30 bg-[#556b2f]/10 text-xs text-slate-300">
            <strong className="text-emerald-300">Trainee Feedback: </strong>
            {decisionsTaken === 0
              ? "Awaiting command decisions. Maintain close observation over sector readiness."
              : decisionsTaken < 2
              ? "Good initial decision response. Continue tracking threat containment consequences."
              : "Decisive cadence recorded. Generate HQ Report to inspect cumulative evaluation."}
          </div>
        </div>

        {/* Participants Table */}
        <div className="panel p-5 bg-black/40 space-y-3">
          <h2 className="font-display text-sm font-bold tracking-widest text-white">
            SESSION PARTICIPANTS
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300">
              <thead>
                <tr className="text-slate-500 text-left border-b border-white/10 pb-2">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Team</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, idx) => (
                  <tr key={idx} className="border-b border-white/5 py-2">
                    <td className="py-2 font-bold text-white">{p.name}</td>
                    <td className="text-slate-400">{p.role}</td>
                    <td className="text-slate-400">{p.team}</td>
                    <td className="text-right">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Map & Timeline */}
      <MapPanel compact />
      <TimelinePanel />
    </div>
  );
}
