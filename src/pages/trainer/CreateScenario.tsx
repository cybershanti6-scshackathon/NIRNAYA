import { useState } from "react";
import { useSim } from "../../store/sim";
import { DomainArchitecture } from "../../components/DomainArchitecture";

const SLIDERS: [string, string][] = [
  ["threatIntensity", "THREAT INTENSITY"],
  ["infoReliability", "INFORMATION RELIABILITY"],
  ["commReliability", "COMMUNICATION RELIABILITY"],
  ["resourceAvailability", "RESOURCE AVAILABILITY"],
  ["eventFrequency", "EVENT FREQUENCY"],
  ["timePressure", "TIME PRESSURE"],
];

export function CreateScenario() {
  const { setScenarioConfig, pushToast, scenarioConfig, domain, setDomain } = useSim();
  const [f, setF] = useState({ ...scenarioConfig });
  const set = (k: string, v: string | number) => setF((p) => ({ ...p, [k]: v }));

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    setScenarioConfig(f);
    if (f.env !== "WATER" && f.env !== domain) setDomain(f.env);
    pushToast(`Configuration applied: ${f.env} environment, threat ${f.threatIntensity}%, comm ${f.commReliability}%.`, "ok");
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">CONFIGURE TRAINING SCENARIO</h2>
      <p className="text-sm text-muted -mt-2">Set the operational environment and parameters. These values drive the live scenario engine.</p>
      <div className="panel p-5">
        <p className="kicker mb-4">OPERATIONAL DOMAIN ARCHITECTURE</p>
        <DomainArchitecture active={domain ?? undefined} />
      </div>
      <form className="panel p-6 space-y-5" onSubmit={apply}>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-xs text-muted">Scenario Name<input className="input mt-1" value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
          <label className="text-xs text-muted">Scenario Type
            <select className="input mt-1" value={f.type} onChange={(e) => set("type", e.target.value)}>
              <option>Communication Failure</option><option>Resource Shortage</option><option>Multiple Team Coordination</option><option>Uncertain Situation</option><option>Emergency Response</option>
            </select>
          </label>
          <label className="text-xs text-muted">Scenario Environment
            <select className="input mt-1" value={f.env} onChange={(e) => set("env", e.target.value)}>
              <option>AIR</option><option>LAND</option><option>WATER</option><option>CYBER</option>
            </select>
          </label>
          <label className="text-xs text-muted">Number of Teams<input type="number" min={1} max={6} className="input mt-1" value={f.teams} onChange={(e) => set("teams", Number(e.target.value))} /></label>
          <label className="text-xs text-muted">Time Limit<input className="input mt-1" value={f.limit} onChange={(e) => set("limit", e.target.value)} /></label>
        </div>

        <div className="space-y-4 border-t border-white/10 pt-4">
          <p className="font-display text-xs font-bold tracking-widest text-white">OPERATIONAL PARAMETERS — DRAG TO CONFIGURE</p>
          {SLIDERS.map(([key, label]) => (
            <label key={key} className="block text-xs text-muted">
              <span className="flex justify-between"><span>{label}</span><span className="font-mono text-emerald-300">{(f as never as Record<string, number>)[key]}%</span></span>
              <span className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500">Low</span>
                <input type="range" min={0} max={100} value={(f as never as Record<string, number>)[key]} onChange={(e) => set(key, Number(e.target.value))} className="flex-1 accent-[#9caf88]" />
                <span className="text-[10px] text-slate-500">High</span>
              </span>
            </label>
          ))}
        </div>
        <button className="btn-primary w-full !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434]">APPLY CONFIGURATION</button>
      </form>
    </div>
  );
}
