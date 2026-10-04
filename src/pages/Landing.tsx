import { useNavigate } from "react-router-dom";
import { ArrowRight, Plane, Mountain, Cpu, RadioTower, Radar } from "lucide-react";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { DOMAINS, DOMAIN_IDS } from "../data/domains";

const icons: Record<string, React.ReactNode> = {
  AIR: <Plane size={34} />,
  LAND: <Mountain size={34} />,
  CYBER: <Cpu size={34} />,
  EW: <RadioTower size={34} />,
};

export function Landing() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden hero-container">
      <div className="absolute inset-0 hero-bg-layer" />
      <div className="absolute inset-0 hero-scrim" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-70" />
      </div>

      <header className="relative z-10 flex items-start justify-between p-6">
        <div>
          <p className="text-[11px] font-bold tracking-[0.3em] hero-subheading">SIGNALBREAK</p>
          <p className="text-[11px] font-bold tracking-[0.3em] hero-accent-text">MULTI-DOMAIN COMMAND &amp; CRISIS TRAINING</p>
        </div>
        <div className="flex items-center gap-2">
          <Radar size={16} style={{ color: "var(--hero-accent)" }} />
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 flex flex-col items-center px-6 py-10 text-center">
        <h1 className="hero-heading font-display text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
          SELECT OPERATIONAL DOMAIN
        </h1>
        <p className="hero-subheading mt-4 max-w-2xl text-base md:text-lg font-semibold">
          Choose an operational domain to enter the command, crisis-response and training environment.
        </p>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-5 px-6 pb-16 sm:grid-cols-2 xl:grid-cols-4">
        {DOMAIN_IDS.map((id) => {
          const d = DOMAINS[id];
          return (
            <button
              key={id}
              onClick={() => navigate(`/domain/${id}`)}
              className="panel p-6 text-left transition hover:-translate-y-1 hover:border-[#9caf88]/50"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#556b2f]/25 text-[#b7c79a]">{icons[id]}</span>
              <h2 className="mt-4 font-display text-xl font-bold tracking-widest text-white">{d.title}</h2>
              <p className="mt-1 text-xs font-bold tracking-[0.2em] text-[#b7c79a]">{d.subtitle}</p>
              <p className="mt-3 text-sm text-muted flex-1">{d.description}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#b7c79a]">
                ENTER DOMAIN <ArrowRight size={14} />
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
