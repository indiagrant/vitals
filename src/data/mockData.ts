import type {
  Dimension,
  Employee,
  EmployeeReflection,
  HealthMetrics,
  Ticket,
} from "@/types";

export const VITALS_EMPLOYEES: Employee[] = [
  { id: "E001", name: "Maya Chen",     role: "Senior Engineer",     initials: "MC", tenure: "3y" },
  { id: "E002", name: "Daniel Okafor", role: "Engineer",            initials: "DO", tenure: "1y" },
  { id: "E003", name: "Priya Raman",   role: "Staff Engineer",      initials: "PR", tenure: "5y" },
  { id: "E004", name: "Lukas Berg",    role: "Engineer",            initials: "LB", tenure: "8mo" },
  { id: "E005", name: "Sofia Marín",   role: "Senior Engineer",     initials: "SM", tenure: "2y" },
  { id: "E006", name: "Jordan Reeves", role: "Engineering Manager", initials: "JR", tenure: "4y" },
  { id: "E007", name: "Aiko Tanaka",   role: "Engineer",            initials: "AT", tenure: "1.5y" },
];

export const VITALS_SPRINTS = ["S20", "S21", "S22", "S23", "S24"] as const;

export const SPRINT_DATES: Record<string, string> = {
  S20: "Jan 28 → Feb 10",
  S21: "Feb 11 → Feb 24",
  S22: "Feb 25 → Mar 10",
  S23: "Mar 25 → Apr 7",
  S24: "Apr 22 → May 5",
};

export const VITALS_DIMENSIONS: Dimension[] = [
  { key: "workLifeBalance",   label: "Work-life balance",  short: "Balance"      },
  { key: "communication",     label: "Communication",      short: "Comms"        },
  { key: "managerSupport",    label: "Manager support",    short: "Support"      },
  { key: "teamCollaboration", label: "Team collaboration", short: "Collab"       },
  { key: "workload",          label: "Workload",           short: "Workload"     },
  { key: "jobSatisfaction",   label: "Job satisfaction",   short: "Satisfaction" },
];

export const VITALS_SURVEYS: Record<string, Record<string, HealthMetrics>> = {
  E001: {
    S20: { workLifeBalance: 4, communication: 5, managerSupport: 4, teamCollaboration: 5, workload: 4, jobSatisfaction: 5 },
    S21: { workLifeBalance: 4, communication: 4, managerSupport: 4, teamCollaboration: 5, workload: 3, jobSatisfaction: 4 },
    S22: { workLifeBalance: 3, communication: 4, managerSupport: 4, teamCollaboration: 4, workload: 2, jobSatisfaction: 4 },
    S23: { workLifeBalance: 3, communication: 4, managerSupport: 3, teamCollaboration: 4, workload: 2, jobSatisfaction: 3 },
    S24: { workLifeBalance: 3, communication: 4, managerSupport: 3, teamCollaboration: 5, workload: 2, jobSatisfaction: 4 },
  },
  E002: {
    S20: { workLifeBalance: 3, communication: 2, managerSupport: 2, teamCollaboration: 3, workload: 3, jobSatisfaction: 3 },
    S21: { workLifeBalance: 3, communication: 3, managerSupport: 3, teamCollaboration: 3, workload: 4, jobSatisfaction: 3 },
    S22: { workLifeBalance: 4, communication: 4, managerSupport: 4, teamCollaboration: 4, workload: 4, jobSatisfaction: 4 },
    S23: { workLifeBalance: 4, communication: 4, managerSupport: 5, teamCollaboration: 4, workload: 4, jobSatisfaction: 4 },
    S24: { workLifeBalance: 4, communication: 5, managerSupport: 5, teamCollaboration: 4, workload: 4, jobSatisfaction: 5 },
  },
  E003: {
    S20: { workLifeBalance: 5, communication: 5, managerSupport: 4, teamCollaboration: 4, workload: 3, jobSatisfaction: 5 },
    S21: { workLifeBalance: 5, communication: 5, managerSupport: 5, teamCollaboration: 5, workload: 3, jobSatisfaction: 5 },
    S22: { workLifeBalance: 4, communication: 5, managerSupport: 4, teamCollaboration: 5, workload: 4, jobSatisfaction: 5 },
    S23: { workLifeBalance: 5, communication: 5, managerSupport: 5, teamCollaboration: 5, workload: 4, jobSatisfaction: 5 },
    S24: { workLifeBalance: 5, communication: 5, managerSupport: 5, teamCollaboration: 5, workload: 4, jobSatisfaction: 5 },
  },
  E004: {
    S20: { workLifeBalance: 4, communication: 2, managerSupport: 3, teamCollaboration: 3, workload: 3, jobSatisfaction: 3 },
    S21: { workLifeBalance: 3, communication: 2, managerSupport: 3, teamCollaboration: 3, workload: 2, jobSatisfaction: 3 },
    S22: { workLifeBalance: 3, communication: 2, managerSupport: 3, teamCollaboration: 4, workload: 2, jobSatisfaction: 3 },
    S23: { workLifeBalance: 3, communication: 3, managerSupport: 3, teamCollaboration: 4, workload: 3, jobSatisfaction: 3 },
    S24: { workLifeBalance: 3, communication: 2, managerSupport: 3, teamCollaboration: 4, workload: 2, jobSatisfaction: 3 },
  },
  E005: {
    S20: { workLifeBalance: 4, communication: 4, managerSupport: 3, teamCollaboration: 5, workload: 3, jobSatisfaction: 4 },
    S21: { workLifeBalance: 4, communication: 4, managerSupport: 2, teamCollaboration: 5, workload: 3, jobSatisfaction: 4 },
    S22: { workLifeBalance: 4, communication: 4, managerSupport: 3, teamCollaboration: 5, workload: 4, jobSatisfaction: 4 },
    S23: { workLifeBalance: 5, communication: 5, managerSupport: 3, teamCollaboration: 5, workload: 4, jobSatisfaction: 5 },
    S24: { workLifeBalance: 4, communication: 4, managerSupport: 3, teamCollaboration: 5, workload: 3, jobSatisfaction: 4 },
  },
  E006: {
    S20: { workLifeBalance: 3, communication: 4, managerSupport: 4, teamCollaboration: 4, workload: 3, jobSatisfaction: 4 },
    S21: { workLifeBalance: 3, communication: 4, managerSupport: 4, teamCollaboration: 4, workload: 3, jobSatisfaction: 4 },
    S22: { workLifeBalance: 3, communication: 4, managerSupport: 4, teamCollaboration: 5, workload: 2, jobSatisfaction: 4 },
    S23: { workLifeBalance: 2, communication: 4, managerSupport: 4, teamCollaboration: 5, workload: 2, jobSatisfaction: 3 },
    S24: { workLifeBalance: 3, communication: 4, managerSupport: 4, teamCollaboration: 5, workload: 3, jobSatisfaction: 4 },
  },
  E007: {
    S20: { workLifeBalance: 5, communication: 4, managerSupport: 5, teamCollaboration: 4, workload: 4, jobSatisfaction: 5 },
    S21: { workLifeBalance: 4, communication: 4, managerSupport: 4, teamCollaboration: 4, workload: 4, jobSatisfaction: 4 },
    S22: { workLifeBalance: 4, communication: 3, managerSupport: 3, teamCollaboration: 3, workload: 3, jobSatisfaction: 3 },
    S23: { workLifeBalance: 3, communication: 3, managerSupport: 3, teamCollaboration: 3, workload: 2, jobSatisfaction: 3 },
    S24: { workLifeBalance: 3, communication: 2, managerSupport: 2, teamCollaboration: 3, workload: 2, jobSatisfaction: 2 },
  },
};

// ─── Tickets per employee (sprint 24) ─────────────────────────────────────

export const VITALS_TICKETS: Record<string, Ticket[]> = {
  E001: [
    { id: "PLT-412", title: "Migrate billing webhooks to v2",  status: "done",        estimate: 8,  actual: 11, points: 5, type: "feature",  note: "Edge cases in retry logic took longer than expected." },
    { id: "PLT-431", title: "Reduce dashboard TTFB by 200ms",   status: "done",        estimate: 12, actual: 10, points: 8, type: "perf",     note: "Cached the org query — instant win." },
    { id: "PLT-447", title: "Onboarding empty state",           status: "done",        estimate: 4,  actual: 4,  points: 2, type: "feature",  note: "" },
    { id: "PLT-456", title: "Sentry: null org in invoice job",  status: "done",        estimate: 3,  actual: 6,  points: 2, type: "bug",      note: "Reproduction was fiddly." },
    { id: "PLT-463", title: "Spike: SSO via WorkOS",            status: "in-progress", estimate: 16, actual: 14, points: 8, type: "spike",    note: "Carrying findings into S25." },
    { id: "PLT-471", title: "RBAC audit log endpoint",          status: "blocked",     estimate: 6,  actual: 2,  points: 5, type: "feature",  note: "Waiting on schema review from Priya." },
  ],
  E002: [
    { id: "PLT-420", title: "Fix invoice PDF render bug",       status: "done",        estimate: 4,  actual: 5,  points: 2, type: "bug",      note: "Took a bit longer to track down." },
    { id: "PLT-433", title: "Add usage metering to API gateway",status: "done",        estimate: 10, actual: 9,  points: 5, type: "feature",  note: "Pairing with Maya helped." },
    { id: "PLT-449", title: "Refactor settings nav",            status: "done",        estimate: 5,  actual: 4,  points: 3, type: "chore",    note: "" },
    { id: "PLT-460", title: "P1 incident: stuck queue",         status: "done",        estimate: 6,  actual: 8,  points: 5, type: "incident", note: "First incident I led — proud of how it went." },
  ],
  E003: [
    { id: "PLT-410", title: "RFC: tenant data isolation",       status: "done",        estimate: 14, actual: 12, points: 8, type: "rfc",      note: "Got good cross-team feedback." },
    { id: "PLT-422", title: "Review WorkOS spike",              status: "done",        estimate: 4,  actual: 3,  points: 2, type: "chore",    note: "" },
    { id: "PLT-437", title: "Db perf: slow tenant queries",     status: "done",        estimate: 8,  actual: 8,  points: 5, type: "perf",     note: "" },
    { id: "PLT-468", title: "Schema review: audit log",         status: "in-progress", estimate: 3,  actual: 2,  points: 2, type: "chore",    note: "Need to unblock Maya." },
  ],
  E004: [
    { id: "PLT-415", title: "Onboarding flow polish",           status: "done",        estimate: 6,  actual: 9,  points: 3, type: "feature",  note: "Couldn't find the right person to ask." },
    { id: "PLT-428", title: "Bug triage rotation",              status: "done",        estimate: 5,  actual: 7,  points: 3, type: "chore",    note: "" },
    { id: "PLT-451", title: "Fix flaky e2e tests",              status: "in-progress", estimate: 8,  actual: 10, points: 5, type: "bug",      note: "Hard to reproduce locally." },
    { id: "PLT-466", title: "Email template overhaul",          status: "carried-over",estimate: 6,  actual: 1,  points: 3, type: "feature",  note: "Didn't get to it." },
  ],
  E005: [
    { id: "PLT-414", title: "Design system: form components",   status: "done",        estimate: 12, actual: 11, points: 8, type: "feature",  note: "Felt collaborative — pairing was great." },
    { id: "PLT-429", title: "Storybook upgrade",                status: "done",        estimate: 4,  actual: 3,  points: 2, type: "chore",    note: "" },
    { id: "PLT-444", title: "A11y audit: dashboard",            status: "done",        estimate: 6,  actual: 6,  points: 3, type: "chore",    note: "" },
    { id: "PLT-462", title: "Refactor token system",            status: "in-progress", estimate: 8,  actual: 5,  points: 5, type: "chore",    note: "" },
  ],
  E006: [
    { id: "PLT-401", title: "Sprint planning + capacity model", status: "done",        estimate: 6,  actual: 8,  points: 3, type: "chore",    note: "" },
    { id: "PLT-419", title: "1:1 cadence rework",               status: "done",        estimate: 4,  actual: 5,  points: 2, type: "chore",    note: "" },
    { id: "PLT-441", title: "Hiring loop: senior eng",          status: "in-progress", estimate: 10, actual: 7,  points: 5, type: "chore",    note: "" },
    { id: "PLT-458", title: "Q2 planning doc",                  status: "in-progress", estimate: 8,  actual: 6,  points: 5, type: "rfc",      note: "" },
  ],
  E007: [
    { id: "PLT-417", title: "Notification service rewrite",     status: "in-progress", estimate: 16, actual: 13, points: 8, type: "feature",  note: "Feeling underwater on this one." },
    { id: "PLT-432", title: "Bug: race in webhook delivery",    status: "done",        estimate: 4,  actual: 8,  points: 3, type: "bug",      note: "Took longer than I'd like to admit." },
    { id: "PLT-454", title: "Dependency upgrades",              status: "done",        estimate: 3,  actual: 4,  points: 2, type: "chore",    note: "" },
    { id: "PLT-470", title: "On-call shadow week",              status: "blocked",     estimate: 0,  actual: 0,  points: 0, type: "chore",    note: "Re-scheduled." },
  ],
};

// ─── Reflections per employee ─────────────────────────────────────────────

export const VITALS_REFLECTIONS: Record<string, EmployeeReflection> = {
  E001: {
    wins: [
      { tag: "shipped",       title: "TTFB win shipped under estimate",            detail: "PLT-431 came in 2h faster than planned." },
      { tag: "collaboration", title: "Strong pairing with Priya",                  detail: "Three deep conversations on the WorkOS spike." },
    ],
    pains: [
      { tag: "workload",      title: "Workload at 2 — three sprints running",      detail: "Worth naming in retro?" },
      { tag: "blocked",       title: "PLT-471 stalled on schema review",           detail: "Two days idle waiting on review." },
    ],
    prompts: [
      "What's one thing you'd hand off if you could?",
      "Which ticket this sprint felt the most you?",
      "When did you feel most in flow?",
    ],
  },
  E002: {
    wins: [
      { tag: "growth",        title: "Led your first incident response",           detail: "Calm, clear comms — team noticed." },
      { tag: "shipped",       title: "Usage metering went out clean",              detail: "Pairing with Maya unblocked two design questions." },
    ],
    pains: [
      { tag: "estimation",    title: "PDF bug took 25% longer than planned",       detail: "Worth a post-mortem note." },
    ],
    prompts: [
      "What did leading the incident teach you?",
      "Where do you want more pairing time next sprint?",
      "What's a small risk you'd like to take?",
    ],
  },
  E003: {
    wins: [
      { tag: "leadership",    title: "RFC landed with good cross-team buy-in",     detail: "Tenant isolation doc got 12 thoughtful comments." },
      { tag: "mentoring",     title: "Two strong reviews helped Maya & Lukas",     detail: "" },
    ],
    pains: [
      { tag: "workload",      title: "Workload at 4 — sustainable but watch it",   detail: "" },
    ],
    prompts: [
      "What part of the RFC are you most proud of?",
      "Where could you delegate more?",
      "What's one thing only you can do right now — and is that okay?",
    ],
  },
  E004: {
    wins: [
      { tag: "shipped",       title: "Onboarding polish landed",                   detail: "Even though it took longer than hoped." },
    ],
    pains: [
      { tag: "communication", title: "Communication score: 2 — five sprints",      detail: "You've flagged this consistently. Worth surfacing." },
      { tag: "isolation",     title: "Couldn't find the right person to ask",      detail: "Came up on PLT-415." },
      { tag: "estimation",    title: "Two tickets ran 50%+ over estimate",         detail: "" },
    ],
    prompts: [
      "Who would you most like a regular pairing slot with?",
      "What's a question you sat on this sprint that you wish you'd asked?",
      "What would 'good comms' feel like to you?",
    ],
  },
  E005: {
    wins: [
      { tag: "collaboration", title: "Form components shipped + pairing felt good",detail: "" },
      { tag: "craft",         title: "A11y audit caught real issues",              detail: "" },
    ],
    pains: [
      { tag: "support",       title: "Manager support sitting at 3 — six sprints", detail: "Steady, not improving." },
    ],
    prompts: [
      "What kind of manager support would land for you?",
      "What craft moment stood out this sprint?",
      "Where would you like a stretch?",
    ],
  },
  E006: {
    wins: [
      { tag: "team",          title: "Team collab at 5 — second sprint running",   detail: "" },
    ],
    pains: [
      { tag: "balance",       title: "Work-life balance at 3 — and dipped to 2",   detail: "Q2 planning is heavy." },
      { tag: "workload",      title: "Workload at 3 — sustainable but watch",      detail: "" },
    ],
    prompts: [
      "What's one thing you'd remove from your plate?",
      "Where's your team strongest right now?",
      "What would a calmer sprint look like for you?",
    ],
  },
  E007: {
    wins: [
      { tag: "shipped",       title: "Webhook race condition fixed",               detail: "Even if it took a while." },
    ],
    pains: [
      { tag: "trend",         title: "Scores trending down for 3 sprints",         detail: "Across balance, comms, and support." },
      { tag: "overwhelm",     title: "Notification rewrite feels too big",         detail: "Your words: \"feeling underwater\"." },
      { tag: "support",       title: "Manager support: 2",                         detail: "First time at 2 — worth flagging?" },
    ],
    prompts: [
      "What's the smallest piece of the rewrite you could ship next?",
      "Who's one person you'd like to lean on more?",
      "What's a sign that you'd want to pause and regroup?",
    ],
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

export function vitalsAvg(metrics: HealthMetrics): number {
  const vals = Object.values(metrics);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function vitalsEmpAvg(empId: string, sprint: string = "S24"): number {
  return vitalsAvg(VITALS_SURVEYS[empId][sprint]);
}

export function vitalsTeamAvg(sprint: string = "S24"): number {
  const ids = Object.keys(VITALS_SURVEYS);
  return ids.reduce((s, id) => s + vitalsEmpAvg(id, sprint), 0) / ids.length;
}

export function vitalsEmployee(id: string): Employee | undefined {
  return VITALS_EMPLOYEES.find((e) => e.id === id);
}

export function vitalsTrend(empId: string, dim: keyof HealthMetrics): number[] {
  return VITALS_SPRINTS.map((s) => VITALS_SURVEYS[empId][s][dim]);
}
