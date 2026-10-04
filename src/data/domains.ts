export type Domain = "AIR" | "LAND" | "CYBER" | "EW";

export interface ScenarioDef {
  id: string;
  name: string;
  brief: string;
  phases: { after: number; tone: "info" | "warn" | "alert" | "ok"; msg: string }[];
}

export interface CommDef {
  from: string;
  to: string;
  text: string;
  type: "VOICE" | "REPORT" | "COMMAND" | "ALERT";
}

export interface TeamDef {
  id: string;
  name: string;
  leader: string;
  sector: string;
  situation: string;
  requirement: string;
  threat: "Low" | "Medium" | "High";
}

export interface DomainDef {
  id: Domain;
  title: string;
  subtitle: string;
  description: string;
  focus: string[];
  scenarioTitle: string;
  scenarios: ScenarioDef[];
  comms: CommDef[];
  teams: TeamDef[];
  eventPool: string[];
  resourceLabels: [string, string, string, string, string]; // personnel/medical/water/comm/transport
  assetLabel: string; // map legend title
}

const AIR: DomainDef = {
  id: "AIR",
  title: "AIR",
  subtitle: "Air Operations",
  description: "Airspace monitoring, aircraft/interceptor scenarios, aerial threats, radar and interception decisions, air communication problems and asset allocation.",
  focus: ["Airspace monitoring", "Aircraft / interceptor scenarios", "Aerial threats", "Radar & interception decisions", "Air communication problems", "Asset allocation"],
  scenarioTitle: "TRAINING SCENARIOS — AIR",
  scenarios: [
    {
      id: "air-1", name: "Unknown Aircraft Intrusion", brief: "An unknown aircraft is detected inside monitored airspace. Radar confidence, heading, altitude and interception assets must be assessed before escalation.",
      phases: [
        { after: 4, tone: "alert", msg: "Unknown radar contact detected at Grid K-7, altitude 28,000 ft" },
        { after: 9, tone: "warn", msg: "Radar confidence level fluctuating — tracking intermittent" },
        { after: 14, tone: "info", msg: "Interceptor ALPHA scrambled — 6 minutes out" },
        { after: 19, tone: "warn", msg: "Track heading changed — possible evasive manoeuvre" },
        { after: 24, tone: "alert", msg: "Communication delay on primary air channel" },
        { after: 29, tone: "info", msg: "Interceptor ALPHA reports visual contact — awaiting orders" },
      ],
    },
    {
      id: "air-2", name: "Multiple Aerial Threats", brief: "Multiple contacts appear simultaneously with limited interceptor availability. Commander must prioritize targets despite conflicting intelligence.",
      phases: [
        { after: 4, tone: "alert", msg: "Three concurrent contacts detected on northern approach" },
        { after: 9, tone: "warn", msg: "Only two interceptors available — triage required" },
        { after: 14, tone: "info", msg: "AWACS reports conflicting threat identification" },
        { after: 19, tone: "warn", msg: "Contact 2 closing fast — threat level raised" },
        { after: 24, tone: "alert", msg: "Communication delays reported by ground control" },
        { after: 29, tone: "info", msg: "Targets re-assessed — one contact descending to safe altitude" },
      ],
    },
    {
      id: "air-3", name: "Radar / Communication Degradation", brief: "Radar picture becomes unreliable and communication latency increases. Decisions must be made with incomplete team reports.",
      phases: [
        { after: 4, tone: "warn", msg: "Primary radar feed degraded — picture intermittent" },
        { after: 9, tone: "warn", msg: "Communication latency rising beyond 4 seconds" },
        { after: 14, tone: "info", msg: "Some team reports delayed — partial picture only" },
        { after: 19, tone: "alert", msg: "Unknown contact reappeared briefly before losing track" },
        { after: 24, tone: "warn", msg: "Secondary radar attempting handover" },
        { after: 29, tone: "ok", msg: "Track correlation improving — situation stabilising" },
      ],
    },
  ],
  comms: [
    { from: "Wing Commander", to: "AWACS", text: "AWACS, report current radar picture over the northern corridor.", type: "COMMAND" },
    { from: "AWACS", to: "Wing Commander", text: "Contact at Grid K-7, altitude 28000, heading south-east, identity unknown.", type: "REPORT" },
    { from: "Wing Commander", to: "Interceptor Alpha", text: "Interceptor Alpha, scramble. Visual ID on Contact K-7.", type: "COMMAND" },
    { from: "Interceptor Alpha", to: "Wing Commander", text: "Alpha airborne, four minutes out, requesting track authority.", type: "VOICE" },
    { from: "Air Control", to: "Wing Commander", text: "Primary air channel showing latency. Switching to secondary net.", type: "ALERT" },
    { from: "Interceptor Bravo", to: "Wing Commander", text: "Bravo on station. Airspace secure sector east.", type: "REPORT" },
    { from: "Wing Commander", to: "All Air Assets", text: "All air assets, increase scan rate and report any new contacts.", type: "COMMAND" },
    { from: "AWACS", to: "Wing Commander", text: "Contact K-7 altering heading. Threat assessment raised to high.", type: "ALERT" },
    { from: "Wing Commander", to: "Interceptor Bravo", text: "Interceptor Bravo, hold position. Interceptor Alpha will provide tactical support.", type: "COMMAND" },
    { from: "Air Control", to: "Wing Commander", text: "Commander, airspace contact situation has changed. Request immediate instructions.", type: "ALERT" },
  ],
  teams: [
    { id: "alpha", name: "INTERCEPTOR ALPHA", leader: "Sqn Ldr Rao", sector: "Sector A", situation: "On patrol, nominal", requirement: "Fuel top-up", threat: "Medium" },
    { id: "bravo", name: "INTERCEPTOR BRAVO", leader: "Wg Cdr Iyer", sector: "Sector B", situation: "Scramble readiness", requirement: "None", threat: "High" },
    { id: "charlie", name: "AWACS CHARLIE", leader: "Gp Capt Menon", sector: "Orbit 1", situation: "Tracking 2 contacts", requirement: "Sensor support", threat: "Medium" },
    { id: "delta", name: "AIR CONTROL DELTA", leader: "Maj. Reddy", sector: "Ground Station", situation: "Coordinating flights", requirement: "Comms support", threat: "Low" },
  ],
  eventPool: ["Radar sweep completed — 2 tracks correlated", "Interceptor Alpha position updated", "Air channel authentication refreshed", "AWACS reports steady picture", "Ground control cleared flight plan 12", "Signal check with AWACS succeeded"],
  resourceLabels: ["Crew", "Fuel", "Munitions", "Datalink", "Airframes"],
  assetLabel: "AIR ASSET POSITIONS",
};

const LAND: DomainDef = {
  id: "LAND",
  title: "LAND",
  subtitle: "Ground Operations",
  description: "Ground operations, team deployment, hostile activity, location-based threats, resource management and ground communication failures.",
  focus: ["Ground operations", "Team deployment", "Hostile activity", "Location-based threats", "Resource management", "Ground communication failures"],
  scenarioTitle: "TRAINING SCENARIOS — LAND",
  scenarios: [
    {
      id: "land-1", name: "Hostile Ground Movement", brief: "A hostile movement is detected at Location X with several teams deployed. Personnel, vehicles, resource status and communication reliability must be assessed.",
      phases: [
        { after: 4, tone: "alert", msg: "Thermal imagery shows movement at Location X" },
        { after: 9, tone: "info", msg: "Team Bravo dispatched to observe from ridge line" },
        { after: 14, tone: "warn", msg: "Water resupply delayed on Route 4" },
        { after: 19, tone: "alert", msg: "Team Bravo reports armed personnel — high threat" },
        { after: 24, tone: "warn", msg: "Communication reliability dropping in valley sector" },
        { after: 29, tone: "info", msg: "Reinforcement convoy ETA 12 minutes" },
      ],
    },
    {
      id: "land-2", name: "Team Under Threat", brief: "Team A reports hostile activity. Team B is available for reinforcement but route information is uncertain and resources are limited.",
      phases: [
        { after: 4, tone: "alert", msg: "Team Alpha reports contact — taking cover" },
        { after: 9, tone: "info", msg: "Team Bravo marked for reinforcement duty" },
        { after: 14, tone: "warn", msg: "Route 2 blocked — diversion required" },
        { after: 19, tone: "warn", msg: "Medical supplies below 40% on Team Alpha" },
        { after: 24, tone: "alert", msg: "Team Alpha transmission delayed 6 seconds" },
        { after: 29, tone: "ok", msg: "Team Bravo in position — contact containment reported" },
      ],
    },
    {
      id: "land-3", name: "Area Security Operation", brief: "Multiple locations show differing threat levels. Deployment, resource allocation and uncertain or missing reports drive the commander's decisions.",
      phases: [
        { after: 4, tone: "info", msg: "Area security sweep started across four sectors" },
        { after: 9, tone: "warn", msg: "Sector C threat level rising — reports inconsistent" },
        { after: 14, tone: "info", msg: "Team Delta cleared Sector D — all quiet" },
        { after: 19, tone: "alert", msg: "Sector B report missing — no contact for 8 minutes" },
        { after: 24, tone: "warn", msg: "Vehicle availability reduced after breakdown" },
        { after: 29, tone: "ok", msg: "All sectors reported — security posture restored" },
      ],
    },
  ],
  comms: [
    { from: "Ground Commander", to: "Team Alpha", text: "Team Alpha, report current position and situation.", type: "COMMAND" },
    { from: "Team Alpha", to: "Ground Commander", text: "Team Alpha at Sector Bravo. Movement detected near grid 44. Threat high.", type: "REPORT" },
    { from: "Ground Commander", to: "Team Alpha", text: "Alpha, maintain observation. Do not advance without orders.", type: "COMMAND" },
    { from: "Team Bravo", to: "Ground Commander", text: "Bravo reporting communication degradation in our sector.", type: "ALERT" },
    { from: "Ground Commander", to: "All Teams", text: "Switch to secondary channel and confirm establishment.", type: "COMMAND" },
    { from: "Team Bravo", to: "Ground Commander", text: "Secondary channel established. Communication stable.", type: "VOICE" },
    { from: "Team Delta", to: "Ground Commander", text: "Delta sector sweep complete. Area secure.", type: "REPORT" },
    { from: "Ground Commander", to: "Team Bravo", text: "Bravo, reinforce Alpha via Route 4 when confirmed.", type: "COMMAND" },
    { from: "Ground Commander", to: "Team Bravo", text: "Team Bravo, hold position. Team Alpha will provide support.", type: "COMMAND" },
    { from: "Team Alpha Leader", to: "Ground Commander", text: "Commander, situation has changed in Sector Bravo. Request immediate instructions.", type: "ALERT" },
  ],
  teams: [
    { id: "alpha", name: "TEAM ALPHA", leader: "Rahul Sharma", sector: "Sector A", situation: "Area stable", requirement: "Medical Support", threat: "Medium" },
    { id: "bravo", name: "TEAM BRAVO", leader: "Arjun Patel", sector: "Sector B", situation: "Movement detected", requirement: "Water Supply", threat: "High" },
    { id: "charlie", name: "TEAM CHARLIE", leader: "Vikram Singh", sector: "Sector C", situation: "Communication disruption", requirement: "Communication Support", threat: "Medium" },
    { id: "delta", name: "TEAM DELTA", leader: "Aman Kumar", sector: "Area D", situation: "Normal", requirement: "None", threat: "Low" },
  ],
  eventPool: ["Team Alpha submitted situation report", "Team Bravo location updated", "Team Charlie communication degraded", "Team Alpha requested medical resources", "Commander reviewed incoming reports", "Team Delta heartbeat restored intermittently", "Team Bravo signal strength fluctuating", "Vehicle check completed on Route 4"],
  resourceLabels: ["Personnel", "Medical", "Water", "Comms", "Transport"],
  assetLabel: "TEAM POSITIONS",
};

const CYBER: DomainDef = {
  id: "CYBER",
  title: "CYBER",
  subtitle: "Cyber Operations",
  description: "Cyber attacks, network intrusion, server compromise, data breach, system availability and incident response.",
  focus: ["Cyber attacks", "Network intrusion", "Server compromise", "Data breach", "System availability", "Incident response"],
  scenarioTitle: "TRAINING SCENARIOS — CYBER",
  scenarios: [
    {
      id: "cyber-1", name: "Network Intrusion", brief: "Suspicious logins are detected across multiple systems. Threat severity, network status, team availability and evidence confidence must be established.",
      phases: [
        { after: 4, tone: "alert", msg: "Suspicious login burst detected from external IP range" },
        { after: 9, tone: "warn", msg: "Three hosts showing anomalous process execution" },
        { after: 14, tone: "info", msg: "SOC team collecting forensic evidence" },
        { after: 19, tone: "alert", msg: "Evidence confidence low — conflicting indicators reported" },
        { after: 24, tone: "warn", msg: "Lateral movement attempt on segment 12 blocked" },
        { after: 29, tone: "ok", msg: "Affected accounts disabled — containment in progress" },
      ],
    },
    {
      id: "cyber-2", name: "Critical Server Compromise", brief: "A critical server is compromised and services are degraded. Containment options and limited response resources must be evaluated under conflicting intelligence.",
      phases: [
        { after: 4, tone: "alert", msg: "Core authentication server compromised" },
        { after: 9, tone: "warn", msg: "Services affected: mail, payroll, inventory" },
        { after: 14, tone: "info", msg: "Containment option A: isolate segment" },
        { after: 19, tone: "info", msg: "Containment option B: restart from known-good image" },
        { after: 24, tone: "alert", msg: "Conflicting intelligence — second intrusion path suspected" },
        { after: 29, tone: "warn", msg: "Response resources at limited capacity" },
      ],
    },
    {
      id: "cyber-3", name: "Coordinated Cyber Attack", brief: "Multiple systems are attacked with indicators appearing at different times. Cyber team communications become unreliable and containment must be prioritized.",
      phases: [
        { after: 4, tone: "alert", msg: "DDoS indicators observed on public gateway" },
        { after: 9, tone: "alert", msg: "Ransomware beaconing on Finance subnet" },
        { after: 14, tone: "warn", msg: "Cyber team channel unstable — voice check failed" },
        { after: 19, tone: "info", msg: "Data exfiltration attempt blocked at egress" },
        { after: 24, tone: "warn", msg: "Multiple priority conflicts — triage required" },
        { after: 29, tone: "ok", msg: "Primary containment actions complete — monitoring" },
      ],
    },
  ],
  comms: [
    { from: "Cyber Commander", to: "SOC Lead", text: "SOC, confirm current intrusion indicators.", type: "COMMAND" },
    { from: "SOC Lead", to: "Cyber Commander", text: "Commander, intrusion detected on segment 12. Severity high.", type: "ALERT" },
    { from: "Cyber Commander", to: "IR Cell", text: "IR Cell, begin evidence collection on affected hosts.", type: "COMMAND" },
    { from: "IR Cell", to: "Cyber Commander", text: "Evidence package collected. Confidence 68 percent.", type: "REPORT" },
    { from: "SOC Lead", to: "Cyber Commander", text: "Forensics: second intrusion path suspected. Conflicting intel.", type: "ALERT" },
    { from: "Cyber Commander", to: "All Cyber Units", text: "Isolate Finance subnet and hold changes until review.", type: "COMMAND" },
    { from: "NOC Duty Officer", to: "Cyber Commander", text: "Server status: auth server offline, mail service degraded.", type: "REPORT" },
    { from: "IR Cell", to: "Cyber Commander", text: "Containment holding. No new indicators in last ten minutes.", type: "VOICE" },
    { from: "Cyber Commander", to: "IR Cell", text: "IR Cell, maintain perimeter containment. SOC Alpha will provide support.", type: "COMMAND" },
    { from: "SOC Lead", to: "Cyber Commander", text: "Commander, intrusion vectors have multiplied. Request immediate instructions.", type: "ALERT" },
  ],
  teams: [
    { id: "alpha", name: "SOC ALPHA", leader: "Priya Nair", sector: "SOC Node 1", situation: "Monitoring nominal", requirement: "Analyst rotation", threat: "Medium" },
    { id: "bravo", name: "IR CELL BRAVO", leader: "Karan Mehta", sector: "SOC Node 2", situation: "Investigating host 7", requirement: "Forensic tooling", threat: "High" },
    { id: "charlie", name: "FORENSICS CHARLIE", leader: "Divya Rao", sector: "Lab 3", situation: "Evidence processing", requirement: "Storage", threat: "Medium" },
    { id: "delta", name: "NOC DELTA", leader: "Sunil Verma", sector: "NOC", situation: "All services degraded", requirement: "Network support", threat: "Low" },
  ],
  eventPool: ["SOC sweep completed — no new indicators", "Host sensor heartbeat confirmed", "Firewall rule review completed", "Authentication logs archived", "Segment 9 scan finished clean", "Incident ticket updated"],
  resourceLabels: ["Analysts", "Tooling", "Bandwidth", "Telemetry", "Storage"],
  assetLabel: "NETWORK NODES",
};

const EW: DomainDef = {
  id: "EW",
  title: "ELECTRONIC WARFARE",
  subtitle: "EW Operations",
  description: "Communication jamming, signal disruption, electronic interference, radar/sensor degradation, communication loss and electronic countermeasures.",
  focus: ["Communication jamming", "Signal disruption", "Electronic interference", "Radar / sensor degradation", "Communication loss", "Electronic countermeasures"],
  scenarioTitle: "TRAINING SCENARIOS — ELECTRONIC WARFARE",
  scenarios: [
    {
      id: "ew-1", name: "Communication Jamming", brief: "Communication channels are being jammed. Signal strength changes and teams lose contact. Alternative channels must be brought up to maintain coordination.",
      phases: [
        { after: 4, tone: "alert", msg: "Wideband jamming detected on primary voice channel" },
        { after: 9, tone: "warn", msg: "Signal strength below 30% — Team Bravo isolated" },
        { after: 14, tone: "info", msg: "Alternative channel UHF-2 available" },
        { after: 19, tone: "warn", msg: "Team Alpha reports burst jamming pattern" },
        { after: 24, tone: "alert", msg: "Coordination integrity at risk" },
        { after: 29, tone: "ok", msg: "Secondary channel stabilised — coordination restored" },
      ],
    },
    {
      id: "ew-2", name: "Electronic Interference", brief: "Radar and sensor reliability falls and communication quality fluctuates. Teams report inconsistent information.",
      phases: [
        { after: 4, tone: "warn", msg: "Radar track integrity down to 55%" },
        { after: 9, tone: "warn", msg: "Sensor fusion returning inconsistent positions" },
        { after: 14, tone: "info", msg: "Interference source triangulated north-west" },
        { after: 19, tone: "alert", msg: "Communication quality fluctuating on net 3" },
        { after: 24, tone: "warn", msg: "Countermeasure uplink pending approval" },
        { after: 29, tone: "ok", msg: "Countermeasures deployed — sensors recovering" },
      ],
    },
    {
      id: "ew-3", name: "Multi-Channel Communication Failure", brief: "The primary channel is unavailable and the secondary is only partially functional. Some teams remain connected and the comms plan must be reorganized.",
      phases: [
        { after: 4, tone: "alert", msg: "Primary communication channel unavailable" },
        { after: 9, tone: "warn", msg: "Secondary channel partially functional" },
        { after: 14, tone: "info", msg: "Teams Charlie and Delta still linked on net 5" },
        { after: 19, tone: "warn", msg: "Scheduled team check-in missed" },
        { after: 24, tone: "alert", msg: "Coordination risk escalating" },
        { after: 29, tone: "ok", msg: "Reorganization complete — all teams reachable" },
      ],
    },
  ],
  comms: [
    { from: "EW Commander", to: "EW Cell Alpha", text: "Alpha, report jamming assessment on primary channel.", type: "COMMAND" },
    { from: "EW Cell Alpha", to: "EW Commander", text: "Jamming confirmed, wideband, source north-west. Signal below 30%.", type: "ALERT" },
    { from: "EW Commander", to: "All EW Cells", text: "Switch to UHF-2 and confirm channel lock.", type: "COMMAND" },
    { from: "EW Cell Bravo", to: "EW Commander", text: "UHF-2 established, communication stable.", type: "VOICE" },
    { from: "SIGINT Cell", to: "EW Commander", text: "Interference pattern intermittent. Likely mobile emitter.", type: "REPORT" },
    { from: "EW Cell Charlie", to: "EW Commander", text: "Sensor degradation persists on net 3. Countermeasures advised.", type: "ALERT" },
    { from: "EW Commander", to: "SIGINT Cell", text: "SIGINT, cross-check the triangulation before we commit.", type: "COMMAND" },
    { from: "EW Cell Delta", to: "EW Commander", text: "Countermeasure uplink complete. Sensor reliability recovering.", type: "REPORT" },
    { from: "EW Commander", to: "EW Cell Bravo", text: "Cell Bravo, hold frequency lock. Cell Alpha will provide support.", type: "COMMAND" },
    { from: "EW Cell Alpha", to: "EW Commander", text: "Commander, multi-band jamming escalating. Request immediate instructions.", type: "ALERT" },
  ],
  teams: [
    { id: "alpha", name: "EW CELL ALPHA", leader: "Lt. Fara", sector: "Site 1", situation: "Jamming watch", requirement: "Generator fuel", threat: "High" },
    { id: "bravo", name: "EW CELL BRAVO", leader: "Lt. Sengupta", sector: "Site 2", situation: "Channel monitoring", requirement: "Antenna reposition", threat: "Medium" },
    { id: "charlie", name: "SIGINT CHARLIE", leader: "Maj. Han", sector: "Site 3", situation: "Intercept collection", requirement: "Analyst support", threat: "Medium" },
    { id: "delta", name: "SPECTRUM DELTA", leader: "Capt. Iqbal", sector: "Site 4", situation: "Spectrum survey", requirement: "None", threat: "Low" },
  ],
  eventPool: ["Spectrum scan completed", "EW Cell Alpha signal check passed", "Interference geolocation updated", "Channel quality sampled on net 3", "Countermeasure readiness confirmed", "Emitter activity dropped for 60 seconds"],
  resourceLabels: ["Operators", "Emitter Power", "Fuel", "Sensors", "Platforms"],
  assetLabel: "EW SITE STATUS",
};

export const DOMAINS: Record<Domain, DomainDef> = { AIR, LAND, CYBER, EW };
export const DOMAIN_IDS: Domain[] = ["AIR", "LAND", "CYBER", "EW"];
