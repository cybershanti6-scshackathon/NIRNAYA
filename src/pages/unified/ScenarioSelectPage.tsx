import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Play, Sliders, ShieldAlert } from "lucide-react";
import { useSim, type ScenarioConfig } from "../../store/sim";
import { DOMAINS, type Domain } from "../../data/domains";
import { DomainArchitecture } from "../../components/DomainArchitecture";

const SLIDER_CONFIGS = [
  { key: "threatIntensity", label: "THREAT INTENSITY", desc: "Escalation rate and unit risk" },
  { key: "infoReliability", label: "INFORMATION RELIABILITY", desc: "Report veracity and sensor confidence" },
  { key: "commReliability", label: "COMMUNICATION RELIABILITY", desc: "Latency and link stability" },
  { key: "resourceAvailability", label: "RESOURCE AVAILABILITY", desc: "Supply reserves and support capacity" },
  { key: "eventFrequency", label: "EVENT FREQUENCY", desc: "Pace of ambient battlefield occurrences" },
  { key: "timePressure", label: "TIME PRESSURE", desc: "Speed of phase transitions" },
] as const;

export function ScenarioSelectPage() {
  const { domain, role: roleParam, scenarioId: routeScenarioId } = useParams();
  const navigate = useNavigate();
  const {
    domain: storeDomain,
    scenarioId: storeScenarioId,
    startScenario,
    setScenarioConfig,
    scenarioConfig,
    pushToast,
  } = useSim();

  const currentDomain = (domain?.toUpperCase() as Domain) || storeDomain || "LAND";
  const def = DOMAINS[currentDomain] || DOMAINS.LAND;
  const roleSlug = roleParam || "commander";

  // Selected scenario ID
  const [selectedId, setSelectedId] = useState<string>(() => {
    return routeScenarioId || storeScenarioId || def.scenarios[0].id;
  });

  // Local configuration copy driven by sliders
  const [config, setConfig] = useState<ScenarioConfig>({
    ...scenarioConfig,
    env: currentDomain,
  });

  useEffect(() => {
    if (routeScenarioId && def.scenarios.some((s) => s.id === routeScenarioId)) {
      setSelectedId(routeScenarioId);
    }
  }, [routeScenarioId, def]);

  const handleSliderChange = (key: keyof ScenarioConfig, val: number) => {
    const updated = { ...config, [key]: val };
    setConfig(updated);
    setScenarioConfig(updated);
  };

  const handleStartSimulation = () => {
    const sc = def.scenarios.find((s) => s.id === selectedId);
    if (!sc) return;

    // Apply configuration & start simulation
    setScenarioConfig({
      ...config,
      name: sc.name,
      env: currentDomain,
    });
    startScenario(currentDomain, selectedId);
    pushToast(`Simulation initialized: ${sc.name}`, "ok");

    // Navigate to Operational Dashboard
    navigate(`/domain/${currentDomain}/${roleSlug}/simulation`);
  };

  const activeScenario = def.scenarios.find((s) => s.id === selectedId) || def.scenarios[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title & Introduction */}
      <div className="panel p-5 bg-black/40 border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="kicker text-[#b7c79a]">THEATRE DIRECTIVES • {def.title}</p>
            <h1 className="text-2xl font-black tracking-wider text-white font-display mt-0.5">
              TRAINING SCENARIOS
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Select an operational scenario tailored to the {def.title} domain and configure tactical parameters to calibrate threat level, communication stability, and intelligence flow.
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            DOMAIN: {currentDomain}
          </span>
        </div>
      </div>

      {/* Operational Domain Architecture */}
      <div className="panel p-5 bg-black/40 border-white/10">
        <p className="kicker mb-4">OPERATIONAL DOMAIN ARCHITECTURE</p>
        <DomainArchitecture active={currentDomain} />
      </div>

      {/* Scenario Selection Cards Grid */}
      <div>
        <h2 className="text-sm font-bold tracking-widest text-slate-300 mb-3 flex items-center gap-2">
          <span>1. SELECT OPERATIONAL SCENARIO</span>
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {def.scenarios.map((sc, index) => {
            const isSelected = selectedId === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => setSelectedId(sc.id)}
                className={`panel p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
                  isSelected
                    ? "border-[#9caf88] bg-[#556b2f]/20 shadow-lg ring-1 ring-[#9caf88]/50"
                    : "border-white/10 hover:border-white/20 bg-black/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#9caf88] font-bold">
                    SCN-0{index + 1}
                  </span>
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#556b2f]/40 px-2 py-0.5 text-[10px] font-bold text-[#d3e2b3] border border-[#9caf88]/40">
                      <Check size={12} /> SELECTED
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 tracking-wider">CLICK TO SELECT</span>
                  )}
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-white tracking-wide">
                  {sc.name}
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {sc.brief}
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Phases: {sc.phases.length}</span>
                  <span className="font-semibold text-[#b7c79a]">Config Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Working Horizontal Configuration Sliders */}
      <div className="panel p-6 bg-black/40 border-white/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold tracking-wider text-white font-display flex items-center gap-2">
              <Sliders size={18} className="text-[#9caf88]" />
              2. CONFIGURE OPERATIONAL PARAMETERS
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Scenario: <strong className="text-white">{activeScenario.name}</strong> • Sliders dynamically alter simulation behavior, telemetry jitter, and communication delays.
            </p>
          </div>
          <button
            onClick={() => {
              const defConfig: ScenarioConfig = {
                name: activeScenario.name,
                type: "Standard Exercise",
                env: currentDomain,
                teams: 4,
                threatIntensity: 55,
                infoReliability: 70,
                commReliability: 60,
                resourceAvailability: 65,
                eventFrequency: 50,
                timePressure: 40,
                limit: "20 min",
              };
              setConfig(defConfig);
              setScenarioConfig(defConfig);
              pushToast("Parameters reset to operational defaults.", "info");
            }}
            className="text-xs font-semibold text-slate-400 hover:text-white underline"
          >
            Reset Defaults
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {SLIDER_CONFIGS.map(({ key, label, desc }) => {
            const val = config[key as keyof ScenarioConfig] as number;
            return (
              <div key={key} className="space-y-1.5 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold tracking-wider text-white">{label}</span>
                    <p className="text-[10px] text-slate-400">{desc}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {val}%
                  </span>
                </div>

                {/* Working Horizontal Slider with Low ... High and visual dot */}
                <div className="pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 w-7">Low</span>
                    <input
                      type="range"
                      min={10}
                      max={95}
                      step={1}
                      value={val}
                      onChange={(e) => handleSliderChange(key as keyof ScenarioConfig, Number(e.target.value))}
                      className="flex-1 accent-[#9caf88] h-2 bg-slate-700/60 rounded-lg cursor-pointer"
                      aria-label={label}
                    />
                    <span className="text-[10px] font-bold text-slate-500 w-8 text-right">High</span>
                  </div>

                  <div className="flex justify-center text-[10px] text-slate-400 font-mono mt-1">
                    Value: {val}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Simulation Action Button */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert size={16} className="text-amber-400" />
            <span>Clicking Start Simulation initializes real-time telemetry, resources, and communication net.</span>
          </div>

          <button
            onClick={handleStartSimulation}
            className="btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#75953b] hover:!from-[#627d35] hover:!to-[#84a842] px-8 py-3.5 text-sm font-black tracking-widest text-white shadow-xl hover:scale-[1.02] transition inline-flex items-center gap-2"
          >
            <Play size={16} fill="currentColor" /> START SIMULATION
          </button>
        </div>
      </div>
    </div>
  );
}
