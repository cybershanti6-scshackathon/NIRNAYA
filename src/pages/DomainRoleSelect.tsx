import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, GraduationCap, Radio, Shield, AlertTriangle } from "lucide-react";
import { useSim } from "../store/sim";
import { DOMAINS, DOMAIN_IDS, type Domain } from "../data/domains";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export function DomainRoleSelect() {
  const { domain } = useParams();
  const navigate = useNavigate();
  const setRole = useSim((s) => s.setRole);
  const setDomain = useSim((s) => s.setDomain);

  const upperDomain = (domain?.toUpperCase() ?? "") as Domain;
  const isValid = DOMAIN_IDS.includes(upperDomain);
  const def = isValid ? DOMAINS[upperDomain] : null;

  if (!isValid || !def) {
    return (
      <div className="min-h-screen bg-[#070b16] grid-bg p-6 flex flex-col items-center justify-center text-center">
        <div className="panel max-w-md p-8 border-red-500/40">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/20 text-red-400 mb-4">
            <AlertTriangle size={28} />
          </span>
          <h2 className="font-display text-xl font-bold text-white mb-2">Invalid Operational Domain</h2>
          <p className="text-sm text-slate-400 mb-6">
            The operational domain &quot;{domain}&quot; does not exist in the multi-domain registry.
          </p>
          <button
            onClick={() => navigate("/domains")}
            className="btn-primary w-full !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434]"
          >
            RETURN TO DOMAIN SELECTION
          </button>
        </div>
      </div>
    );
  }

  const roles = [
    {
      role: "commander" as const,
      roleSlug: "commander",
      title: "COMMANDER",
      subtitle: "Strategic Command & Decision Center",
      desc: "Overall operational picture, threat assessment, resource allocation, decision logging, incoming report triage, and dispatching tactical voice commands.",
      icon: <Shield size={32} />,
      cta: "ENTER AS COMMANDER",
      responsibilities: ["Review live tactical map & unit telemetry", "Evaluate incoming situation reports", "Execute strategic command decisions", "Generate After-Action Review (AAR) reports"],
    },
    {
      role: "teamleader" as const,
      roleSlug: "team-leader",
      title: "TEAM LEADER",
      subtitle: "Field Coordination & Tactical Reporting",
      desc: "Field-level execution, situation report compilation, direct communication with Commander, resource status monitoring, and sector situational management.",
      icon: <Radio size={32} />,
      cta: "ENTER AS TEAM LEADER",
      responsibilities: ["Submit structured situation reports to Commander", "Monitor sector resources & local requirements", "Exchange text & voice audio dispatches", "Execute tactical field orders"],
    },
    {
      role: "trainee" as const,
      roleSlug: "trainee",
      title: "TRAINEE",
      subtitle: "Operational Readiness & Guided Evaluation",
      desc: "Training scenario objectives, guided tactical decision tasks, live performance evaluation feedback, timeline tracking, and competency review.",
      icon: <GraduationCap size={32} />,
      cta: "ENTER AS TRAINEE",
      responsibilities: ["Complete operational scenario objectives", "Analyze multi-channel intelligence flow", "Formulate and test decision responses", "Review graded performance metrics"],
    },
  ];

  const enter = (roleSlug: string, role: "commander" | "teamleader" | "trainee") => {
    setDomain(upperDomain);
    setRole(role);
    navigate(`/domain/${upperDomain}/${roleSlug}/scenarios`);
  };

  return (
    <div className="min-h-screen bg-[#070b16] grid-bg p-6 flex flex-col items-center justify-between">
      {/* Top Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between">
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition"
          onClick={() => navigate("/domains")}
        >
          <ArrowLeft size={14} /> BACK TO DOMAIN SELECTION
        </button>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-2 text-xs text-slate-400">
            <span className="status-dot bg-emerald-400 pulse-green" /> DOMAIN: <strong className="text-white">{def.title}</strong>
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl my-8">
        <div className="text-center mb-10">
          <p className="kicker tracking-[0.3em] text-[#9caf88]">
            {def.title} • {def.subtitle}
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            SELECT OPERATIONAL ROLE
          </h1>
          <p className="mt-2 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Choose your role to access the corresponding command dashboard, operational data streams, decision tools, and reporting channels.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((c) => (
            <div
              key={c.role}
              className="panel p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-2 hover:border-[#9caf88]/60 hover:shadow-xl bg-black/40 backdrop-blur-md group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#556b2f]/25 text-[#b7c79a] group-hover:bg-[#556b2f]/45 transition">
                    {c.icon}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-[#9caf88] border border-[#9caf88]/30 px-2.5 py-0.5 rounded-full">
                    {def.id}
                  </span>
                </div>

                <h2 className="font-display text-xl font-black tracking-wider text-white group-hover:text-[#d3e2b3] transition">
                  {c.title}
                </h2>
                <p className="text-xs font-semibold text-[#b7c79a] mt-0.5">{c.subtitle}</p>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed">{c.desc}</p>

                <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5">
                  <p className="text-[10px] font-bold tracking-widest text-slate-400">OPERATIONAL TASKS:</p>
                  {c.responsibilities.map((r, i) => (
                    <p key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-emerald-400 text-xs leading-tight">›</span> {r}
                    </p>
                  ))}
                </div>
              </div>

              <button
                onClick={() => enter(c.roleSlug, c.role)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#9caf88]/40 bg-[#556b2f]/25 py-3 text-xs font-extrabold tracking-widest text-[#d3e2b3] transition hover:bg-[#556b2f]/60 hover:text-white"
              >
                {c.cta} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl text-center text-xs text-slate-500 py-2">
        Domain: {def.title} ({def.subtitle}) • 3 Operational Roles Available
      </footer>
    </div>
  );
}
