import { MapPanel } from "../../components/MapPanel";
import { TimelinePanel } from "../../components/TimelinePanel";
import { useSim } from "../../store/sim";
import { StatusBadge } from "../../components/ui/common";

export function Monitoring() {
  const { teams } = useSim();
  return (
    <div className="space-y-4">
      <MapPanel />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teams.map((t) => (
          <div key={t.id} className="panel p-4">
            <div className="flex justify-between items-center"><p className="font-bold text-white">{t.name}</p><StatusBadge status={t.status} /></div>
            <p className="text-xs text-muted mt-1">{t.sector} • Last update {t.lastComm}</p>
            <p className="text-xs text-slate-400 mt-2">{t.situation}</p>
          </div>
        ))}
      </div>
      <TimelinePanel />
    </div>
  );
}
