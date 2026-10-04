import { useMemo, useState } from "react";
import { useSim } from "../../store/sim";
import { Modal, StatusBadge } from "../../components/ui/common";

export function Reports() {
  const { reports, teams, acknowledgeReport, pushToast } = useSim();
  const [team, setTeam] = useState("ALL");
  const [threat, setThreat] = useState("ALL");
  const [location, setLocation] = useState("ALL");
  const [comm, setComm] = useState("ALL");
  const [sortDesc, setSortDesc] = useState(true);
  const [open, setOpen] = useState<number | null>(null);

  const locations = useMemo(() => [...new Set(reports.map((r) => r.location))], [reports]);

  const filtered = useMemo(() => {
    let list = reports;
    if (team !== "ALL") list = list.filter((r) => r.team === team);
    if (threat !== "ALL") list = list.filter((r) => r.threat === threat);
    if (location !== "ALL") list = list.filter((r) => r.location === location);
    if (comm !== "ALL") list = list.filter((r) => (comm === "CONNECTED" ? r.confidence > 70 : r.confidence <= 70));
    return [...list].sort((a, b) => (sortDesc ? b.id - a.id : a.id - b.id));
  }, [reports, team, threat, location, comm, sortDesc]);

  const selected = reports.find((r) => r.id === open);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">TEAM SITUATION REPORTS</h2>
      <div className="flex flex-wrap items-center gap-2">
        <select className="input !w-auto" value={team} onChange={(e) => setTeam(e.target.value)}>
          <option value="ALL">Team: All</option>
          {teams.map((t) => <option key={t.id}>{t.name}</option>)}
        </select>
        <select className="input !w-auto" value={threat} onChange={(e) => setThreat(e.target.value)}>
          <option value="ALL">Threat: All</option>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <select className="input !w-auto" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="ALL">Location: All</option>
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select className="input !w-auto" value={comm} onChange={(e) => setComm(e.target.value)}>
          <option value="ALL">Comms: All</option>
          <option value="CONNECTED">Connected</option>
          <option value="DEGRADED">Degraded</option>
        </select>
        <button className="btn-ghost" onClick={() => setSortDesc(!sortDesc)}>Sort: {sortDesc ? "Latest Update" : "Oldest"}</button>
      </div>

      {filtered.length === 0 && <p className="panel p-8 text-center text-slate-500">No reports match the selected filters.</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => (
          <div key={r.id} className="panel p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold tracking-widest text-white">{r.team}</p>
              <StatusBadge status={r.threat} />
            </div>
            <p className="text-xs text-muted">Leader: {r.leader} • {r.location} {r.area ? `• ${r.area}` : ""}</p>
            <p className="text-sm text-slate-300">{r.situation}</p>
            <p className="text-xs text-slate-400">What they see: {r.see ?? "—"}</p>
            <p className="text-xs"><span className="text-muted">Members:</span> {r.members} • <span className="text-muted">Confidence:</span> <span className="text-emerald-300">{r.confidence}%</span> • <span className="text-muted">Response:</span> {r.responseTime ?? "—"}</p>
            <p className="text-xs"><span className="text-muted">Available:</span> {r.available}</p>
            <p className="text-xs"><span className="text-muted">Required:</span> <span className="text-amber-300">{r.required}</span></p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">Updated {r.updated} {r.acknowledged && <span className="text-emerald-400">• ACK'D</span>}</span>
              <span className="flex gap-3">
                <button className="text-xs font-bold text-[#9caf88] hover:underline" onClick={() => setOpen(r.id)}>VIEW FULL REPORT</button>
                <button className="text-xs font-bold text-sky-300 hover:underline" onClick={() => { acknowledgeReport(r.id); pushToast(`${r.team} report acknowledged.`, "ok"); }}>ACKNOWLEDGE</button>
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setOpen(null)} title={selected ? `FULL REPORT — ${selected.team}` : ""}>
        {selected && (
          <div className="space-y-2 text-sm text-slate-300">
            {([
              ["Team Leader", selected.leader], ["Location", selected.location], ["Area", selected.area ?? "—"],
              ["Situation", selected.situation], ["What They See", selected.see ?? "—"], ["Conditions", selected.conditions ?? "—"],
              ["Threat Level", selected.threat], ["Members", String(selected.members)], ["Available", selected.available],
              ["Required", selected.required], ["Confidence", `${selected.confidence}%`], ["Response Time", selected.responseTime ?? "—"], ["Last Updated", selected.updated],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex gap-2 border-b border-white/5 pb-1.5"><span className="w-36 text-muted">{k}</span><span className="font-medium text-white">{v}</span></div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
