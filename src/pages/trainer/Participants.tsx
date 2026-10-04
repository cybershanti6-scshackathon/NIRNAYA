import { useSim } from "../../store/sim";

export function Participants() {
  const { participants } = useSim();
  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">PARTICIPANTS</h2>
      <div className="panel p-5">
        <table className="w-full text-sm text-slate-300">
          <thead><tr className="text-left text-slate-500 text-xs"><th className="pb-2">Name</th><th>Role</th><th>Team</th><th>Status</th></tr></thead>
          <tbody>
            {participants.map((p, i) => (
              <tr key={i} className="border-t border-white/5"><td className="py-2 font-semibold text-white">{p.name}</td><td>{p.role}</td><td>{p.team}</td><td className={p.status === "ACTIVE" ? "text-emerald-300" : p.status === "DEGRADED" ? "text-amber-300" : "text-red-400"}>{p.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
