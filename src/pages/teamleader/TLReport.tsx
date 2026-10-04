import { useState } from "react";
import { useSim } from "../../store/sim";

export function TLReport() {
  const { addReport, pushToast } = useSim();
  const [f, setF] = useState({
    team: "TEAM ALPHA", leader: "Rahul Sharma", members: "8", location: "Area A", area: "Sector A-1",
    situation: "Area stable in simulation", see: "Movement detected in designated simulation zone", conditions: "Clear weather, light wind",
    threat: "Medium", confidence: 85, available: "Medical Kit, Water", required: "Additional Medical Support", extraReq: "", notes: "",
  });
  const set = (k: string, v: string | number) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addReport({
      team: f.team, leader: f.leader, location: f.location, area: f.area, see: f.see, conditions: f.conditions,
      situation: f.situation, threat: f.threat as "Low" | "Medium" | "High", members: Number(f.members),
      available: f.available, required: f.required + (f.extraReq ? `, ${f.extraReq}` : ""), confidence: Number(f.confidence),
      responseTime: "—",
    });
    pushToast("Situation report successfully transmitted to Commander.", "ok");
  };

  return (
    <form onSubmit={submit} className="panel p-6 max-w-3xl space-y-4">
      <h2 className="font-display text-lg font-bold tracking-widest text-white">SUBMIT SITUATION REPORT</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-xs text-muted">TEAM NAME<input className="input mt-1" value={f.team} onChange={(e) => set("team", e.target.value)} /></label>
        <label className="text-xs text-muted">TEAM LEADER NAME<input className="input mt-1" value={f.leader} onChange={(e) => set("leader", e.target.value)} /></label>
        <label className="text-xs text-muted">TEAM MEMBERS<input className="input mt-1" value={f.members} onChange={(e) => set("members", e.target.value)} /></label>
        <label className="text-xs text-muted">CURRENT LOCATION<input className="input mt-1" value={f.location} onChange={(e) => set("location", e.target.value)} /></label>
        <label className="text-xs text-muted">AREA NAME<input className="input mt-1" value={f.area} onChange={(e) => set("area", e.target.value)} /></label>
        <label className="text-xs text-muted">CURRENT SITUATION<input className="input mt-1" value={f.situation} onChange={(e) => set("situation", e.target.value)} /></label>
        <label className="text-xs text-muted">WHAT DO YOU SEE?<input className="input mt-1" value={f.see} onChange={(e) => set("see", e.target.value)} /></label>
        <label className="text-xs text-muted">OBSERVED CONDITIONS<input className="input mt-1" value={f.conditions} onChange={(e) => set("conditions", e.target.value)} /></label>
        <label className="text-xs text-muted">SIMULATED THREAT LEVEL
          <select className="input mt-1" value={f.threat} onChange={(e) => set("threat", e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select>
        </label>
        <label className="text-xs text-muted">CONFIDENCE LEVEL: <span className="text-emerald-300 font-mono">{f.confidence}%</span>
          <input type="range" min={0} max={100} value={f.confidence} onChange={(e) => set("confidence", Number(e.target.value))} className="w-full accent-[#9caf88] mt-2" />
        </label>
        <label className="text-xs text-muted">AVAILABLE RESOURCES<input className="input mt-1" value={f.available} onChange={(e) => set("available", e.target.value)} /></label>
        <label className="text-xs text-muted">REQUIRED RESOURCES<input className="input mt-1" value={f.required} onChange={(e) => set("required", e.target.value)} /></label>
        <label className="text-xs text-muted sm:col-span-2">ADDITIONAL REQUIREMENTS<input className="input mt-1" value={f.extraReq} onChange={(e) => set("extraReq", e.target.value)} /></label>
      </div>
      <label className="block text-xs text-muted">ADDITIONAL NOTES<textarea className="input mt-1 min-h-20" value={f.notes} onChange={(e) => set("notes", e.target.value)} /></label>
      <button className="btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434]">SUBMIT SITUATION REPORT</button>
    </form>
  );
}
