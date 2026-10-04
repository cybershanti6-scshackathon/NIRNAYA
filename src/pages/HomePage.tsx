import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Plane,
  Mountain,
  Cpu,
  RadioTower,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { DroneScanBackground } from "../components/DroneScanBackground";
import { DOMAINS, DOMAIN_IDS, type Domain } from "../data/domains";

const icons: Record<Domain, React.ReactNode> = {
  AIR: <Plane size={30} />,
  LAND: <Mountain size={30} />,
  CYBER: <Cpu size={30} />,
  EW: <RadioTower size={30} />,
};

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const stage = searchParams.get("stage") === "domains" ? "domains" : "hero";

  const enterTraining = () => setSearchParams({ stage: "domains" });
  const backToHero = () => setSearchParams({});

  return (
    <div className="relative min-h-screen hero-container">
      <div className="absolute inset-0 hero-bg-layer" />
      <div className="absolute inset-0 hero-scrim" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-70" />
        <DroneScanBackground />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* ---------- SCREEN 1: HERO ---------- */}
        {stage === "hero" && (
          <div className="flex flex-1 flex-col screen-fade">
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 backdrop-blur-md bg-black/20">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#556b2f]/40 text-[#c7dca6] border border-[#9caf88]/40">
                  <ShieldCheck size={24} />
                </span>
                <p className="text-lg font-extrabold tracking-[0.3em] text-white">NIRNAYA</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-300">
                  <span className="status-dot bg-emerald-400 pulse-green" /> OPERATIONAL STATUS: READY
                </span>
                <ThemeToggle />
              </div>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9caf88]/40 bg-[#556b2f]/20 px-5 py-2 text-xs font-bold tracking-[0.25em] text-[#d3e2b3]">
                <Activity size={14} /> MULTI-DOMAIN COMMAND &amp; DECISION SUPPORT
              </p>

              <p className="font-display text-5xl sm:text-7xl font-black tracking-[0.18em] text-white">
                NIRNAYA
              </p>

              <h1 className="hero-heading mt-6 font-display text-3xl sm:text-5xl font-black leading-tight tracking-tight max-w-4xl">
                TRAIN BEYOND THE PERFECT PICTURE
              </h1>

              <p className="hero-subheading mt-6 max-w-2xl text-base sm:text-lg leading-relaxed">
                NIRNAYA is a unified command, simulation, communication and decision-support
                platform — synchronizing multi-domain awareness, tactical training communications,
                scenario simulation and commander decision intelligence across air, land, cyber and
                electronic warfare operations.
              </p>

              <button
                onClick={enterTraining}
                className="group mt-10 inline-flex items-center gap-3 rounded-xl border border-[#b7cf9a]/50 bg-gradient-to-r from-[#556b2f] to-[#75953b] px-12 py-5 text-base font-extrabold tracking-[0.2em] text-white shadow-xl transition-all hover:scale-[1.03] hover:from-[#627d35] hover:to-[#84a842] active:scale-[0.98]"
              >
                ENTER TRAINING
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </main>

            <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-500">
              NIRNAYA • Unified Command &amp; Decision Platform • Training Console
            </footer>
          </div>
        )}

        {/* ---------- SCREEN 2: DOMAIN SELECTION ---------- */}
        {stage === "domains" && (
          <div className="flex flex-1 flex-col screen-fade">
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 backdrop-blur-md bg-black/20">
              <button
                onClick={backToHero}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-wider text-slate-300 hover:bg-white/10 hover:text-white transition"
              >
                <ArrowLeft size={14} /> RETURN TO HERO
              </button>
              <p className="font-display text-sm font-extrabold tracking-[0.3em] text-white">NIRNAYA</p>
              <ThemeToggle />
            </header>

            <main className="mx-auto w-full max-w-7xl px-6 py-12">
              <div className="text-center mb-12">
                <p className="kicker tracking-[0.3em] text-[#b7c79a]">MULTI-DOMAIN ARCHITECTURE</p>
                <h1 className="mt-3 font-display text-4xl sm:text-6xl font-black text-white tracking-tight">
                  SELECT OPERATIONAL DOMAIN
                </h1>
                <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
                  Select an operational theatre to initialize sector telemetry, unit readiness
                  profiles, scenario directives, and command interfaces.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {DOMAIN_IDS.map((id, i) => {
                  const d = DOMAINS[id];
                  return (
                    <div
                      key={id}
                      onClick={() => navigate(`/domain/${id}`)}
                      className="panel p-6 cursor-pointer flex flex-col justify-between transition-all duration-200 hover:-translate-y-2 hover:border-[#9caf88]/70 hover:shadow-2xl bg-black/40 backdrop-blur-md group min-h-[300px]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#556b2f]/25 text-[#b7c79a] group-hover:bg-[#556b2f]/45 transition">
                            {icons[id]}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-white">
                            0{i + 1}
                          </span>
                        </div>
                        <h2 className="font-display text-2xl font-black tracking-wider text-white group-hover:text-[#d3e2b3] transition">
                          {d.title}
                        </h2>
                        <p className="text-xs font-bold tracking-[0.2em] text-[#b7c79a] mt-1">{d.subtitle}</p>
                        <p className="mt-3 text-xs text-slate-300 leading-relaxed">{d.description}</p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-extrabold tracking-widest text-[#b7c79a] group-hover:text-white transition">
                          ENTER {id}
                        </span>
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#556b2f]/30 text-[#d3e2b3] group-hover:translate-x-1 transition-transform">
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </main>
          </div>
        )}
      </div>
    </div>
  );
}
