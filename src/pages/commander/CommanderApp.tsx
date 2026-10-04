import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { FileText, LayoutDashboard, Map, Radar, ScrollText, Settings, Swords } from "lucide-react";
import { Shell } from "../../components/layout/Shell";
import { DOMAINS, type Domain } from "../../data/domains";
import { Dashboard } from "./Dashboard";
import { Reports } from "./Reports";
import { Monitoring } from "./Monitoring";
import { Scenarios } from "./Scenarios";
import { Decision } from "./Decision";
import { HQReport } from "./HQReport";
import { SettingsPage } from "./SettingsPage";

export function CommanderApp() {
  const { domain } = useParams();
  const def = DOMAINS[domain as Domain];
  return (
    <Shell
      title={`${def?.title ?? ""} — COMMANDER`}
      items={[
        { to: "", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { to: "reports", label: "Team Reports", icon: <FileText size={16} /> },
        { to: "monitoring", label: "Live Monitoring", icon: <Radar size={16} /> },
        { to: "scenarios", label: "Scenarios", icon: <Map size={16} /> },
        { to: "decision", label: "Decision Center", icon: <Swords size={16} /> },
        { to: "hq-report", label: "HQ Report", icon: <ScrollText size={16} /> },
        { to: "settings", label: "Settings", icon: <Settings size={16} /> },
      ]}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/decision" element={<Decision />} />
        <Route path="/hq-report" element={<HQReport />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </Shell>
  );
}
