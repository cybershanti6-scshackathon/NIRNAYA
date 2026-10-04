import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DOMAINS, type Domain } from "../data/domains";

export type TeamStatus = "ACTIVE" | "WARNING" | "OFFLINE" | "DEGRADED";
export type CommStatus = "CONNECTED" | "STABLE" | "DEGRADED" | "OFFLINE";
export type Role = "commander" | "teamleader" | "trainee" | null;

export interface Team {
  id: string;
  name: string;
  leader: string;
  sector: string;
  members: number;
  status: TeamStatus;
  resource: number;
  requirement: string;
  communication: CommStatus;
  threat: "Low" | "Medium" | "High";
  confidence: number;
  situation: string;
  x: number;
  y: number;
  personnel: number;
  medical: number;
  water: number;
  comm: number;
  transport: number;
  signal: number;
  lastComm: string;
  delay: string;
  trail: { x: number; y: number }[];
}

export interface TimelineEvent {
  id: number;
  time: string;
  message: string;
  tone: "info" | "warn" | "alert" | "ok";
}

export interface TeamReport {
  id: number;
  team: string;
  leader: string;
  location: string;
  area?: string;
  see?: string;
  conditions?: string;
  responseTime?: string;
  situation: string;
  threat: "Low" | "Medium" | "High";
  members: number;
  available: string;
  required: string;
  confidence: number;
  updated: string;
  acknowledged?: boolean;
}

export interface Decision {
  id: number;
  option: string;
  reason: string;
  confidence: number;
  time: string;
  affected?: string[];
}

export interface CommMessage {
  id: number;
  from: string;
  to: string;
  text: string;
  time: string;
}

export interface AudioLogEntry {
  id: number;
  from: string;
  to: string;
  text: string;
  time: string;
  type: string;
  status: "RECEIVED" | "PLAYED";
}

export interface Toast {
  id: number;
  message: string;
  tone: "info" | "ok" | "warn";
}

export interface Participant {
  name: string;
  role: string;
  team: string;
  status: string;
}

export interface ScenarioConfig {
  name: string;
  type: string;
  env: "AIR" | "LAND" | "WATER" | "CYBER" | "EW";
  teams: number;
  threatIntensity: number;
  infoReliability: number;
  commReliability: number;
  resourceAvailability: number;
  eventFrequency: number;
  timePressure: number;
  limit: string;
}

export const DEFAULT_CONFIG: ScenarioConfig = {
  name: "Operation Drill",
  type: "Communication & Sector Coordination",
  env: "LAND",
  teams: 4,
  threatIntensity: 55,
  infoReliability: 70,
  commReliability: 60,
  resourceAvailability: 65,
  eventFrequency: 50,
  timePressure: 40,
  limit: "20 min",
};

interface SimState {
  role: Role;
  domain: Domain | null;
  scenario: string;
  scenarioId: string | null;
  scenarioElapsed: number;
  phasesFired: number;
  simTime: Date;
  teams: Team[];
  events: TimelineEvent[];
  reports: TeamReport[];
  decisions: Decision[];
  messages: CommMessage[];
  audioLog: AudioLogEntry[];
  listened: Record<string, boolean>;
  toasts: Toast[];
  participants: Participant[];
  reportsSubmitted: number;
  decisionsTaken: number;
  commIssues: number;
  escalations: number;
  lastDecisionElapsed: number;
  startedAt: Date;
  scenarioConfig: ScenarioConfig;

  // Settings
  simSpeed: number; // 0 = paused, 1 = 1x, 2 = 2x, 5 = 5x
  soundEnabled: boolean;
  masterVolume: number;
  notificationsEnabled: boolean;
  highContrast: boolean;

  setRole: (r: Role) => void;
  setDomain: (d: Domain | null) => void;
  setScenario: (s: string) => void;
  startScenario: (domain: Domain, scenarioId: string) => void;
  tick: () => void;
  addDecision: (d: Omit<Decision, "id" | "time">) => void;
  addReport: (r: Omit<TeamReport, "id" | "updated">) => void;
  acknowledgeReport: (id: number) => void;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  addMessage: (m: Omit<CommMessage, "id" | "time">) => void;
  addAudioLog: (a: Omit<AudioLogEntry, "id" | "time" | "status">, status?: AudioLogEntry["status"]) => void;
  markListened: (key: string) => void;
  pushToast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: number) => void;
  setScenarioConfig: (c: Partial<ScenarioConfig>) => void;
  bumpTeams: (fn: (t: Team[]) => Team[]) => void;
  setSimSpeed: (speed: number) => void;
  setSettings: (patch: Partial<{ simSpeed: number; soundEnabled: boolean; masterVolume: number; notificationsEnabled: boolean; highContrast: boolean }>) => void;
  syncRoute: (domain: Domain, role: Role) => void;
  resetSession: () => void;
}

const fmt = (d: Date) => d.toTimeString().slice(0, 8);
const clamp = (n: number, a = 15, b = 100) => Math.max(a, Math.min(b, n));

let eid = 100;
const mkEvent = (time: string, message: string, tone: TimelineEvent["tone"]): TimelineEvent => ({ id: ++eid, time, message, tone });

const COORDS: [number, number][] = [[150, 130], [560, 110], [380, 300], [690, 320]];

function buildTeams(domain: Domain): Team[] {
  const def = DOMAINS[domain];
  return def.teams.map((t, i) => ({
    id: t.id,
    name: t.name,
    leader: t.leader,
    sector: t.sector,
    members: 6 + i,
    status: (i === 2 ? "WARNING" : "ACTIVE") as TeamStatus,
    resource: 72 - i * 10,
    requirement: t.requirement,
    communication: (i === 2 ? "DEGRADED" : "CONNECTED") as CommStatus,
    threat: t.threat,
    confidence: 85 - i * 7,
    situation: t.situation,
    x: COORDS[i % COORDS.length][0],
    y: COORDS[i % COORDS.length][1],
    personnel: 6,
    medical: 70 - i * 8,
    water: 75 - i * 9,
    comm: 90 - i * 12,
    transport: 80 - i * 8,
    signal: 92 - i * 14,
    lastComm: fmt(new Date()),
    delay: `${(0.4 + i * 0.5).toFixed(1)}s`,
    trail: [
      { x: COORDS[i % COORDS.length][0] - 40, y: COORDS[i % COORDS.length][1] - 30 },
      { x: COORDS[i % COORDS.length][0] - 15, y: COORDS[i % COORDS.length][1] - 10 },
      { x: COORDS[i % COORDS.length][0], y: COORDS[i % COORDS.length][1] },
    ],
  }));
}

let aid = 0;
const getInitialDate = () => {
  const d = new Date();
  d.setSeconds(0, 0);
  return d;
};

export const useSim = create<SimState>()(
  persist(
    (set, get) => ({
      role: null,
      domain: null,
      scenario: "NO ACTIVE SCENARIO",
      scenarioId: null,
      scenarioElapsed: 0,
      phasesFired: 0,
      simTime: getInitialDate(),
      teams: buildTeams("LAND"),
      events: [mkEvent(fmt(getInitialDate()), "Command console initialised — awaiting scenario", "info")],
      reports: [],
      decisions: [],
      messages: [],
      audioLog: [],
      listened: {},
      toasts: [],
      participants: [
        { name: "Lt. Rahul Sharma", role: "Team Leader", team: "Alpha", status: "ACTIVE" },
        { name: "Lt. Arjun Patel", role: "Team Leader", team: "Bravo", status: "ACTIVE" },
        { name: "Lt. Vikram Singh", role: "Team Leader", team: "Charlie", status: "DEGRADED" },
        { name: "Maj. S. Kapoor", role: "Commander", team: "HQ", status: "ACTIVE" },
      ],
      reportsSubmitted: 0,
      decisionsTaken: 0,
      commIssues: 0,
      escalations: 0,
      lastDecisionElapsed: -999,
      startedAt: getInitialDate(),
      scenarioConfig: DEFAULT_CONFIG,

      simSpeed: 1,
      soundEnabled: true,
      masterVolume: 80,
      notificationsEnabled: true,
      highContrast: false,

      setRole: (r) => set({ role: r }),
      setDomain: (d) =>
        set(
          d
            ? {
                domain: d,
                teams: buildTeams(d),
                events: [mkEvent(fmt(get().simTime), `${DOMAINS[d].title} domain selected — select scenario to begin`, "info"), ...get().events].slice(0, 60),
              }
            : { domain: null }
        ),
      setScenario: (s) => set({ scenario: s }),
      startScenario: (domain, scenarioId) => {
        const def = DOMAINS[domain];
        const sc = def.scenarios.find((s) => s.id === scenarioId);
        if (!sc) return;
        const now = get().simTime || new Date();
        set({
          domain,
          scenario: `${sc.name.toUpperCase()} — ${def.title}`,
          scenarioId,
          scenarioElapsed: 0,
          phasesFired: 0,
          startedAt: now,
          teams: buildTeams(domain),
          events: [mkEvent(fmt(now), `Scenario started: ${sc.name} (${def.title})`, "ok"), mkEvent(fmt(now), sc.brief, "info")],
          escalations: 0,
        });
      },
      tick: () => {
        const s = get();
        if (s.simSpeed === 0) return; // paused

        const stepSeconds = s.simSpeed;
        const next = new Date(s.simTime.getTime() + stepSeconds * 1000);
        const t = s.scenarioConfig;

        // resource + signal drift influenced by sliders
        const drain = (t.threatIntensity / 100) * 0.9;
        const regen = t.resourceAvailability / 100;
        let teams = s.teams.map((tm) => {
          const jitter = () => Math.round(Math.random() * 6 - 3);
          const medical = clamp(tm.medical + jitter() - drain + regen * 0.3);
          const water = clamp(tm.water + jitter() - drain * 0.8 + regen * 0.3);
          const commFloor = t.commReliability < 45 ? 10 : tm.communication === "OFFLINE" ? 5 : 30;
          const comm = clamp(tm.comm + jitter(), commFloor, 100);
          const signalTarget = t.commReliability;
          const signal = clamp(tm.signal + Math.round(Math.random() * 10 - 5) * (signalTarget > 50 ? 1 : -1), 5, 99);
          const nx = Math.max(60, Math.min(720, tm.x + Math.round(Math.random() * 14 - 7)));
          const ny = Math.max(50, Math.min(360, tm.y + Math.round(Math.random() * 14 - 7)));
          const trail = [...tm.trail.slice(-6), { x: nx, y: ny }].slice(-6);
          return { ...tm, medical, water, comm, signal, x: nx, y: ny, trail };
        });

        let events = s.events;
        let reportsSubmitted = s.reportsSubmitted;
        let commIssues = s.commIssues;
        let escalations = s.escalations;
        let scenarioElapsed = s.scenarioElapsed;
        let phasesFired = s.phasesFired;

        if (s.scenarioId && s.domain) {
          const def = DOMAINS[s.domain];
          const sc = def.scenarios.find((x) => x.id === s.scenarioId);
          scenarioElapsed += stepSeconds;
          if (sc) {
            const speed = 1 + (t.timePressure - 50) / 100; // 0.5x .. 1.5x
            while (phasesFired < sc.phases.length && scenarioElapsed >= sc.phases[phasesFired].after / Math.max(0.5, speed)) {
              const p = sc.phases[phasesFired];
              const late = t.commReliability < 50;
              events = [mkEvent(fmt(next), late ? `[DELAYED] ${p.msg}` : p.msg, p.tone), ...events].slice(0, 60);
              phasesFired += 1;
              if (p.tone !== "ok") commIssues += 1;
            }
          }

          // event frequency: extra ambient events
          if (Math.random() < (t.eventFrequency / 100) * 0.12 * stepSeconds) {
            const pool = def.eventPool;
            events = [mkEvent(fmt(next), pool[Math.floor(Math.random() * pool.length)], "info"), ...events].slice(0, 60);
            reportsSubmitted += Math.random() > 0.6 ? 1 : 0;
          }

          // decision consequence: escalation if commander is passive under high threat
          const highThreat = teams.some((tm) => tm.threat === "High");
          if (highThreat && t.threatIntensity > 45 && scenarioElapsed > 0 && scenarioElapsed % 25 === 0 && scenarioElapsed - s.lastDecisionElapsed > 25) {
            escalations += 1;
            events = [mkEvent(fmt(next), "Threat level increased — no timely command decision logged", "alert"), ...events].slice(0, 60);
            teams = teams.map((tm) => (tm.threat === "Medium" ? { ...tm, threat: "High" as const } : tm));
            commIssues += 1;
          }

          // low info reliability produces conflicting reports
          if (t.infoReliability < 50 && scenarioElapsed % 17 === 0) {
            events = [mkEvent(fmt(next), "Conflicting report received — information reliability low", "warn"), ...events].slice(0, 60);
          }
        }

        set({ simTime: next, teams, events, reportsSubmitted, commIssues, escalations, scenarioElapsed, phasesFired });
      },
      addDecision: (d) =>
        set((s) => {
          const teams = s.teams.map((tm) =>
            d.affected?.includes(tm.name)
              ? { ...tm, threat: tm.threat === "High" ? ("Medium" as const) : tm.threat, situation: "Response coordinated after command decision" }
              : tm
          );
          return {
            teams,
            decisions: [{ ...d, id: Date.now(), time: fmt(s.simTime) }, ...s.decisions],
            decisionsTaken: s.decisionsTaken + 1,
            lastDecisionElapsed: s.scenarioElapsed,
            events: [mkEvent(fmt(s.simTime), `Command decision recorded: ${d.option}`, "ok"), ...s.events].slice(0, 60),
          };
        }),
      addReport: (r) =>
        set((s) => ({
          reports: [{ ...r, id: Date.now(), updated: fmt(s.simTime).slice(0, 5) }, ...s.reports],
          reportsSubmitted: s.reportsSubmitted + 1,
          events: [mkEvent(fmt(s.simTime), `${r.team} submitted a situation report`, "ok"), ...s.events].slice(0, 60),
        })),
      acknowledgeReport: (id) =>
        set((s) => ({
          reports: s.reports.map((r) => (r.id === id ? { ...r, acknowledged: true } : r)),
          events: [mkEvent(fmt(s.simTime), `Situation report #${id} acknowledged by Commander`, "ok"), ...s.events].slice(0, 60),
        })),
      updateTeam: (id, patch) => set((s) => ({ teams: s.teams.map((tm) => (tm.id === id ? { ...tm, ...patch } : tm)) })),
      addMessage: (m) =>
        set((s) => ({
          messages: [...s.messages, { ...m, id: Date.now(), time: fmt(s.simTime).slice(0, 5) }],
          events: [mkEvent(fmt(s.simTime), `Comms: ${m.from} → ${m.to}: "${m.text.slice(0, 35)}..."`, "info"), ...s.events].slice(0, 60),
        })),
      addAudioLog: (a, status = "RECEIVED") =>
        set((s) => ({
          audioLog: [...s.audioLog, { ...a, id: ++aid, time: fmt(s.simTime).slice(0, 5), status }],
          events: [mkEvent(fmt(s.simTime), `Voice Dispatch: ${a.from} → ${a.to}`, "info"), ...s.events].slice(0, 60),
        })),
      markListened: (key) => set((s) => ({ listened: { ...s.listened, [key]: true } })),
      pushToast: (message, tone = "info") => {
        if (!get().notificationsEnabled) return;
        set((s) => ({ toasts: [...s.toasts, { id: Date.now() + Math.random(), message, tone }] }));
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      setScenarioConfig: (c) => set((s) => ({ scenarioConfig: { ...s.scenarioConfig, ...c } })),
      bumpTeams: (fn) => set((s) => ({ teams: fn(s.teams) })),
      setSimSpeed: (speed) => set({ simSpeed: speed }),
      setSettings: (patch) => set((s) => ({ ...s, ...patch })),
      syncRoute: (domain, role) => {
        const s = get();
        const updates: Partial<SimState> = {};
        if (s.domain !== domain) {
          updates.domain = domain;
          if (!s.scenarioId) {
            updates.teams = buildTeams(domain);
          }
        }
        if (s.role !== role) {
          updates.role = role;
        }
        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      },
      resetSession: () => {
        const d = getInitialDate();
        set({
          role: null,
          domain: null,
          scenario: "NO ACTIVE SCENARIO",
          scenarioId: null,
          scenarioElapsed: 0,
          phasesFired: 0,
          simTime: d,
          teams: buildTeams("LAND"),
          events: [mkEvent(fmt(d), "Command console initialised — awaiting scenario", "info")],
          reports: [],
          decisions: [],
          messages: [],
          audioLog: [],
          listened: {},
          toasts: [],
          reportsSubmitted: 0,
          decisionsTaken: 0,
          commIssues: 0,
          escalations: 0,
          lastDecisionElapsed: -999,
          startedAt: d,
          scenarioConfig: DEFAULT_CONFIG,
        });
      },
    }),
    {
      name: "signalbreak-sim-storage",
      partialize: (s) => ({
        role: s.role,
        domain: s.domain,
        scenario: s.scenario,
        scenarioId: s.scenarioId,
        scenarioElapsed: s.scenarioElapsed,
        phasesFired: s.phasesFired,
        simTime: s.simTime instanceof Date ? s.simTime.toISOString() : s.simTime,
        startedAt: s.startedAt instanceof Date ? s.startedAt.toISOString() : s.startedAt,
        teams: s.teams,
        events: s.events,
        reports: s.reports,
        decisions: s.decisions,
        messages: s.messages,
        audioLog: s.audioLog,
        listened: s.listened,
        participants: s.participants,
        reportsSubmitted: s.reportsSubmitted,
        decisionsTaken: s.decisionsTaken,
        commIssues: s.commIssues,
        escalations: s.escalations,
        scenarioConfig: s.scenarioConfig,
        simSpeed: s.simSpeed,
        soundEnabled: s.soundEnabled,
        masterVolume: s.masterVolume,
        notificationsEnabled: s.notificationsEnabled,
        highContrast: s.highContrast,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.simTime && typeof state.simTime === "string") {
            state.simTime = new Date(state.simTime);
          } else if (!state.simTime) {
            state.simTime = getInitialDate();
          }
          if (state.startedAt && typeof state.startedAt === "string") {
            state.startedAt = new Date(state.startedAt);
          } else if (!state.startedAt) {
            state.startedAt = getInitialDate();
          }
        }
      },
    }
  )
);
