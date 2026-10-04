import { MapPanel } from "../../components/MapPanel";
import { TimelinePanel } from "../../components/TimelinePanel";

export function TrMonitoring() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">LIVE TRAINING MONITOR</h2>
      <MapPanel compact />
      <TimelinePanel />
    </div>
  );
}
