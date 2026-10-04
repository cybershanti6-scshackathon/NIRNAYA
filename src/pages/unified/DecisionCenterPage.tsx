import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Swords,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { useSim, type Decision } from "../../store/sim";
import { DOMAINS, type Domain } from "../../data/domains";

interface DecisionOption {
  id: string;
  title: string;
  desc: string;
  consequence: string;
}

const DECISION_OPTIONS: DecisionOption[] = [
  {
    id: "DEPLOY",
    title: "Deploy Team",
    desc: "Mobilize available tactical unit to contested grid to reinforce line.",
    consequence: "Unit moves into target sector, stabilizing sector perimeter.",
  },
  {
    id: "HOLD",
    title: "Hold Position",
    desc: "Instruct teams to fortify current coordinates and maintain passive surveillance.",
    consequence: "Conserves resources while maintaining situational awareness.",
  },
  {
    id: "PRIORITY",
    title: "Change Priority",
    desc: "Reassign primary operational objective to counter emerging sector threat.",
    consequence: "Reallocates operational focus; secondary sectors enter monitoring posture.",
  },
  {
    id: "REINFORCE",
    title: "Request Reinforcement",
    desc: "Escalate to higher headquarters for auxiliary reserves and emergency logistical delivery.",
    consequence: "ETA logged for resupply convoys; tactical readiness boosted by 15%.",
  },
  {
    id: "COMMS",
    title: "Change Communication Channel",
    desc: "Execute frequency hop to auxiliary net to bypass jamming and signal degradation.",
    consequence: "Restores communication link stability and reduces latency across sectors.",
  },
  {
    id: "MONITOR",
    title: "Increase Monitoring",
    desc: "Double sensor scan rates, aerial surveillance, and radio telemetry polling.",
    consequence: "Increases information veracity; reveals hidden track anomalies.",
  },
  {
    id: "CONTAIN",
    title: "Contain Threat",
    desc: "Establish localized isolation perimeter around threat epicenter.",
    consequence: "Reduces threat level from High to Medium; arrests hostile advance.",
  },
];

export function DecisionCenterPage() {
  const { domain } = useParams();
  const {
    teams,
    addDecision,
    decisions,
    domain: storeDomain,
    pushToast,
    scenario,
  } = useSim();

  const currentDomain = (domain?.toUpperCase() as Domain) || storeDomain || "LAND";
  const def = DOMAINS[currentDomain] || DOMAINS.LAND;

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(80);
  const [reason, setReason] = useState("");
  const [affectedTeams, setAffectedTeams] = useState<string[]>([teams[0]?.name || "TEAM ALPHA"]);
  const [lastRecorded, setLastRecorded] = useState<Decision | null>(null);

  const toggleTeam = (name: string) => {
    setAffectedTeams((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const handleConfirmDecision = () => {
    if (!selectedOptionId) {
      pushToast("Please select a command decision option.", "warn");
      return;
    }

    const opt = DECISION_OPTIONS.find((o) => o.id === selectedOptionId)!;
    const decisionRecord = {
      option: `${opt.title.toUpperCase()}: ${opt.desc}`,
      reason: reason.trim() || `Tactical command decision executed: ${opt.consequence}`,
      confidence,
      affected: affectedTeams.length ? affectedTeams : [teams[0]?.name || "HQ"],
    };

    addDecision(decisionRecord);

    const time = new Date().toTimeString().slice(0, 8);
    setLastRecorded({
      ...decisionRecord,
      id: Date.now(),
      time,
    });

    pushToast(`Decision executed: ${opt.title}`, "ok");
    setReason("");
  };

  const activeOption = DECISION_OPTIONS.find((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="panel p-5 bg-black/40 border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker text-[#b7c79a]">COMMAND DIRECTIVE • {def.title}</p>
          <h1 className="text-xl font-black text-white font-display mt-0.5 tracking-wide">
            DECISION CENTER
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Evaluate operational intelligence, select decisive commander actions, specify reasoning, and apply tactical consequences to the ongoing simulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Decisions:</span>
          <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            {decisions.length} LOGGED
          </span>
        </div>
      </div>

      {/* Main Grid: Situation vs Decision Form */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Current Situation & Intelligence */}
        <div className="panel p-5 bg-black/40 border-white/10 space-y-4">
          <h2 className="font-display text-sm font-bold tracking-widest text-white flex items-center gap-2">
            <AlertCircle size={16} className="text-[#9caf88]" /> CURRENT OPERATIONAL INTELLIGENCE
          </h2>

          <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] text-xs space-y-1">
            <span className="text-slate-400 font-semibold">Active Scenario:</span>
            <p className="font-bold text-white text-sm">{scenario}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wider text-slate-300">UNIT DISPOSITIONS:</p>
            {teams.map((t) => (
              <div key={t.id} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.015] text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white">{t.name}: </span>
                  <span className="text-slate-300">{t.situation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{t.sector}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.threat === "High" ? "bg-red-500/20 text-red-300 border border-red-500/30" : t.threat === "Medium" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"}`}>
                    {t.threat}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10">
            <p className="text-xs font-bold tracking-wider text-slate-300 mb-2">AVAILABLE DECISION CHANNELS:</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Sector Reinforcement Net</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Electronic Countermeasure Net</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Strategic Logistics Link</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Joint Tactical Air/Ground Link</span>
            </div>
          </div>
        </div>

        {/* Right Column: Decision Action Center */}
        <div className="panel p-5 bg-black/40 border-white/10 space-y-4">
          <h2 className="font-display text-sm font-bold tracking-widest text-white flex items-center gap-2">
            <Swords size={16} className="text-[#9caf88]" /> SELECT COMMAND DECISION
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {DECISION_OPTIONS.map((o) => {
              const isSelected = selectedOptionId === o.id;
              return (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => setSelectedOptionId(o.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-[#9caf88] bg-[#556b2f]/30 shadow-md ring-1 ring-[#9caf88]/50"
                      : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                  }`}
                >
                  <p className="font-bold text-xs text-white">{o.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{o.desc}</p>
                </button>
              );
            })}
          </div>

          {activeOption && (
            <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-slate-200">
              <strong className="text-emerald-300">Expected Consequence: </strong>
              {activeOption.consequence}
            </div>
          )}

          {/* Decision Confidence Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Decision Confidence Level</span>
              <span className="font-mono text-emerald-300 font-bold">{confidence}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full accent-[#9caf88] h-1.5 bg-slate-700 rounded cursor-pointer"
            />
          </div>

          {/* Reasoning Text Area */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Operational Reasoning &amp; Context
            </label>
            <textarea
              className="input text-xs min-h-20"
              placeholder="Explain tactical justification for this decision (e.g., Contain hostile movement, stabilize radio link)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Affected Teams */}
          <div>
            <p className="text-xs text-slate-400 mb-1.5">Designated Units for Execution</p>
            <div className="flex flex-wrap gap-2">
              {teams.map((t) => {
                const isSelected = affectedTeams.includes(t.name);
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => toggleTeam(t.name)}
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider transition ${
                      isSelected
                        ? "border-[#9caf88] bg-[#556b2f]/40 text-[#d3e2b3]"
                        : "border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleConfirmDecision}
            disabled={!selectedOptionId}
            className="btn-primary w-full !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] text-xs font-bold py-3 disabled:opacity-40 shadow-lg"
          >
            CONFIRM &amp; EXECUTE DECISION
          </button>
        </div>
      </div>

      {/* Decision Recorded Feedback Banner */}
      {lastRecorded && (
        <div className="panel p-5 bg-emerald-950/30 border-emerald-500/40 text-xs space-y-2 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <h3 className="font-display text-sm font-bold text-emerald-300 tracking-wider">
              COMMAND DECISION LOGGED &amp; EXECUTED
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 text-slate-300 pt-1 border-t border-emerald-500/20">
            <p><span className="text-slate-400">Timestamp:</span> <span className="font-mono text-white">{lastRecorded.time}</span></p>
            <p><span className="text-slate-400">Action:</span> <span className="font-bold text-white">{lastRecorded.option}</span></p>
            <p><span className="text-slate-400">Target Units:</span> {lastRecorded.affected?.join(", ")}</p>
            <p><span className="text-slate-400">Confidence:</span> <span className="text-emerald-300 font-bold">{lastRecorded.confidence}%</span></p>
            <p className="sm:col-span-2"><span className="text-slate-400">Rationale:</span> {lastRecorded.reason}</p>
          </div>
        </div>
      )}

      {/* Decision Log (Section 30 Empty State if empty) */}
      <div className="panel p-5 bg-black/40 border-white/10 space-y-3">
        <h2 className="font-display text-sm font-bold tracking-widest text-white flex items-center gap-2">
          <FileCheck size={16} className="text-[#9caf88]" />
          DECISION LOG TIMELINE
        </h2>

        {decisions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-bold text-slate-400">NO DECISIONS RECORDED</p>
            <p className="text-xs text-slate-500 mt-1">Commander decisions will appear here as they are confirmed.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {decisions.map((d) => (
              <div key={d.id} className="p-3 rounded-lg border border-white/5 bg-white/[0.015] flex flex-wrap items-start justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">{d.time}</span>
                    <span className="font-bold text-white">{d.option}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{d.reason}</p>
                  <p className="text-[10px] text-slate-500">Affected: {d.affected?.join(", ") || "All Units"}</p>
                </div>
                <span className="font-mono text-[11px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {d.confidence}% Conf
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
