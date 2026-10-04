import { useSim } from "../../store/sim";

export function TLResources() {
  const { teams, updateTeam } = useSim();
  const t = teams[0];

  const rows = [
    { key: "medical", name: "Medical", available: t.medical, required: 100, isPct: true },
    { key: "water", name: "Water", available: t.water, required: 100, isPct: true },
    { key: "comm", name: "Communication", available: t.comm, required: 100, isPct: true },
    { key: "transport", name: "Transport", available: t.transport, required: 100, isPct: true },
    { key: "resource", name: "Equipment", available: t.resource, required: 100, isPct: true },
    { key: "personnel", name: "Personnel", available: t.personnel, required: 8, isPct: false },
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold tracking-widest text-white">RESOURCES</h2>
      <p className="text-xs text-muted">Edits here update the Commander dashboard in real time.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div key={r.key} className="panel p-5">
            <p className="font-bold text-white">{r.name}</p>
            <p className="mt-2 text-2xl font-bold text-white font-display">{r.available}{r.isPct ? "%" : ""}<span className="text-sm text-slate-500"> / {r.required}{r.isPct ? "%" : ""}</span></p>
            <input type="range" min={0} max={r.required} value={Math.min(r.available, r.required)} onChange={(e) => updateTeam(t.id, { [r.key]: Number(e.target.value) } as never)} className="mt-3 w-full accent-[#9caf88]" />
            <span className={`mt-3 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold tracking-widest ${r.available >= r.required * 0.7 ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>{r.available >= r.required * 0.7 ? "READY" : "NEEDS SUPPORT"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
