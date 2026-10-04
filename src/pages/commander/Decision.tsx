import { useState } from "react";
import { useSim } from "../../store/sim";

const options = [
  { id: "A", title: "Continue Monitoring", desc: "Maintain current posture and await further reports." },
  { id: "B", title: "Reallocate Simulated Resources", desc: "Shift medical and water supplies from Alpha to Bravo." },
  { id: "C", title: "Request Additional Support", desc: "Simulate escalation to higher HQ for reinforcement." },
  { id: "D", title: "Change Team Priority", desc: "Elevate Charlie to priority-one and reroute focus." },
];

export function Decision() {
  const { teams, addDecision, decisions } = useSim();
  const [selected, setSelected] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(70);
  const [reason, setReason] = useState("");
  const [affected, setAffected] = useState<string[]>(["TEAM ALPHA"]);
  const [recorded, setRecorded] = useState<null | { option: string; reason: string; confidence: number; time: string }>(null);

  const toggleAffected = (name: string) => setAffected((a) => (a.includes(name) ? a.filter((x) => x !== name) : [...a, name]));

  const confirm = () => {
    if (!selected) return;
    const opt = options.find((o) => o.id === selected)!;
    const time = new Date().toTimeString().slice(0, 8);
    addDecision({ option: `OPTION ${opt.id} — ${opt.title}`, reason: reason || "No reason provided", confidence, affected });
    setRecorded({ option: `OPTION ${opt.id} — ${opt.title}`, reason: reason || "No reason provided", confidence, time });
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">DECISION CENTER</h2>
      <p className="text-sm text-muted -mt-2">Review the available information and record a simulated command decision.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5 space-y-3">
          <h3 className="font-display text-sm font-bold tracking-widest text-white">CURRENT SITUATION</h3>
          {teams.map((t) => (
            <p key={t.id} className="text-sm"><span className="font-bold text-slate-200">{t.name}:</span> <span className="text-slate-400">{t.situation}</span></p>
          ))}
          <h3 className="pt-2 font-display text-sm font-bold tracking-widest text-white">INFORMATION AVAILABLE</h3>
          {["Team Reports", "Locations", "Resources", "Communication", "Timeline", "Confidence Levels", "Scenario Status"].map((i) => (
            <p key={i} className="text-xs text-slate-400 flex items-center gap-2"><span className="text-emerald-400">●</span> {i}</p>
          ))}
        </div>

        <div className="panel p-5 space-y-3">
          <h3 className="font-display text-sm font-bold tracking-widest text-white">SIMULATED DECISION</h3>
          <div className="grid grid-cols-2 gap-3">
            {options.map((o) => (
              <button key={o.id} onClick={() => setSelected(o.id)} className={`rounded-xl border p-3 text-left transition ${selected === o.id ? "border-[#9caf88] bg-[#556b2f]/25" : "border-white/10 hover:border-white/25"}`}>
                <p className="text-[10px] tracking-[0.25em] text-[#b7c79a]">OPTION {o.id}</p>
                <p className="text-sm font-bold text-white">{o.title}</p>
                <p className="mt-1 text-[11px] text-slate-500">{o.desc}</p>
              </button>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted mb-1"><span>Decision Confidence</span><span className="font-mono text-emerald-300">{confidence}%</span></div>
            <input type="range" min={0} max={100} value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="w-full accent-[#9caf88]" />
          </div>
          <textarea className="input min-h-20" placeholder="Explain why this simulated decision was selected." value={reason} onChange={(e) => setReason(e.target.value)} />
          <div>
            <p className="text-xs text-muted mb-1">Affected Teams</p>
            <div className="flex flex-wrap gap-2">
              {teams.map((t) => (
                <button type="button" key={t.id} onClick={() => toggleAffected(t.name)} className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest transition ${affected.includes(t.name) ? "border-[#9caf88] bg-[#556b2f]/30 text-[#d3e2b3]" : "border-white/15 text-slate-500"}`}>{t.name}</button>
              ))}
            </div>
          </div>
          <button onClick={confirm} disabled={!selected} className="btn-primary w-full !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] disabled:opacity-40">CONFIRM DECISION</button>
        </div>
      </div>

      {recorded && (
        <div className="panel p-5 border-emerald-500/30">
          <h3 className="font-display text-sm font-bold tracking-widest text-emerald-300">DECISION RECORDED</h3>
          <div className="mt-2 grid gap-1 text-sm text-slate-300">
            <p>Timestamp: <span className="font-mono text-white">{recorded.time}</span></p>
            <p>Option: <span className="font-bold text-white">{recorded.option}</span></p>
            <p>Reason: {recorded.reason}</p>
            <p>Confidence: <span className="text-emerald-300">{recorded.confidence}%</span></p>
            <p>Affected Teams: <span className="text-white">{affected.join(", ")}</span></p>
          </div>
        </div>
      )}

      {decisions.length > 0 && (
        <div className="panel p-5">
          <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">DECISION LOG</h3>
          {decisions.map((d) => (
            <p key={d.id} className="text-xs text-slate-400 border-b border-white/5 py-1.5"><span className="font-mono text-emerald-400">{d.time}</span> — {d.option} ({d.confidence}%)</p>
          ))}
        </div>
      )}
    </div>
  );
}
