/* All portfolio content, sourced from the CV. One place to edit. */

export const identity = {
  name: "Mohamed Waleed Tagy",
  shortName: "M.W. TAGY",
  role: "Solution Architect Track · Systems Engineer",
  base: "Alexandria, Egypt",
  coordinates: "31°12′N 29°55′E",
  email: "mohamed.120230167@ejust.edu.eg",
  phone: "+20 100 876 5599",
  linkedin: "https://www.linkedin.com/in/mohamed-tagy-47b206313/",
  github: "https://github.com/Mohamed-Tagy",
  timezone: "Africa/Cairo",
};

export const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export const hero = {
  eyebrowA: "MOHAMED WALEED TAGY",
  eyebrowB: "SOLUTION ARCHITECT TRACK — ALEXANDRIA, EG",
  /* lines of the headline; the serif-italic accent word is marked inline */
  sub: "Vision models on bare CPUs. Radar on live stations. Business platforms and client portals shipped to sign-off. I work the seam where software meets hardware — and stay until it holds.",
  primaryCta: { label: "View selected work", href: "#projects" },
  secondaryCta: { label: "Get in touch", href: "#contact" },
};

export const about = {
  bio: [
    "I'm Mohamed — a Computer Science & Engineering student at the Egypt-Japan University of Science and Technology, working where code meets circuitry. I've shipped a Vision Transformer that watches for driver drowsiness on nothing but a laptop CPU, parsed live NMEA streams from vessels, and commissioned dual-station marine radar over fiber at operational field sites.",
    "Between semesters I deliver enterprise solutions on Microsoft Dynamics 365 and the Power Platform — from business requirements documents to tested, signed-off implementations — and build web portals freelance, including a purchase-order system now running in production at a marine electronics company. The destination is solution architecture; the discipline is the same everywhere: understand the system, respect the constraint, verify before handover.",
  ],
  facts: [
    { k: "BASE", v: "Alexandria, Egypt" },
    { k: "EDU", v: "E-JUST — B.Sc. CSE, Class of 2028" },
    { k: "TRACK", v: "Solution Architect — D365 & Power Platform" },
    { k: "LANG", v: "Arabic · English · Japanese" },
    { k: "STATUS", v: "Open to internships & freelance" },
  ],
  stats: [
    { value: 4, pad: 2, suffix: "", label: "Internships across three industries" },
    { value: 2, pad: 2, suffix: "", label: "Real-time systems shipped" },
    { value: 2, pad: 2, suffix: "", label: "Freelance web apps delivered" },
    { value: 15, pad: 2, suffix: "+", label: "Technologies in active use" },
  ],
};

export type Project = {
  fix: string;
  title: string;
  category: string;
  year?: string;
  status?: string;
  role: string;
  description: string;
  tech: string[];
  visual: "vision" | "nmea" | "dataverse" | "radar" | "portal";
};

export const projects: Project[] = [
  {
    fix: "01",
    title: "Drowsiness Detection System",
    category: "Computer Vision · Real-time",
    year: "2025",
    role: "Design & build — personal project",
    description:
      "A Vision Transformer classifies eye state from live camera input at 99.2% validation accuracy, raising an alert after five seconds of sustained closure. Inference is tuned to 15 FPS entirely on CPU — no GPU, any laptop — and an Arduino pipeline extends alerts into physical hardware: buzzer, vibration, whatever wakes you.",
    tech: ["Python", "PyTorch", "OpenCV", "ViT", "Arduino"],
    visual: "vision",
  },
  {
    fix: "02",
    title: "NMEA Navigation Parser",
    category: "Maritime Data · Systems",
    year: "2026",
    role: "Design & build — personal project",
    description:
      "A Python parser for live NMEA sentence streams — GGA position, HDT heading — read straight off vessel serial lines. Malformed and truncated frames are validated and dropped without stalling the pipeline, because at sea the data keeps coming whether it's clean or not.",
    tech: ["Python", "PySerial", "NMEA 0183"],
    visual: "nmea",
  },
  {
    fix: "03",
    title: "Dynamics 365 Solution Delivery",
    category: "Enterprise Platforms",
    year: "2026",
    role: "Solution architect & developer intern — Systems Limited",
    description:
      "A business solution carried end-to-end on Dynamics 365 and Dataverse: stakeholder needs captured as BRDs, translated into functional designs, implemented as tables, relationships and Power Platform components, then validated against acceptance criteria before sign-off.",
    tech: ["Dynamics 365", "Dataverse", "Power Platform", "BRD / FDD"],
    visual: "dataverse",
  },
  {
    fix: "04",
    title: "Dual-Station Radar Commissioning",
    category: "Field Engineering · Marine",
    year: "2026",
    role: "Service engineer intern — Marcom Trade Co.",
    description:
      "Two semi-control marine radar stations installed at operational sites and linked over fiber-optic, with communication interfaces integrated between them. Every unit went through signal verification and operational testing before handover to the people who run it.",
    tech: ["Marine Radar", "Fiber Optics", "Signal Verification"],
    visual: "radar",
  },
  {
    fix: "05",
    title: "Business Web Portals — Marcom Trade Co.",
    category: "Web · Freelance Delivery",
    status: "PO portal live in production",
    role: "Design & build — freelance client work",
    description:
      "Two web applications built freelance for a marine electronics trading company: a purchase-order portal that runs the company's PO process flow online — deployed on their own server and in daily production use — and a customer-facing service price list, completed and awaiting deployment.",
    tech: ["HTML", "CSS", "JavaScript", "Python"],
    visual: "portal",
  },
];

export type SkillGroup = {
  name: string;
  code: string;
  skills: { name: string; note: string }[];
};

export const skillGroups: SkillGroup[] = [
  {
    name: "Software & ML",
    code: "SYS.A",
    skills: [
      { name: "Python", note: "Primary language across every system" },
      { name: "PyTorch", note: "ViT training and CPU-tuned inference" },
      { name: "OpenCV", note: "Live camera capture pipelines" },
      { name: "Vision Transformers", note: "99.2% validation-accuracy classifier" },
      { name: "JavaScript", note: "Freelance client portals in production" },
      { name: "HTML / CSS", note: "Production web delivery" },
      { name: "MATLAB", note: "Engineering computation" },
      { name: "Prompt Engineering", note: "LLM-assisted workflows" },
    ],
  },
  {
    name: "Systems & Hardware",
    code: "SYS.B",
    skills: [
      { name: "Marine Radar", note: "Installation through commissioning" },
      { name: "Circuit Analysis", note: "Board-level fault isolation" },
      { name: "Hardware Troubleshooting", note: "Diagnosis on live equipment" },
      { name: "NMEA 0183 / Serial", note: "Live vessel data streams" },
      { name: "Wireshark", note: "Network and protocol inspection" },
      { name: "Arduino", note: "Physical alert hardware" },
    ],
  },
  {
    name: "Enterprise Delivery",
    code: "SYS.C",
    skills: [
      { name: "Dynamics 365", note: "Solution implementation" },
      { name: "Dataverse", note: "Tables, relationships, data models" },
      { name: "Power Platform", note: "Configured platform components" },
      { name: "Requirements Analysis", note: "Stakeholder needs → BRD" },
      { name: "BRD / FDD Authoring", note: "Requirement-to-design mapping" },
      { name: "Testing & Validation", note: "Acceptance criteria to sign-off" },
    ],
  },
];

export const ticker = [
  "Python",
  "PyTorch",
  "OpenCV",
  "ViT",
  "MATLAB",
  "Wireshark",
  "Dynamics 365",
  "Dataverse",
  "Power Platform",
  "Arduino",
  "NMEA 0183",
  "Fiber Optics",
  "Serial I/O",
  "BRD / FDD",
  "JavaScript",
  "HTML / CSS",
];

export type LogEntry = {
  period: string;
  year: string;
  org: string;
  title: string;
  place: string;
  points: string[];
};

export const log: LogEntry[] = [
  {
    period: "AUG 2026 — PRESENT",
    year: "2026",
    org: "Systems Limited",
    title: "Solution Architect & Developer Intern",
    place: "Smart Village, Giza",
    points: [
      "Delivering business solutions end-to-end on Dynamics 365, Dataverse and the Power Platform — requirements capture through tested implementation.",
      "Authoring BRDs from stakeholder needs and translating them into functional design documents mapped to concrete data models.",
      "Validating delivered solutions against FDD acceptance criteria before sign-off.",
    ],
  },
  {
    period: "FEB 2026",
    year: "2026",
    org: "Marcom Trade Co.",
    title: "Service Engineer Intern — Field Installation",
    place: "Alexandria",
    points: [
      "Commissioned marine radar systems and control units at operational field sites, from installation to signed-off status.",
      "Configured dual semi-control radar stations linked via fiber-optic, integrating the communication interfaces between them.",
      "Ran signal verification and operational testing before handover to operators.",
    ],
  },
  {
    period: "SEP — OCT 2025",
    year: "2025",
    org: "SanaTech Global Solutions",
    title: "Technical Intern",
    place: "Alexandria",
    points: [
      "Structured training across ManageEngine's IT management suite and core cloud computing concepts, applied to evaluating IT tool implementations.",
    ],
  },
  {
    period: "AUG — SEP 2025",
    year: "2025",
    org: "Marcom Trade Co.",
    title: "Service Engineer Intern — Electronics Repair",
    place: "Alexandria",
    points: [
      "Diagnosed and resolved circuit-level faults on motherboards used in marine equipment, isolating root causes with senior engineers.",
      "Executed testing and maintenance procedures to verify repairs before equipment returned to service.",
    ],
  },
  {
    period: "2023 — PRESENT",
    year: "2023",
    org: "E-JUST",
    title: "B.Sc. Computer Science & Engineering",
    place: "Alexandria",
    points: [
      "Level 4 at the Egypt-Japan University of Science and Technology, Class of 2028. Coursework spanning safety & risk management, project management & engineering economy, entrepreneurship & innovation.",
    ],
  },
];

export const principles = [
  {
    n: "01",
    title: "Understand before you build",
    body: "Every system I've delivered started as a document everyone agreed on. BRDs and FDDs aren't paperwork — they're the design.",
  },
  {
    n: "02",
    title: "Design for the constraint",
    body: "The drowsiness detector runs on CPUs because real drivers don't carry GPUs. The constraint isn't the obstacle — it's the spec.",
  },
  {
    n: "03",
    title: "Verify before handover",
    body: "Radar stations, D365 solutions, repaired boards — nothing ships without structured testing and a sign-off.",
  },
  {
    n: "04",
    title: "Own the seam",
    body: "Systems fail at their interfaces: serial lines, APIs, solder joints. I work both sides of the boundary so the boundary holds.",
  },
];

export const contact = {
  sub: "I'm open to internships and freelance work — business applications, solution architecture, and systems that cross the hardware–software line. Tell me what you're trying to make work.",
};

/* ---- NMEA helpers — real XOR checksums, as the parser project demands ---- */

export function nmeaChecksum(body: string): string {
  let sum = 0;
  for (let i = 0; i < body.length; i++) sum ^= body.charCodeAt(i);
  return sum.toString(16).toUpperCase().padStart(2, "0");
}

export function nmea(body: string): string {
  return `$${body}*${nmeaChecksum(body)}`;
}
