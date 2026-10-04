import { useSim } from "../store/sim";

export function TimelinePanel() {
  const { events } = useSim();
  return (
    <div className="panel p-4">
      <h3 className="font-display text-sm font-bold tracking-widest text-white mb-3">LIVE EVENT TIMELINE</h3>
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {events.map((e) => (
          <div key={e.id} className="flex items-start gap-3 animate-fade-in-up">
            <span className="font-mono text-xs text-emerald-400 w-16 shrink-0 pt-0.5">{e.time}</span>
            <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${e.tone === "warn" ? "bg-amber-400" : e.tone === "alert" ? "bg-red-500" : e.tone === "ok" ? "bg-emerald-500" : "bg-sky-400"}`} />
            <p className="text-xs text-slate-300">{e.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
