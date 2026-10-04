import { useSim } from "../../store/sim";

export function SettingsPage() {
  const { scenario, pushToast } = useSim();
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">SETTINGS</h2>
      <div className="panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div><p className="font-semibold text-white">Simulation Mode</p><p className="text-xs text-muted">Run the dashboard on mock data.</p></div>
          <span className="rounded-full bg-amber-500/15 border border-amber-500/40 px-3 py-1 text-[10px] font-bold text-amber-300 tracking-widest">ALWAYS ON</span>
        </div>
        <div className="flex items-center justify-between">
          <div><p className="font-semibold text-white">Active Scenario</p><p className="text-xs text-muted">{scenario}</p></div>
          <span className="text-xs text-slate-500">Set from Scenarios tab</span>
        </div>
        <button className="btn-ghost" onClick={() => pushToast("Simulation preferences reset .", "info")}>RESET PREFERENCES</button>
      </div>
    </div>
  );
}
