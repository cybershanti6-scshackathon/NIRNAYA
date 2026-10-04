import { useState } from "react";
import { useSim } from "../../store/sim";
import { StatusBadge } from "../../components/ui/common";
import { Plus, Trash2 } from "lucide-react";

export function TLMembers() {
  const { pushToast } = useSim();
  const [members, setMembers] = useState([
    { name: "Rahul", role: "Team Leader", status: "ACTIVE", availability: "On duty" },
    { name: "Amit", role: "Member", status: "ACTIVE", availability: "On duty" },
    { name: "Rohan", role: "Member", status: "ACTIVE", availability: "On duty" },
    { name: "Vivek", role: "Member", status: "RESTING", availability: "Rest cycle" },
  ]);
  const [name, setName] = useState("");

  return (
    <div className="space-y-4 max-w-3xl">
      <h2 className="font-display text-lg font-bold tracking-widest text-white">TEAM MEMBERS</h2>
      <div className="panel p-5 space-y-3">
        {members.map((m, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-2 text-sm">
            <span className="font-semibold text-white w-24">{m.name}</span>
            <span className="text-muted flex-1">{m.role}</span>
            <StatusBadge status={m.status} />
            <span className="text-xs text-slate-500 w-20 text-right">{m.availability}</span>
            <button onClick={() => { setMembers(members.filter((_, j) => j !== i)); pushToast(`${m.name} removed .`, "info"); }} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <input className="input" placeholder="New member name" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn-ghost" onClick={() => { if (!name) return; setMembers([...members, { name, role: "Member", status: "ACTIVE", availability: "On duty" }]); setName(""); pushToast("Member added .", "ok"); }}><Plus size={15} /> ADD</button>
        </div>
      </div>
    </div>
  );
}
