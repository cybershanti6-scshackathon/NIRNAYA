import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { ClipboardList, History, LayoutDashboard, MessageSquare, Package, Users } from "lucide-react";
import { Shell } from "../../components/layout/Shell";
import { DOMAINS, type Domain } from "../../data/domains";
import { TLDashboard } from "./TLDashboard";
import { TLReport } from "./TLReport";
import { TLMembers } from "./TLMembers";
import { TLResources } from "./TLResources";
import { TLCommunication } from "./TLCommunication";
import { TLHistory } from "./TLHistory";

export function TeamLeaderApp() {
  const { domain } = useParams();
  const def = DOMAINS[domain as Domain];
  return (
    <Shell
      title={`${def?.title ?? ""} — TEAM LEADER`}
      items={[
        { to: "", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { to: "report", label: "Situation Report", icon: <ClipboardList size={16} /> },
        { to: "members", label: "Team Members", icon: <Users size={16} /> },
        { to: "resources", label: "Resources", icon: <Package size={16} /> },
        { to: "communication", label: "Communication", icon: <MessageSquare size={16} /> },
        { to: "history", label: "History", icon: <History size={16} /> },
      ]}
    >
      <Routes>
        <Route path="/" element={<TLDashboard />} />
        <Route path="/report" element={<TLReport />} />
        <Route path="/members" element={<TLMembers />} />
        <Route path="/resources" element={<TLResources />} />
        <Route path="/communication" element={<TLCommunication />} />
        <Route path="/history" element={<TLHistory />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </Shell>
  );
}
