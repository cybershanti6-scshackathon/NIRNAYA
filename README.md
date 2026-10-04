# 🎯 NIRNAYA — Unified Command & Decision Platform

> **Multi-Domain Operational Training + Unified Information + Command Decision Support**

NIRNAYA is a web-based **command and decision-support training platform** built for multi-domain operational scenarios. It consolidates information coming from different teams and operational domains into a single decision environment, so commanders, team leaders, and trainees can rehearse situation assessment, threat evaluation, resource awareness, and decision logging — under realistic uncertainty and degraded communication.

---

## 📚 Table of Contents

1. [Problem Overview](#-problem-overview)
2. [Our Solution](#-our-solution)
3. [Key Features](#-key-features)
4. [System Workflow](#-system-workflow)
5. [System Architecture](#-system-architecture)
6. [Multi-Domain Operational Architecture](#-multi-domain-operational-architecture)
7. [Command & Decision Workflow](#-command--decision-workflow)
8. [Scenario / Simulation System](#-scenario--simulation-system)
9. [Communication & Information Flow](#-communication--information-flow)
10. [Decision Logging / Performance Analysis](#-decision-logging--performance-analysis)
11. [Technology Stack](#-technology-stack)
12. [Project Structure](#-project-structure)
13. [Quick Start](#-quick-start)
14. [Environment Variables](#-environment-variables)
15. [How to Use NIRNAYA](#-how-to-use-nirnaya)
16. [API Overview](#-api-overview)
17. [Documentation](#-documentation)
18. [Screenshots](#-screenshots)
19. [Demo](#-demo)
20. [Prototype Scope & Limitations](#-prototype-scope--limitations)
21. [Future Scope](#-future-scope)
22. [Team](#-team)

---

## 🧩 Problem Overview

In real multi-domain operations, information is **fragmented**:

- Teams in different theatres report situation, threat, and resources **separately**.
- Communication links can become **disrupted or degraded** exactly when information is most needed.
- Threat indicators arrive from different operational domains — AIR, LAND, CYBER, and EW — with no single consolidated view.
- Commanders must build a mental picture from partial, sometimes conflicting, reports.
- There is limited visibility of **available vs required resources** across teams.
- Decisions made under time pressure are rarely **tracked, explained, or reviewed** afterwards.
- Trainees get little structured feedback on **why** a decision failed or succeeded.

The core training problem: *getting a unified operational picture and making timely, explainable decisions when information is incomplete and communications are unreliable.*

---

## 💡 Our Solution

NIRNAYA provides a centralized, browser-based command and training console:

```text
Operational Scenario
        ↓
Team / Participant Inputs
        ↓
Domain Information (AIR / LAND / CYBER / EW)
        ↓
Centralized Operational Picture
        ↓
Threat & Situation Assessment
        ↓
Commander Decision
        ↓
Decision Logging
        ↓
Performance Analysis
        ↓
After-Action Review
```

---

## ✨ Key Features

### 1. 🌐 Multi-Domain Operations

Scenario coverage across four operational domains, each with its own scenario library, team definitions, communication scripts, and event pool:

| Domain  | Theme                                                        |
| ------- | ------------------------------------------------------------ |
| **AIR**   | Airspace monitoring, interceptor scrambles, radar & aerial threat decisions |
| **LAND**  | Ground sector operations, convoy security, border/checkpoint scenarios      |
| **CYBER** | Intrusions, network telemetry anomalies, incident response                |
| **EW**    | Electronic warfare, sensor degradation, countermeasure decisions            |

### 2. 🎛️ Scenario Configuration

- Trainees can create/configure a scenario (`Create Scenario`): name, type, environment, number of teams, time limit, and six operational parameters — threat intensity, information reliability, communication reliability, resource availability, event frequency, and time pressure.
- Commanders load predefined per-domain scenarios (`Scenarios`).
- A shared `ScenarioSelectPage` defines selectable scenario cards per domain.

### 3. 👥 Multi-Participant Simulation (Roles)

Three roles are implemented, each with its own console:

| Role | Console | Capabilities |
| ---- | ------- | ------------ |
| **Commander** | `CommanderApp` | Dashboard, Team Reports, Live Monitoring, Scenarios, Decision Center, HQ Report, Settings |
| **Team Leader** | `TeamLeaderApp` | Dashboard, Situation Report, Team Members, Resources, Communication, History |
| **Trainee** | `TrainerApp` | Training Dashboard, Create Scenario, Participants, Live Monitoring, Performance, After Action Review |

### 4. 📝 Operational Information Sharing

Team leaders file structured situation reports containing (actual fields in the prototype):

- Team name, team leader name, team members
- Current location & area name
- Current situation, observations (`What do you see?`), observed conditions
- Simulated threat level (Low / Medium / High)
- Confidence level (%)
- Available resources & required resources

### 5. 🗺️ Unified Operational Picture

- Command dashboards aggregate team status, reports submitted, decisions taken, communication issues, escalations, and the active scenario.
- Map, timeline, and monitoring panels present live simulated telemetry.
- The `DomainArchitecture` view (added to each domain's Scenario section) shows the vertical AIR → LAND → CYBER → EW operational architecture with an adjustment bar for domain block spacing.

### 6. 📡 Communication Degradation

- The simulation engine models **communication reliability**: low reliability raises `commIssues`, injects alert events, and degrades information flow.
- Per-domain communication scripts (voice/report/command/alert) are provided; audio message assets are bundled under `public/audio/{air,land,cyber,ew}/`.
- An `AudioCommandModal` lets users issue logged voice-style commands into the running scenario.

### 7. ⚔️ Real-Time Decision Making

- The Decision Center offers decision options (A–D), a confidence slider, affected-team selection, and a free-text rationale.
- Confirming a decision records a timestamped, scored entry into the decision log.

### 8. 🗃️ Event & Decision Logging

- Every scenario tick generates events (info/warn/alert/ok), phase transitions, and escalations in a rolling event stream.
- Decisions are logged with option, reason, confidence, affected teams, and timestamp.

### 9. 📊 Performance Analysis

- The trainee Performance view and HQ report derive metrics from the live scenario: reports submitted, decisions taken, communication issues, escalations, and time limits.
- The `src/utils/pdf.ts` utility compiles scenario data into a downloadable report (jsPDF + html2canvas).

### 10. 📋 After-Action Review (AAR)

- The AAR view compiles the live scenario — timeline, decisions, communications, reports, and performance — into a review document, available only after a scenario has been exercised.

---

## 🔁 System Workflow

```text
Scenario Configuration
        ↓
Scenario Generation (per-domain phases & events)
        ↓
Multi-Participant Simulation (Commander / Team Leader / Trainee)
        ↓
Multi-Domain Information Collection
        ↓
Communication / Information Degradation
        ↓
Unified Operational Picture
        ↓
Threat & Situation Assessment
        ↓
Commander Decision
        ↓
Event & Decision Logging
        ↓
Performance Analysis
        ↓
After-Action Review
```

---

## 🏗️ System Architecture

NIRNAYA is currently a **frontend-only React application**. All simulation state lives in the browser (Zustand store, persisted to `localStorage`); there is no backend, database, or hosted API in the current prototype.

```text
┌──────────────────────────────────────────────────┐
│                   NIRNAYA UI                     │
│   (React + Tailwind, dark/light theme shells)    │
└──────────────────────────┬───────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────┐
│           Scenario & Session Management          │
│        (store/sim.ts — zustand + persist)        │
└──────────────────────────┬───────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
           Commander   Team Leader   Trainee
              │            │            │
              └────────────┼────────────┘
                           ▼
┌──────────────────────────────────────────────────┐
│        Multi-Domain Data (AIR / LAND /           │
│        CYBER / EW — src/data/domains.ts)         │
└──────────────────────────┬───────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────┐
│      Decision, Event & Report Models             │
└──────────────────────────┬───────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────┐
│       Performance View / AAR / PDF Export        │
└──────────────────────────────────────────────────┘
```

---

## 🧭 Multi-Domain Operational Architecture

NIRNAYA organizes operational scenarios across four domains, presented vertically in the Scenario section of each domain (with an interactive adjustment bar):

```text
                    AIR
                     │
                     │
                   LAND
                     │
                     │
                  CYBER
                     │
                     │
                     EW
```

Information from all four domains feeds the same centralized decision environment:

```text
AIR ────────┐
            │
LAND ───────┼──►  Unified Operational Picture  ──►  Commander Decision
            │
CYBER ──────┤
            │
EW ─────────┘
```

---

## 🎖️ Command & Decision Workflow

```text
TEAM / PARTICIPANT (Team Leader)
        ↓
Situation / Threat / Location / Resources / Confidence
        ↓
Centralized Information (Command Dashboard)
        ↓
COMMANDER
        ↓
Decision Option + Confidence + Affected Teams + Rationale
        ↓
Event / Decision Log
        ↓
Performance Evaluation (Trainer console)
```

**Role responsibilities (as implemented):**

- **Commander** — consumes fused reports, monitors live telemetry, records decisions, generates HQ reports.
- **Team Leader** — files situation reports, tracks members/resources, exchanges communications, reviews history.
- **Trainee** — configures scenarios, manages participants, monitors live runs, reviews performance, and generates the AAR.

---

## 🎬 Scenario / Simulation System

- Each domain defines multiple scenarios (`ScenarioDef`) with narrative phases (`after` seconds, `tone`, message) that fire as simulated time advances.
- `store/sim.ts` runs a 1-second simulation tick engine: phase triggers, ambient events, threat escalations, communication issue injection, report/decision counters.
- Scenario parameters (`ScenarioConfig`) — threat intensity, information reliability, communication reliability, resource availability, event frequency, time pressure — directly modulate telemetry jitter, event pacing, and communication delays.
- Session state (domain, role, scenario, counters, events) is persisted via `zustand/middleware` so a refresh preserves the console state.

---

## 📶 Communication & Information Flow

```text
Domain Comms Scripts (VOICE / REPORT / COMMAND / ALERT)
        ↓
Comm Reliability parameter drives:
   • communication issues counter
   • alert/warn event injection
   • simulated delays
        ↓
Audio message assets (public/audio/<domain>/msgNN.wav)
        ↓
AudioCommandModal — logged voice-style commands
```

Low communication reliability increases reported issues and degrades the information available to the commander — the same mechanism also degrades team-report quality cues in monitoring views.

---

## 📈 Decision Logging / Performance Analysis

- Every decision is stored with: selected option, rationale text, confidence %, affected teams, and a timestamp.
- Performance metrics surfaced in the prototype: reports submitted, decisions taken, communication issues, escalations, scenario elapsed time, and phase progression.
- The AAR and HQ Report compile those counters plus the event timeline into a review summary; reports can be exported via the PDF utility.

---

## 🛠️ Technology Stack

| Layer | Technology / Approach |
| ----- | --------------------- |
| Frontend | React 19 + TypeScript |
| Routing | React Router DOM v7 |
| State Management | Zustand (with `persist` middleware → `localStorage`) |
| Styling | Tailwind CSS 3 (+ `@tailwindcss/forms`), CSS variables for theming |
| Animation | animate.css, custom CSS keyframes, canvas-based hero animation |
| Charts | Recharts |
| Icons | lucide-react |
| PDF Export | jsPDF + html2canvas (via `src/utils/pdf.ts`) |
| Backend | None — prototype is frontend-only |
| Database | None — state persisted in browser `localStorage` |
| APIs | None — no dedicated backend endpoints in the prototype |
| Build Tool | Vite 8 (rolldown) |
| Linting | Oxlint |
| Version Control | Git / GitHub |

---

## 🗂️ Project Structure

```text
signalbreak/
│
├── public/
│   ├── audio/                 # per-domain voice message assets (air/land/cyber/ew)
│   ├── favicon.svg
│   └── icons.svg
│
├── scripts/
│   └── genaudio.mjs           # audio asset generation helper
│
├── src/
│   ├── assets/                # hero image, react/vite svgs
│   ├── components/
│   │   ├── layout/Shell.tsx   # role shell (sidebar/topbar)
│   │   ├── ui/                # ThemeToggle, Toasts, common UI
│   │   ├── AudioCommandModal.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── DomainArchitecture.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── MapPanel.tsx
│   │   └── TimelinePanel.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx   # dark/light theme provider
│   ├── data/
│   │   └── domains.ts         # AIR/LAND/CYBER/EW definitions
│   ├── pages/
│   │   ├── HomePage.tsx       # hero + domain selection
│   │   ├── DomainsPage.tsx
│   │   ├── DomainSelect.tsx
│   │   ├── DomainRoleSelect.tsx
│   │   ├── Landing.tsx, NotFoundPage.tsx
│   │   ├── commander/         # Dashboard, Scenarios, Monitoring, Decision,
│   │   │                      # Reports, HQReport, SettingsPage, CommanderApp
│   │   ├── teamleader/        # TLDashboard, TLReport, TLMembers, TLResources,
│   │   │                      # TLCommunication, TLHistory, TeamLeaderApp
│   │   ├── trainer/           # TrDashboard, CreateScenario, Participants,
│   │   │                      # TrMonitoring, Performance, AAR, TrainerApp
│   │   └── unified/           # ScenarioSelectPage, OperationalDashboardPage,
│   │                          # LiveMonitoringPage, DecisionCenterPage,
│   │                          # TeamReportsPage
│   ├── store/
│   │   └── sim.ts             # zustand simulation engine (persisted)
│   ├── utils/
│   │   └── pdf.ts             # report export helper
│   ├── App.tsx                # route definitions
│   ├── main.tsx               # app entry
│   ├── index.css              # Tailwind + theme variables
│   └── utils.ts
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── README.md
```

---

## 🚀 Quick Start

```bash
git clone <your-repository-url>
cd signalbreak
npm install
npm run dev
```

Other available scripts:

```bash
npm run build    # type-check (tsc -b) and production build via Vite
npm run lint     # oxlint
npm run preview  # serve the production build locally
```

---

## 🔐 Environment Variables

> No environment variables are required for the current prototype.

The application runs entirely client-side; the only browser-side persistence used is `localStorage` (theme preference + simulation session state). Do not commit any API keys, tokens, or credentials.

---

## 🧭 How to Use NIRNAYA

### 1. 🏠 Open NIRNAYA

Land on the Home Page — hero statement, operational status pill, and an `ENTER TRAINING` call to action over an animated command-console background.

### 2. 🌐 Select Operational Domain

Choose **AIR**, **LAND**, **CYBER**, or **EW** from the domain cards.

### 3. 🎭 Select Your Role

Pick a console: **Commander**, **Team Leader**, or **Trainee**.

### 4. 🎬 Configure / Load a Scenario

- **Trainee:** open *Create Scenario*, set name/type/environment/teams/time limit, tune the six operational parameters, and apply.
- **Commander:** open *Scenarios* and load one of the predefined domain scenarios.
- Each Scenario view also shows the vertical **AIR → LAND → CYBER → EW** architecture with the spacing adjustment bar.

### 5. 📝 Enter Operational Information

Team Leaders submit situation reports (location, observation, conditions, threat level, confidence %, available/required resources).

### 6. 📡 Monitor the Operational Picture

Dashboards and Live Monitoring surfaces show teams, map, timeline, reports, communication issues, and escalations as the 1-second simulation tick advances phases and events.

### 7. ⚔️ Make a Decision

In the Decision Center, pick an option, set decision confidence, tag affected teams, and explain the rationale — then confirm.

### 8. 🗃️ Review Events / Decisions

Check the event stream and decision log (timestamped entries with option, reason, confidence, affected teams).

### 9. 📊 Analyze Performance

Trainee *Performance* view summarizes reports, decisions, comm issues, and escalations; Commander *HQ Report* compiles the same picture.

### 10. 📋 After-Action Review

Generate the AAR once a scenario has run to review the full timeline and outcomes; exports are available through the PDF utility.

---

## 🔌 API Overview

The current prototype is **frontend-only** and does **not** expose a dedicated backend API. All simulation logic, scenario data, and session state run in the browser.

---

## 📄 Documentation

| Resource | Location |
| -------- | -------- |
| Domain & scenario data model | `src/data/domains.ts` |
| Simulation engine | `src/store/sim.ts` |
| Theme system | `src/contexts/ThemeContext.tsx`, `src/index.css` |
| PDF report helper | `src/utils/pdf.ts` |
| Lint config | `.oxlintrc.json` |
| Build config | `vite.config.ts`, `tailwind.config.js` |

---

## 🖼️ Screenshots

Screenshots are not committed to the repository yet. Add them under a folder such as:

```text
docs/screenshots/
```

and reference them here, e.g.:

```markdown
![NIRNAYA Home](docs/screenshots/home.png)
```

---

## ▶️ Demo

Demo link will be added here.

---

## ⚠️ Prototype Scope & Limitations

- Prototype-level simulation — scenario timelines, events, and telemetry are simulated in the browser, not connected to real sensors/C2 systems.
- No real-world operational deployment; intended purely for training/evaluation environments.
- Simulated operational data only — no live feeds, no real units, no classified data.
- Communication degradation is modelled via parameter-driven counters and event injection, not real network impairment.
- Persistence is limited to browser `localStorage` (session state + theme); clearing browser data resets the console.
- No real authentication/authorization — roles are client-side session selections.
- Does not replace trained personnel, validated doctrine, or certified command systems.

---

## 🔮 Future Scope

1. **AI-Based Decision Support** — threat summarization and recommended courses of action.
2. **Real-Time Location Tracking** — live unit positions on the map panel.
3. **Smart Communication Management** — adaptive radio nets and priority queuing.
4. **Predictive Threat Analysis** — escalation forecasting from scenario telemetry.
5. **Automated Resource Allocation** — suggested redistribution of personnel/medical/water/comm/transport.
6. **Multi-Agency Integration** — shared scenario participation across organizations.
7. **Advanced Training Simulation** — branching scenarios, custom phase scripting, record/replay.
8. **Drone & IoT Integration** — ingestion of field sensor and UAV feeds.

---

## 👥 Team

| Name | Role |
| ---- | ---- |
| Team Member | Role |
| Team Member | Role |

---

<p align="center">
  <b>NIRNAYA</b><br/>
  <i>Multi-Domain Operational Training + Unified Information + Command Decision Support</i>
</p>
