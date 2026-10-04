import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plane, Mountain, Cpu, RadioTower, Shield } from "lucide-react";
import { DOMAINS, DOMAIN_IDS, type Domain } from "../data/domains";
import { ThemeToggle } from "../components/ui/ThemeToggle";

const icons: Record<Domain, React.ReactNode> = {
  AIR: <Plane size={36} />,
  LAND: <Mountain size={36} />,
  CYBER: <Cpu size={36} />,
  EW: <RadioTower size={36} />,
};

export function DomainsPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden hero-container flex flex-col justify-between p-6">
      <div className="absolute inset-0 hero-bg-layer" />
      <div className="absolute inset-0 hero-scrim" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-70" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full mb-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-wider text-slate-300 hover:bg-white/10 hover:text-white transition"
        >
          <ArrowLeft size={14} /> RETURN TO HOME
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Shield size={14} className="text-[#9caf88]" /> SELECT OPERATIONAL DOMAIN
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center my-6">
        <div className="text-center mb-10">
          <p className="kicker tracking-[0.3em] text-[#b7c79a]">MULTI-DOMAIN ARCHITECTURE</p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            SELECT OPERATIONAL DOMAIN
          </h1>
          <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Select an operational theatre to initialize sector telemetry, unit readiness profiles, scenario directives, and command interfaces.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {DOMAIN_IDS.map((id) => {
            const d = DOMAINS[id];
            return (
              <div
                key={id}
                onClick={() => navigate(`/domain/${id}`)}
                className="panel p-6 cursor-pointer flex flex-col justify-between transition-all duration-200 hover:-translate-y-2 hover:border-[#9caf88]/70 hover:shadow-2xl bg-black/40 backdrop-blur-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#556b2f]/25 text-[#b7c79a] group-hover:bg-[#556b2f]/45 transition">
                      {icons[id]}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-white">
                      0{DOMAIN_IDS.indexOf(id) + 1}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-black tracking-wider text-white group-hover:text-[#d3e2b3] transition">
                    {d.title}
                  </h2>
                  <p className="text-xs font-bold tracking-[0.2em] text-[#b7c79a] mt-1">
                    {d.subtitle}
                  </p>
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {d.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1">
                    <p className="text-[10px] font-bold tracking-widest text-slate-400">KEY FOCUS:</p>
                    {d.focus.slice(0, 3).map((f) => (
                      <p key={f} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[#9caf88]" /> {f}
                      </p>
                    ))}
                  </div>
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

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center text-xs text-slate-500 py-3">
        Select any operational domain to proceed to role selection.
      </footer>
    </div>
  );
}
