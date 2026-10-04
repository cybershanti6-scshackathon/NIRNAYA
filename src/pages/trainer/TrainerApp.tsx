import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { BarChart3, ClipboardList, GraduationCap, LayoutDashboard, Radar, Users } from "lucide-react";
import { Shell } from "../../components/layout/Shell";
import { DOMAINS, type Domain } from "../../data/domains";
import { TrDashboard } from "./TrDashboard";
import { CreateScenario } from "./CreateScenario";
import { Participants } from "./Participants";
import { TrMonitoring } from "./TrMonitoring";
import { Performance } from "./Performance";
import { AAR } from "./AAR";

export function TrainerApp() {
  const { domain } = useParams();
  const def = DOMAINS[domain as Domain];
  return (
    <Shell
      title={`${def?.title ?? ""} — TRAINEE`}
      items={[
        { to: "", label: "Training Dashboard", icon: <LayoutDashboard size={16} /> },
        { to: "scenario", label: "Create Scenario", icon: <GraduationCap size={16} /> },
        { to: "participants", label: "Participants", icon: <Users size={16} /> },
        { to: "monitoring", label: "Live Monitoring", icon: <Radar size={16} /> },
        { to: "performance", label: "Performance", icon: <BarChart3 size={16} /> },
        { to: "aar", label: "After Action Review", icon: <ClipboardList size={16} /> },
      ]}
    >
      <Routes>
        <Route path="/" element={<TrDashboard />} />
        <Route path="/scenario" element={<CreateScenario />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/monitoring" element={<TrMonitoring />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/aar" element={<AAR />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </Shell>
  );
}
