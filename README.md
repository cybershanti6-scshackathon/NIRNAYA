# NIRNAYA

**Multi-domain decision-making trainer for degraded communication environments — interactive prototype.**

NIRNAYA simulates the *information environment* of a training exercise, not the battlefield. An instructor
runs a synthetic scenario in which reports can be delayed, dropped or contradicted, and each trainee sees a
different picture. The platform records what every participant knew, when they knew it, what they decided
and why, then turns that record into an After Action Review (AAR).

> This is a prototype built for training and assessment. Every scenario, unit, report, sensor feed and
> metric is **fictional sample data**. No real operational data, weapon, targeting or cyber-attack content is
> used, and the system never recommends or takes operational decisions. Humans stay in command.

<!-- TODO: replace [bracketed] placeholders before submission. Remove this comment. -->

---

## 🚀 Live Prototype & System Demonstration

[![Live Deployment](https://img.shields.io/badge/🌐_Launch_NIRNAYA-0052CC?style=for-the-badge)](YOUR_DEPLOYMENT_LINK_HERE)
[![Watch Video](https://img.shields.io/badge/▶️_Watch_Demo_Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](YOUR_VIDEO_LINK_HERE)
[![Architecture](https://img.shields.io/badge/📐_View_Architecture_Doc-238636?style=for-the-badge)](./docs/ARCHITECTURE.pdf)

> **💡 Testing Guide:** Use a modern desktop browser. Open the instructor console in one window and join
> as two or three trainees in separate windows or browsers to see different information views at the same
> time.

👉 **[Access the NIRNAYA Live Prototype](YOUR_DEPLOYMENT_LINK_HERE)**

---

## 🎯 Problem

Command and staff training usually presents clean, shared information. Real communication environments
do not. Reports arrive late, go missing or disagree, and different people hold different parts of the
picture. NIRNAYA trains the *decision process* under those conditions: what to trust, what to verify and
what to do despite uncertainty.

**Problem Statement:** SIH26248
**Organization:** Ministry of Defence — Defence Services Staff College (DSSC)
**Category:** Software
**Theme:** Smart Automation

---

## ✨ Key Features

- **Scenario engine** — timeline-driven scenarios with events, decision points and domains (land, air, cyber, EW), defined as data.
- **Communication degradation** — configurable **delay**, **dropout** and **contradiction**, selectable by profile (normal, mild, moderate, severe).
- **Player-specific information views** — a visibility layer decides what each participant receives, and when.
- **Multiplayer coordination** — instructor plus multiple trainees in one live session over WebSockets.
- **Instructor console** — start, pause and inject events live, change degradation, monitor participants.
- **Decision logging** — every decision stored with time, available information, rationale and confidence.
- **Automated AAR** — timeline, actual-vs-perceived comparison, decision analysis and exportable report.
- **Repeatable exercises** — seeded scenarios so several teams can face the same conditions.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────┐
│          INSTRUCTOR CONSOLE   │   TRAINEE UI       │
│                 React Web Frontend                  │
└────────────────────────┬────────────────────────────┘
                         │  REST + WebSocket
                         ▼
┌─────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND                     │
│   API Routes │ Session Manager │ Validation │ Auth  │
└─────────────┬──────────────┬──────────────┬─────────┘
              │              │              │
              ▼              ▼              ▼
       ┌────────────┐ ┌──────────────┐ ┌─────────────┐
       │  Scenario  │ │Communication │ │ Information │
       │   Engine   │ │ Degradation  │ │ Visibility  │
       └─────┬──────┘ └──────┬───────┘ └──────┬──────┘
             └───────────────┼────────────────┘
                             ▼
                    ┌────────────────┐
                    │ Decision Logger│
                    └───────┬────────┘
                            ▼
                    ┌────────────────┐
                    │  PostgreSQL    │
                    └───────┬────────┘
                  ┌─────────┴─────────┐
                  ▼                   ▼
          ┌──────────────┐    ┌──────────────┐
          │  Analytics   │    │   Reporting  │
          │   Engine     │    │ (AAR / PDF)  │
          └──────────────┘    └──────────────┘
```

For the detailed architecture document, see **[`docs/ARCHITECTURE.pdf`](docs/ARCHITECTURE.pdf)**.

---

## How the simulation works

Every exercise runs through one pipeline:

```text
ground truth (scenario state)
        ↓
   event generated
        ↓
communication degradation    (delay / dropout / contradiction)
        ↓
information visibility       (what each participant receives)
        ↓
 participant perception
        ↓
decision + rationale + confidence
        ↓
 decision log → AAR
```

The **ground truth** is held only by the server and the instructor. Trainees see only what the
degradation and visibility layers deliver to them. The AAR places three views side by side: what actually
happened, what each participant knew at the time, and what they decided.

### Communication degradation

| Effect | Behaviour |
| --- | --- |
| **Delay** | A report generated at time *t* is delivered at *t + delay*. |
| **Dropout** | A report is lost with a set probability and never delivered. |
| **Contradiction** | A conflicting report is delivered. The system never says which one is correct. |

Degradation profiles set these values together, and the instructor can change them mid-exercise.


| Profile | Delay | Dropout | Contradiction |
| --- | --- | --- | --- |
| Normal | [ ] | [ ] | [ ] |
| Mild | [ ] | [ ] | [ ] |
| Moderate | [ ] | [ ] | [ ] |
| Severe | [ ] | [ ] | [ ] |

### Repeatability

Scenarios use a seed. The same scenario and seed reproduce the same event sequence, so several teams
can be assessed under comparable conditions.

---

## Scenario format

Scenarios are stored as JSON.

```json
{
  "scenario": { "id": "SCN001", "name": "Synthetic Multi-Domain Exercise", "duration": 900, "seed": 82731 },
  "communication": { "profile": "moderate" },
  "domains": ["land", "air", "cyber", "ew"],
  "events": [
    { "time": 120, "type": "communication_degradation" },
    { "time": 240, "type": "conflicting_report" },
    { "time": 360, "type": "sensor_unavailable" },
    { "time": 480, "type": "communication_recovery" }
  ]
}
```

---

## Roles

| Role | Can do |
| --- | --- |
| **Instructor** | Create and configure scenarios, start/pause, inject events, view ground truth, review AAR. |
| **Trainee** | See own information view, message teammates, submit decisions with rationale. |
| **Administrator** | Manage sessions and accounts. |

Trainees cannot view the instructor console, change scenario parameters or see hidden state or other
trainees' private information.

---

## After Action Review (AAR)

The AAR measures the decision *process*, not only the outcome:

- Decision latency (event to decision)
- Information sources considered
- Recognition of conflicting information
- Verification and clarification requests
- Team communication
- Adaptation after degradation

> These are training indicators for instructors, not winner/loser scores.

Reports can be exported as PDF.

---

## Prototype boundaries

Deliberately out of scope: real operational data, real weapon or targeting content, cyber-attack or
electronic-warfare techniques, autonomous decision-making, and any claim of fielded deployment.
Degradation is modelled at the simulation layer, not by affecting real networks.

### 🔮 Future Scope

- AR/VR client on the same scenario engine
- AI-assisted AAR summaries computed from structured decision logs
- Cross-team comparison on a shared scenario seed
- Additional scenarios and difficulty levels
- Role-based access control and enterprise authentication
- Centralised audit logs
- Isolated/local-network deployment

---

### ⚠️ Prototype Scope & Limitations

NIRNAYA is an **SIH prototype** and should be evaluated by the functionality implemented in the submitted
version.

- Scenarios and feeds are synthetic.
- Metrics are training indicators and have not been validated in a pilot with trainees.
- Production use would need authentication and authorisation hardening, secret management, logging,
  monitoring, testing and infrastructure review.

---

### 👥 Team

**Project:** NIRNAYA
**Problem Statement:** SIH26248
**Organization:** Ministry of Defence — Defence Services Staff College
**Category:** Software
**Theme:** Smart Automation

---

## Quick start

Run the backend and frontend in two terminals.

### 1. Backend (FastAPI)

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

The API is at <http://localhost:8000> (interactive docs at `/docs`). Check it:

```bash
curl http://localhost:8000/api/v1/health
```

### 2. Database (PostgreSQL)

Create a database and set `NIRNAYA_DATABASE_URL` (see Configuration).

### 3. Frontend (React)

```bash
npm install
npm run dev
```

The console is then at <http://localhost:5173>.

### 4. Configuration

Copy `.env.example` to `.env`. <!-- TODO: match to your real variables -->

| Variable | Used by | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | frontend | `http://localhost:8000` | Base URL of the API |
| `VITE_WS_URL` | frontend | `ws://localhost:8000/ws` | WebSocket endpoint |
| `NIRNAYA_DATABASE_URL` | backend | — | PostgreSQL connection string |
| `NIRNAYA_CORS_ORIGINS` | backend | Vite dev origins | Comma-separated exact origins |
| `NIRNAYA_SECRET_KEY` | backend | — | Session/token signing key |

`VITE_*` variables are inlined into the public bundle. **Never put a secret in one.**

---

## API

Base path `/api/v1`. Interactive documentation at `/docs`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Liveness check |
| `GET` | `/scenarios` | List scenarios |
| `POST` | `/scenarios` | Create a scenario |
| `POST` | `/sessions` | Start an exercise session |
| `POST` | `/sessions/{id}/events` | Instructor injects an event |
| `POST` | `/sessions/{id}/decisions` | Trainee submits a decision |
| `GET` | `/sessions/{id}/aar` | AAR data for a session |
| `GET` | `/sessions/{id}/report` | Download the exercise report |
| `WS` | `/ws/{session_id}` | Live feeds, events and team messages |

---

## Security

- **Server-side information control.** Trainee clients receive only their own filtered feed. Ground truth never leaves the server except to the instructor.
- **Role-based access.** Instructor, trainee and administrator permissions are enforced on the backend.
- **Session isolation.** Every event and decision is tied to a session ID.
- **Audit logging.** Who did what, when and in which session.
- **No stack trace reaches the client.** Errors are logged server-side and returned as clean messages.

---

## Project layout

```
backend/
  requirements.txt
  app/
    main.py                 FastAPI app, CORS, error handling
    core/config.py          Environment-driven settings
    models/                 Scenario, session, report, decision schemas
    services/
      scenario_engine.py    Timeline and event execution
      degradation.py        Delay, dropout, contradiction
      visibility.py         Per-participant information views
      decision_logger.py    Decisions, rationale, confidence
      analytics.py          AAR metrics
      reports.py            PDF/report generation
    api/routes/             health · scenarios · sessions · aar
    ws/                     WebSocket session handling
  tests/

src/
  lib/                      API and WebSocket clients
  pages/                    Landing · Join · Lobby · Trainee · Instructor · AAR · Report
  components/               Map, feed, comms status, decision panel, timeline
docs/
  ARCHITECTURE.pdf
```

---

## Routes

`/` landing · `/join` · `/lobby` · `/exercise` · `/instructor` · `/aar` · `/report`
