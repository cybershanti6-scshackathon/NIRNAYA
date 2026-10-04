import { useNavigate, useParams } from "react-router-dom";
import { GraduationCap, Radio, Shield, ArrowLeft } from "lucide-react";
import { useSim } from "../store/sim";
import { DOMAINS, type Domain } from "../data/domains";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export function DomainSelect() {
  const { domain } = useParams();
  const navigate = useNavigate();
  const setRole = useSim((s) => s.setRole);
  const setDomain = useSim((s) => s.setDomain);
  const def = DOMAINS[domain as Domain];

  if (!def) return <div className="p-10 text-center text-slate-400">Unknown domain. <button className="underline" onClick={() => navigate("/")}>Back home</button></div>;

  const roles = [
    { role: "commander" as const, title: "COMMANDER", desc: "Overall operational picture, threat assessment, resource allocation, decision logging and live reports.", icon: <Shield size={30} />, cta: "ENTER AS COMMANDER" },
    { role: "teamleader" as const, title: "TEAM LEADER", desc: "Field-level execution, mission reporting, communication with Commander and local decisions.", icon: <Radio size={30} />, cta: "ENTER AS TEAM LEADER" },
    { role: "trainee" as const, title: "TRAINEE", desc: "Training tasks, scenario information, guided decisions, learning feedback and performance evaluation.", icon: <GraduationCap size={30} />, cta: "ENTER AS TRAINEE" },
  ];

  const enter = (role: "commander" | "teamleader" | "trainee") => {
    setDomain(domain as Domain);
    setRole(role);
    navigate(`/domain/${domain}/${role === "teamleader" ? "team-leader" : role}`);
  };

  return (
    <div className="min-h-screen bg-[#070b16] grid-bg p-6 flex flex-col items-center">
      <div className="absolute right-6 top-6"><ThemeToggle /></div>
      <div className="w-full max-w-5xl mt-10">
        <button className="mb-6 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white" onClick={() => navigate("/domains")}><ArrowLeft size={14} /> BACK TO DOMAIN SELECTION</button>
        <div className="text-center mb-10">
          <p className="kicker tracking-[0.3em] text-[#9caf88]">{def.title} — {def.subtitle}</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-extrabold text-white">SELECT YOUR ROLE</h1>
          <p className="mt-2 text-slate-400">{def.description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {roles.map((c) => (
            <div key={c.role} className="panel p-6 flex flex-col items-start transition hover:-translate-y-1 hover:border-[#9caf88]/50">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#556b2f]/25 text-[#b7c79a]">{c.icon}</span>
              <h2 className="mt-4 font-display text-xl font-bold tracking-widest text-white">{c.title}</h2>
              <p className="mt-2 text-sm text-slate-400 flex-1">{c.desc}</p>
              <button onClick={() => enter(c.role)} className="mt-6 w-full rounded-xl border border-[#9caf88]/40 bg-[#556b2f]/20 py-2.5 text-sm font-bold tracking-widest text-[#d3e2b3] transition hover:bg-[#556b2f]/50 hover:text-white">
                {c.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
