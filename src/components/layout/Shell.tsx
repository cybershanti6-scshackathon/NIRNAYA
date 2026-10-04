import { useState, type ReactNode } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Shield,
  X,
} from "lucide-react";
import { useSim } from "../../store/sim";
import { Toasts } from "../ui/Toasts";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Shell({
  title,
  items,
  children,
}: {
  title: string;
  items: { to: string; label: string; icon: ReactNode }[];
  children: ReactNode;
}) {
  const { scenario, simTime, resetSession, events } = useSim();
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { domain: domainParam } = useParams();
  const domain = domainParam ?? "";

  const logout = () => {
    resetSession();
    navigate("/", { replace: true });
  };

  const roleLabels: Record<string, string> = {
    commander: "COMMANDER",
    "team-leader": "TEAM LEADER",
    trainee: "TRAINEE",
  };
  const roleSlug = location.pathname.split("/")[3] ?? "";
  const roleLabel = roleLabels[roleSlug] ?? "";

  const navItems = items;
  const roleHomeSlug = location.pathname.split("/")[3] ?? "";
  const basePath = domain && roleHomeSlug ? `/domain/${domain}/${roleHomeSlug}` : "/";
  const navHref = (to: string) => (to ? `${basePath}/${to}` : basePath);

  // Determine current active section for breadcrumb
  const currentPath = location.pathname;
  const lastSegment = currentPath.split("/").filter(Boolean).pop() ?? "";
  const matched = navItems.find((it) => it.to === lastSegment || (it.to === "" && (lastSegment === roleSlug || lastSegment === "")));
  const currentSection = matched?.label ?? navItems[0]?.label ?? "Dashboard";

  return (
    <div className="app-shell grid-bg min-h-screen">
      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#556b2f]/30 text-[#b7c79a] border border-[#9caf88]/30">
              <Shield size={18} />
            </span>
            <div>
              <p className="text-sm font-bold tracking-widest text-white">{title}</p>
              <p className="text-[10px] text-slate-400 tracking-wider">SIH 248 OPS CONSOLE</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {navItems.map((it) => (
            <NavLink
              key={it.label}
              to={navHref(it.to)}
              end={true}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wider transition ${
                  isActive
                    ? "bg-[#556b2f]/35 text-[#d3e2b3] border border-[#9caf88]/40 shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {it.icon}
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {open && <div className="overlay md:hidden" onClick={() => setOpen(false)} />}

      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 glass rounded-none border-x-0 border-t-0 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-slate-300 hover:text-white p-1"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb Context (Section 14) */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto whitespace-nowrap py-1">
              <button
                onClick={() => navigate("/")}
                className="hover:text-white flex items-center gap-1 font-semibold transition"
              >
                <Home size={13} /> Home
              </button>
              <ChevronRight size={12} className="text-slate-600 shrink-0" />
              <button
                onClick={() => navigate(`/domain/${domain}`)}
                className="hover:text-white font-bold text-slate-300 transition"
              >
                {domain}
              </button>
              <ChevronRight size={12} className="text-slate-600 shrink-0" />
              <button
                onClick={() => navigate(`/domain/${domain}/${roleSlug}`)}
                className="hover:text-white font-semibold text-slate-300 transition"
              >
                {roleLabel}
              </button>
              <ChevronRight size={12} className="text-slate-600 shrink-0" />
              <span className="font-extrabold text-[#b7c79a]">
                {currentSection}
              </span>
            </nav>

            {/* Right Meta Controls */}
            <div className="ml-auto flex items-center gap-3 sm:gap-4 shrink-0">
              <span className="hidden xl:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-emerald-400">
                <span className="status-dot bg-emerald-500 pulse-green" /> NOMINAL
              </span>

              <div className="hidden lg:block text-right">
                <p className="text-[9px] text-slate-400 tracking-widest font-semibold">SCENARIO</p>
                <p className="text-xs font-semibold text-slate-200 truncate max-w-[180px]">
                  {scenario.replace("SCENARIO ", "SCN ")}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[9px] text-slate-400 tracking-widest font-semibold">SIM TIME</p>
                <p className="text-xs font-mono font-bold text-emerald-300">
                  {simTime instanceof Date ? simTime.toTimeString().slice(0, 8) : "--:--:--"}
                </p>
              </div>

              <ThemeToggle />

              <div className="relative">
                <button
                  onClick={() => setBell(!bell)}
                  className="relative grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition"
                  aria-label="Events notification"
                >
                  <Bell size={16} />
                  {events.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                  {events.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </button>

                {bell && (
                  <div className="absolute right-0 mt-3 w-80 panel p-3 text-xs text-slate-300 space-y-2 shadow-2xl z-50 animate-fade-in-up">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="font-bold text-white tracking-wider">RECENT DISPATCHES</span>
                      <button onClick={() => setBell(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>
                    {events.slice(0, 5).map((e) => (
                      <p key={e.id} className="border-b border-white/5 pb-1 text-[11px]">
                        <span className="font-mono text-emerald-400">{e.time}</span> — {e.message}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#556b2f]/40 text-xs font-extrabold text-[#c9d8ac] border border-[#9caf88]/40">
                {domain ? domain.slice(0, 1) : "•"}
              </span>
            </div>
          </div>
        </header>

        {/* Main Routed Content */}
        <main className="p-4 md:p-6 space-y-6 flex-1">{children}</main>
      </div>
      <Toasts />
    </div>
  );
}
