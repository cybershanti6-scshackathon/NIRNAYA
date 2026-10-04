import { useSim } from "../../store/sim";
import { DOMAINS } from "../../data/domains";
import { DomainArchitecture } from "../../components/DomainArchitecture";

export function Scenarios() {
  const { pushToast, domain, scenarioId, startScenario } = useSim();
  const def = domain ? DOMAINS[domain] : null;
  if (!def) return <p className="panel p-8 text-center text-slate-500">No operational domain selected.</p>;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">{def.scenarioTitle}</h2>
      <p className="text-sm text-muted -mt-2">Select a scenario to load it into the live environment. Configure threat, reliability and pressure from the Trainee console.</p>
      <div className="panel p-5 bg-black/40 border-white/10">
        <p className="kicker mb-4">OPERATIONAL DOMAIN ARCHITECTURE</p>
        <DomainArchitecture active={domain ?? undefined} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {def.scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => { startScenario(def.id, s.id); pushToast(`Scenario loaded: ${s.name}`, "ok"); }}
            className={`panel p-5 text-left transition hover:-translate-y-1 hover:border-[#9caf88]/50 ${scenarioId === s.id ? "border-[#9caf88]/60" : ""}`}
          >
            <p className="text-[10px] tracking-[0.3em] text-[#b7c79a]">{def.title} — {s.id.toUpperCase()}</p>
            <h3 className="mt-1 font-display text-lg font-bold text-white">{s.name}</h3>
            <p className="mt-2 text-xs text-slate-400">{s.brief}</p>
            <p className="mt-4 text-xs font-bold tracking-widest text-[#b7c79a]">{scenarioId === s.id ? "ACTIVE — RELOAD TO RESTART" : "OPEN SIMULATION →"}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
