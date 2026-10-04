import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PlusCircle, Send, CheckCircle2, FileText, Check } from "lucide-react";
import { useSim, type TeamReport } from "../../store/sim";
import { DOMAINS, type Domain } from "../../data/domains";
import { Modal, StatusBadge } from "../../components/ui/common";

export function TeamReportsPage() {
  const { domain, role: roleParam } = useParams();
  const {
    reports,
    teams,
    acknowledgeReport,
    addReport,
    pushToast,
    domain: storeDomain,
  } = useSim();

  const currentDomain = (domain?.toUpperCase() as Domain) || storeDomain || "LAND";
  const def = DOMAINS[currentDomain] || DOMAINS.LAND;
  const roleSlug = roleParam || "commander";

  // Filter states
  const [filterTeam, setFilterTeam] = useState("ALL");
  const [filterThreat, setFilterThreat] = useState("ALL");
  const [filterLocation, setFilterLocation] = useState("ALL");
  const [filterComm, setFilterComm] = useState("ALL");
  const [sortDesc, setSortDesc] = useState(true);
  const [openModalId, setOpenModalId] = useState<number | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(roleSlug === "team-leader");

  // Form state for creating a new report (Team Leader or quick submission)
  const defaultTeam = teams[0] || { name: "TEAM ALPHA", leader: "Rahul Sharma", sector: "Sector A" };
  const [formData, setFormData] = useState({
    team: defaultTeam.name,
    leader: defaultTeam.leader,
    location: defaultTeam.sector,
    area: `${defaultTeam.sector}-1`,
    situation: "Tactical sweep in progress; observing sector perimeter.",
    see: "Movement detected in sector grid corridor; no hostile contact confirmed.",
    conditions: "Clear visibility, atmospheric conditions nominal.",
    threat: "Medium" as "Low" | "Medium" | "High",
    members: 8,
    available: "Standard Loadout, Medical Kit",
    required: "Additional Recon Support",
    confidence: 85,
    commStatus: "CONNECTED",
  });

  const locations = useMemo(() => {
    return Array.from(new Set(reports.map((r) => r.location).filter(Boolean)));
  }, [reports]);

  const filteredReports = useMemo(() => {
    let list = reports;
    if (filterTeam !== "ALL") list = list.filter((r) => r.team === filterTeam);
    if (filterThreat !== "ALL") list = list.filter((r) => r.threat === filterThreat);
    if (filterLocation !== "ALL") list = list.filter((r) => r.location === filterLocation);
    if (filterComm !== "ALL") {
      list = list.filter((r) => (filterComm === "CONNECTED" ? r.confidence > 70 : r.confidence <= 70));
    }
    return [...list].sort((a, b) => (sortDesc ? b.id - a.id : a.id - b.id));
  }, [reports, filterTeam, filterThreat, filterLocation, filterComm, sortDesc]);

  const selectedReport = reports.find((r) => r.id === openModalId);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.situation.trim()) {
      pushToast("Please enter a situation description.", "warn");
      return;
    }

    addReport({
      team: formData.team,
      leader: formData.leader,
      location: formData.location,
      area: formData.area,
      see: formData.see,
      conditions: formData.conditions,
      situation: formData.situation,
      threat: formData.threat,
      members: Number(formData.members),
      available: formData.available,
      required: formData.required,
      confidence: Number(formData.confidence),
      responseTime: "1.8 min",
    });

    pushToast(`Situation report from ${formData.team} submitted to Commander.`, "ok");
    if (roleSlug !== "team-leader") {
      setShowSubmitForm(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="panel p-5 bg-black/40 border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker text-[#b7c79a]">FIELD INTELLIGENCE • {def.title}</p>
          <h1 className="text-xl font-black text-white font-display mt-0.5 tracking-wide">
            TEAM SITUATION REPORTS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Structured tactical telemetry transmitted by field units. Reports are integrated into the real-time simulation picture and AAR metrics.
          </p>
        </div>
        <button
          onClick={() => setShowSubmitForm(!showSubmitForm)}
          className="btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] inline-flex items-center gap-2 text-xs font-bold px-4 py-2"
        >
          {showSubmitForm ? <FileText size={15} /> : <PlusCircle size={15} />}
          {showSubmitForm ? "VIEW REPORTS LIST" : "CREATE NEW REPORT"}
        </button>
      </div>

      {/* Submit Report Form Section */}
      {showSubmitForm && (
        <form onSubmit={handleSubmitReport} className="panel p-6 bg-black/40 border-white/10 space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="font-display text-base font-bold text-white tracking-wider flex items-center gap-2">
                <Send size={16} className="text-[#9caf88]" /> SUBMIT SITUATION REPORT
              </h2>
              <p className="text-xs text-slate-400">Fill in tactical telemetry and transmit directly to the Commander console.</p>
            </div>
            <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
              CONFIDENCE {formData.confidence}%
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <label className="text-slate-400">
              TEAM UNIT
              <select
                className="input mt-1"
                value={formData.team}
                onChange={(e) => {
                  const tm = teams.find((t) => t.name === e.target.value);
                  setFormData({
                    ...formData,
                    team: e.target.value,
                    leader: tm?.leader || formData.leader,
                    location: tm?.sector || formData.location,
                  });
                }}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </label>

            <label className="text-slate-400">
              TEAM LEADER NAME
              <input
                className="input mt-1"
                value={formData.leader}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
              />
            </label>

            <label className="text-slate-400">
              LOCATION / SECTOR
              <input
                className="input mt-1"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </label>

            <label className="text-slate-400">
              SUB-SECTOR / AREA
              <input
                className="input mt-1"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </label>

            <label className="text-slate-400">
              THREAT LEVEL
              <select
                className="input mt-1"
                value={formData.threat}
                onChange={(e) => setFormData({ ...formData, threat: e.target.value as "Low" | "Medium" | "High" })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label className="text-slate-400">
              COMMUNICATION STATUS
              <select
                className="input mt-1"
                value={formData.commStatus}
                onChange={(e) => setFormData({ ...formData, commStatus: e.target.value })}
              >
                <option value="CONNECTED">Connected</option>
                <option value="STABLE">Stable</option>
                <option value="DEGRADED">Degraded</option>
              </select>
            </label>

            <label className="text-slate-400 sm:col-span-2 lg:col-span-3">
              CURRENT SITUATION
              <input
                className="input mt-1"
                value={formData.situation}
                onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                placeholder="Describe current operational status..."
              />
            </label>

            <label className="text-slate-400 sm:col-span-2 lg:col-span-3">
              WHAT DO YOU SEE? (OBSERVATIONS)
              <input
                className="input mt-1"
                value={formData.see}
                onChange={(e) => setFormData({ ...formData, see: e.target.value })}
              />
            </label>

            <label className="text-slate-400">
              AVAILABLE RESOURCES
              <input
                className="input mt-1"
                value={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.value })}
              />
            </label>

            <label className="text-slate-400 sm:col-span-2">
              REQUIRED RESOURCES / ASSISTANCE
              <input
                className="input mt-1"
                value={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.value })}
              />
            </label>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>REPORT CONFIDENCE LEVEL</span>
              <span className="font-mono text-emerald-300 font-bold">{formData.confidence}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={formData.confidence}
              onChange={(e) => setFormData({ ...formData, confidence: Number(e.target.value) })}
              className="w-full accent-[#9caf88] h-2 bg-slate-700 rounded cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] inline-flex items-center gap-2 px-8 py-3 text-xs font-bold"
            >
              <Send size={14} /> SEND REPORT
            </button>
          </div>
        </form>
      )}

      {/* Reports List Section with Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="input !w-auto text-xs py-1.5"
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              aria-label="Filter by team"
            >
              <option value="ALL">Team: All</option>
              {teams.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>

            <select
              className="input !w-auto text-xs py-1.5"
              value={filterThreat}
              onChange={(e) => setFilterThreat(e.target.value)}
              aria-label="Filter by threat"
            >
              <option value="ALL">Threat: All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              className="input !w-auto text-xs py-1.5"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              aria-label="Filter by location"
            >
              <option value="ALL">Location: All</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select
              className="input !w-auto text-xs py-1.5"
              value={filterComm}
              onChange={(e) => setFilterComm(e.target.value)}
              aria-label="Filter by comms"
            >
              <option value="ALL">Comms: All</option>
              <option value="CONNECTED">Connected (&gt;70%)</option>
              <option value="DEGRADED">Degraded (≤70%)</option>
            </select>

            <button
              className="btn-ghost text-xs py-1.5"
              onClick={() => setSortDesc(!sortDesc)}
            >
              Sort: {sortDesc ? "Newest First" : "Oldest First"}
            </button>
          </div>

          <span className="text-xs text-slate-400">
            Showing {filteredReports.length} of {reports.length} report(s)
          </span>
        </div>

        {/* Section 30 Empty State */}
        {filteredReports.length === 0 ? (
          <div className="panel p-10 text-center bg-black/40 border-white/10 max-w-lg mx-auto my-8">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-800 text-slate-400 mb-3">
              <FileText size={24} />
            </span>
            <h3 className="font-display text-lg font-bold text-white mb-1">NO REPORTS YET</h3>
            <p className="text-xs text-slate-400 mb-4">
              Team reports will appear here when received from field units.
            </p>
            <button
              onClick={() => setShowSubmitForm(true)}
              className="btn-primary !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] text-xs font-bold px-6 py-2 inline-flex items-center gap-2"
            >
              <PlusCircle size={14} /> SUBMIT FIRST REPORT
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredReports.map((r: TeamReport) => (
              <div
                key={r.id}
                className="panel p-5 space-y-3 bg-black/40 border-white/10 hover:border-[#9caf88]/40 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white tracking-wider text-sm">{r.team}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Lead: {r.leader} • {r.location} {r.area ? `(${r.area})` : ""}
                      </p>
                    </div>
                    <StatusBadge status={r.threat} />
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium bg-white/[0.02] p-2 rounded border border-white/5">
                    “{r.situation}”
                  </p>

                  <div className="text-[11px] space-y-1 text-slate-400">
                    <p><span className="text-slate-500">Visual:</span> {r.see || "None noted"}</p>
                    <p>
                      <span className="text-slate-500">Available:</span> {r.available}
                    </p>
                    <p>
                      <span className="text-slate-500">Required:</span>{" "}
                      <span className="text-amber-300 font-semibold">{r.required}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-400">{r.updated}</span>
                    {r.acknowledged ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 size={10} /> ACK&apos;D
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        PENDING
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs font-bold text-[#9caf88] hover:text-white transition"
                      onClick={() => setOpenModalId(r.id)}
                    >
                      VIEW
                    </button>
                    {!r.acknowledged && (
                      <button
                        className="text-xs font-bold text-sky-300 hover:text-sky-200 transition inline-flex items-center gap-1"
                        onClick={() => {
                          acknowledgeReport(r.id);
                          pushToast(`${r.team} report acknowledged.`, "ok");
                        }}
                      >
                        <Check size={12} /> ACK
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Report Modal */}
      <Modal
        open={!!selectedReport}
        onClose={() => setOpenModalId(null)}
        title={selectedReport ? `TACTICAL REPORT — ${selectedReport.team}` : ""}
      >
        {selectedReport && (
          <div className="space-y-2.5 text-xs text-slate-300">
            {[
              ["Team Unit", selectedReport.team],
              ["Team Leader", selectedReport.leader],
              ["Location / Sector", selectedReport.location],
              ["Area / Subsector", selectedReport.area || "—"],
              ["Situation Description", selectedReport.situation],
              ["Observations (What They See)", selectedReport.see || "—"],
              ["Environmental Conditions", selectedReport.conditions || "—"],
              ["Threat Level", selectedReport.threat],
              ["Personnel Count", String(selectedReport.members)],
              ["Available Resources", selectedReport.available],
              ["Required Support", selectedReport.required],
              ["Confidence Level", `${selectedReport.confidence}%`],
              ["Time Transmitted", selectedReport.updated],
              ["Status", selectedReport.acknowledged ? "Acknowledged by Commander" : "Pending Review"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2 border-b border-white/5 pb-1.5">
                <span className="w-40 text-slate-400 font-semibold">{k}:</span>
                <span className="flex-1 font-medium text-white">{v}</span>
              </div>
            ))}

            {!selectedReport.acknowledged && (
              <div className="pt-3 flex justify-end">
                <button
                  className="btn-primary text-xs px-5 py-2 inline-flex items-center gap-1.5"
                  onClick={() => {
                    acknowledgeReport(selectedReport.id);
                    pushToast("Report marked as acknowledged.", "ok");
                    setOpenModalId(null);
                  }}
                >
                  <Check size={14} /> ACKNOWLEDGE REPORT
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
