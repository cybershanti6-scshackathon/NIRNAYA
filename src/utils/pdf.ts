import jsPDF from "jspdf";
import { useSim } from "../store/sim";
import { DOMAINS } from "../data/domains";

function performanceMetrics(s: ReturnType<typeof useSim.getState>) {
  const decisions = s.decisions.length;
  const reports = s.reportsSubmitted;
  const comms = s.audioLog.length + s.messages.length;
  const escalations = s.escalations;
  const decisionQuality = decisions === 0 ? 40 : Math.min(95, 60 + s.decisions.reduce((a, d) => a + d.confidence, 0) / Math.max(1, decisions) / 5);
  const infoUtilization = Math.min(98, 40 + reports * 6);
  const commEffectiveness = Math.max(25, Math.min(95, s.scenarioConfig.commReliability - Math.min(30, s.commIssues * 2) + 20));
  const resourceUtilization = Math.round(s.teams.reduce((a, t) => a + t.resource, 0) / Math.max(1, s.teams.length));
  const threatResponse = Math.max(30, 95 - escalations * 12);
  return [
    ["Decision Response Time", `${decisions} decision(s) logged — avg confidence ${decisions ? Math.round(s.decisions.reduce((a, d) => a + d.confidence, 0) / decisions) : 0}%`, decisionQuality],
    ["Information Utilization", `${reports} report(s) submitted`, infoUtilization],
    ["Communication Effectiveness", `${comms} comm event(s), ${s.commIssues} issue(s)`, commEffectiveness],
    ["Resource Utilization", `${resourceUtilization}% average readiness`, resourceUtilization],
    ["Threat Response", `${escalations} escalation(s)`, threatResponse],
  ] as [string, string, number][];
}

export function getAARData() {
  const s = useSim.getState();
  const durationSec = Math.floor((s.simTime.getTime() - s.startedAt.getTime()) / 1000);
  const mm = String(Math.floor(durationSec / 60)).padStart(2, "0");
  const ss = String(durationSec % 60).padStart(2, "0");
  const def = s.domain ? DOMAINS[s.domain] : null;
  const sc = def && s.scenarioId ? def.scenarios.find((x) => x.id === s.scenarioId) : null;
  return {
    header: {
      operation: sc ? sc.name : s.scenarioConfig.name,
      domain: s.domain ?? s.scenarioConfig.env,
      role: s.role ? s.role.toUpperCase() : "N/A",
      date: new Date().toLocaleDateString(),
      duration: `${mm}:${ss}`,
      participant: s.role === "commander" ? "Maj. S. Kapoor" : s.role === "teamleader" ? "Team Leader (Alpha)" : "Trainee",
    },
    summary: {
      objective: sc ? sc.brief : "Training simulation objective not recorded.",
      initial: sc ? `Environment: ${def?.title} — ${s.scenarioConfig.env}. Threat intensity ${s.scenarioConfig.threatIntensity}%, information reliability ${s.scenarioConfig.infoReliability}%, communication reliability ${s.scenarioConfig.commReliability}%.` : "No scenario loaded.",
      major: s.events.filter((e) => e.tone === "alert" || e.tone === "warn").slice(0, 6).map((e) => `${e.time} — ${e.message}`),
      outcome: s.escalations === 0 ? "Scenario contained with no escalation cascade." : `Scenario escalated ${s.escalations} time(s); corrective decisions required.`,
    },
    timeline: s.events.slice(0, 40).map((e) => `${e.time} — ${e.message}`),
    decisions: s.decisions.map((d) => ({ time: d.time, option: d.option, confidence: `${d.confidence}%`, affected: (d.affected ?? []).join(", ") || "—", reason: d.reason })),
    commLog: [...s.audioLog.map((a) => ({ time: a.time, from: a.from, to: a.to, type: a.type, status: a.status })), ...s.messages.map((m) => ({ time: m.time, from: m.from, to: m.to, type: "TEXT", status: "SENT" }))],
    reports: s.reports.slice(0, 12).map((r) => `${r.updated} — ${r.team}: ${r.situation} (threat ${r.threat}, confidence ${r.confidence}%)`),
    performance: performanceMetrics(s),
    overall: Math.round(performanceMetrics(s).reduce((a, p) => a + p[2], 0) / 5),
  };
}

export function downloadAARPdf() {
  const data = getAARData();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = 56;
  const line = (text: string, size = 10, bold = false, gap = 16) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 595 - margin * 2) as string[];
    for (const l of lines) {
      if (y > 780) { doc.addPage(); y = 56; }
      doc.text(l, margin, y); y += size + 4;
    }
    y += gap - size - 4 > 0 ? size / 2 : 0;
  };

  line("AFTER ACTION REVIEW — TRAINING REPORT", 18, true, 10);
  line(`Operation: ${data.header.operation}`, 11, true);
  line(`Domain: ${data.header.domain}    Role: ${data.header.role}    Date: ${data.header.date}`, 10);
  line(`Duration: ${data.header.duration}    Participant: ${data.header.participant}`, 10, false, 20);

  line("OPERATION SUMMARY", 13, true, 6);
  line(`Objective: ${data.summary.objective}`);
  line(`Initial Situation: ${data.summary.initial}`);
  line("Major Events:");
  (data.summary.major.length ? data.summary.major : ["None recorded"]).forEach((m) => line(`  • ${m}`, 10, false, 4));
  line(`Final Outcome: ${data.summary.outcome}`, 10, false, 20);

  line("TIMELINE", 13, true, 6);
  (data.timeline.length ? [...data.timeline].reverse() : ["No events recorded"]).forEach((t) => line(`  ${t}`, 9, false, 4));
  y += 12;

  line("DECISION LOG", 13, true, 6);
  if (data.decisions.length === 0) line("  No decisions recorded.", 10, false, 6);
  data.decisions.forEach((d) => line(`  ${d.time} — ${d.option} | confidence ${d.confidence} | affected: ${d.affected} | reason: ${d.reason}`, 9, false, 4));
  y += 12;

  line("COMMUNICATION LOG", 13, true, 6);
  if (data.commLog.length === 0) line("  No communication events recorded.", 10, false, 6);
  data.commLog.forEach((c) => line(`  ${c.time} — ${c.from} → ${c.to} | ${c.type} | ${c.status}`, 9, false, 4));
  y += 12;

  line("SITUATION REPORTS", 13, true, 6);
  (data.reports.length ? data.reports : ["None submitted"]).forEach((r) => line(`  ${r}`, 9, false, 4));
  y += 12;

  line("PERFORMANCE", 13, true, 6);
  data.performance.forEach(([k, v, score]) => line(`  ${k}: ${v} — score ${score}%`, 10, false, 4));
  line(`Overall Performance Score: ${data.overall}%`, 12, true);

  doc.save(`AAR_${data.header.domain}_${Date.now()}.pdf`);
}
