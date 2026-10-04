import { useState } from "react";
import { useSim } from "../../store/sim";
import { Modal } from "../../components/ui/common";
import { downloadAARPdf } from "../../utils/pdf";

export function TLHistory() {
  const { reports, pushToast } = useSim();
  const [open, setOpen] = useState<number | null>(null);
  const selected = reports.find((r) => r.id === open);
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold tracking-widest text-white">REPORT HISTORY</h2>
      <button className="btn-primary w-fit" onClick={() => { downloadAARPdf(); pushToast("AAR PDF exported and downloaded.", "ok"); }}>EXPORT AAR REPORT</button>
      <div className="panel p-5 overflow-x-auto">
        <table className="w-full text-sm text-slate-300">
          <thead><tr className="text-left text-slate-500 text-xs"><th className="pb-2">Time</th><th>Situation</th><th>Location</th><th>Resources</th><th>Threat</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="py-2 font-mono text-emerald-400">{r.updated}</td>
                <td>{r.situation}</td><td>{r.location}</td><td>{r.required}</td><td>{r.threat}</td>
                <td>{r.acknowledged ? <span className="text-emerald-300">ACKNOWLEDGED</span> : <span className="text-amber-300">PENDING</span>}</td>
                <td><button className="text-xs font-bold text-[#9caf88] hover:underline" onClick={() => setOpen(r.id)}>VIEW REPORT</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!selected} onClose={() => setOpen(null)} title={selected ? `REPORT — ${selected.team}` : ""}>
        {selected && <div className="space-y-1.5 text-sm text-slate-300">
          {[["Situation", selected.situation], ["Location", selected.location], ["What They See", selected.see ?? "—"], ["Threat", selected.threat], ["Required", selected.required], ["Confidence", `${selected.confidence}%`], ["Updated", selected.updated]].map(([k, v]) => (
            <p key={k}><span className="text-muted w-28 inline-block">{k}:</span> <span className="text-white">{v}</span></p>
          ))}
        </div>}
      </Modal>
    </div>
  );
}
