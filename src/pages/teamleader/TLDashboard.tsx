import { useSim } from "../../store/sim";
import { StatusBadge } from "../../components/ui/common";
import { downloadAARPdf } from "../../utils/pdf";

export function TLDashboard() {
  const { teams, scenario, simTime, pushToast } = useSim();
  const t = teams[0];
  return (
    <div className="space-y-4">
      <div className="panel p-6">
        <p className="kicker text-[#b7c79a]">CURRENT TRAINING UNIT</p>
        <h2 className="font-display text-4xl font-extrabold text-white tracking-wider">{t.name}</h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div><p className="kicker">Leader</p><p className="text-white font-semibold">{t.leader}</p></div>
          <div><p className="kicker">Location</p><p className="text-white font-semibold">{t.sector}</p></div>
          <div><p className="kicker">Status</p><StatusBadge status={t.status} /></div>
          <div><p className="kicker">Communication</p><StatusBadge status={t.communication} /></div>
          <div><p className="kicker">Sim Time</p><p className="font-mono text-emerald-300">{simTime.toTimeString().slice(0, 8)}</p></div>
        </div>
      </div>
      <div className="panel p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker mb-1">Current Scenario</p>
          <p className="text-white font-semibold">{scenario}</p>
        </div>
        <button className="btn-primary" onClick={() => { downloadAARPdf(); pushToast("AAR PDF exported and downloaded.", "ok"); }}>EXPORT AAR REPORT</button>
      </div>
    </div>
  );
}
