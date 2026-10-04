import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useSim } from "./store/sim";
import { DOMAIN_IDS } from "./data/domains";
import { HomePage } from "./pages/HomePage";
import { DomainsPage } from "./pages/DomainsPage";
import { DomainSelect } from "./pages/DomainSelect";
import { CommanderApp } from "./pages/commander/CommanderApp";
import { TeamLeaderApp } from "./pages/teamleader/TeamLeaderApp";
import { TrainerApp } from "./pages/trainer/TrainerApp";

function SimEngine() {
  const tick = useSim((s) => s.tick);
  useEffect(() => {
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [tick]);
  return null;
}

function Guard({ role, children }: { role: "commander" | "teamleader" | "trainee"; children: ReactNode }) {
  const current = useSim((s) => s.role);
  if (current !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// keeps the store domain in sync with the URL so a page refresh / deep link is safe
function DomainSync({ children }: { children: ReactNode }) {
  const { domain } = useParams();
  const storeDomain = useSim((s) => s.domain);
  const setDomain = useSim((s) => s.setDomain);
  useEffect(() => {
    if (domain && DOMAIN_IDS.includes(domain as never) && storeDomain !== domain) setDomain(domain as never);
  }, [domain, storeDomain, setDomain]);
  return <>{children}</>;
}

function Logout() {
  const setRole = useSim((s) => s.setRole);
  const navigate = useNavigate();
  useEffect(() => {
    setRole(null);
    navigate("/", { replace: true });
  }, [setRole, navigate]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SimEngine />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/domains" element={<DomainsPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/domain/:domain" element={<DomainSelect />} />
        <Route path="/domain/:domain/commander/*" element={<DomainSync><Guard role="commander"><CommanderApp /></Guard></DomainSync>} />
        <Route path="/domain/:domain/team-leader/*" element={<DomainSync><Guard role="teamleader"><TeamLeaderApp /></Guard></DomainSync>} />
        <Route path="/domain/:domain/trainee/*" element={<DomainSync><Guard role="trainee"><TrainerApp /></Guard></DomainSync>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
