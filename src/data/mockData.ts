import type {
  Dimension,
  Employee,
  EmployeeReflection,
  HealthMetrics,
  Team,
  Ticket,
} from "@/types";

export const VITALS_EMPLOYEES: Employee[] = [
  { id: "E001", name: "Maya Chen",     role: "Senior Engineer",     initials: "MC", tenure: "3y" },
  { id: "E002", name: "Daniel Okafor", role: "Engineer",            initials: "DO", tenure: "1y" },
  { id: "E003", name: "Priya Raman",   role: "Staff Engineer",      initials: "PR", tenure: "5y" },
  { id: "E004", name: "Lukas Berg",    role: "Engineer",            initials: "LB", tenure: "8mo" },
  { id: "E005", name: "Sofia Marín",   role: "Senior Engineer",     initials: "SM", tenure: "2y" },
  { id: "E006", name: "Jordan Reeves", role: "Engineering Manager", initials: "JR", tenure: "4y", isAdmin: true },
  { id: "E007", name: "Aiko Tanaka",   role: "Engineer",            initials: "AT", tenure: "1.5y" },
];

export const VITALS_SPRINTS = ["S20", "S21", "S22", "S23", "S24"] as const;

// Contiguous 14-day sprints ending with S24 — the default active sprint —
// starting today, so the app always reads as "we're mid-sprint right now"
// rather than a fixed date frozen in the past.
export const SPRINT_DATES: Record<string, string> = {
  S20: "Jun 24 → Jul 7",
  S21: "Jul 8 → Jul 21",
  S22: "Jul 22 → Aug 4",
  S23: "Aug 5 → Aug 18",
  S24: "Aug 19 → Sep 1",
};

export const VITALS_DIMENSIONS: Dimension[] = [
  { key: "workLifeBalance",   label: "Work-life balance",  short: "Balance",      question: "How was your work-life balance?" },
  { key: "communication",     label: "Communication",      short: "Comms",        question: "How connected did you feel with the team?" },
  { key: "managerSupport",    label: "Manager support",    short: "Support",      question: "Did you feel supported by your manager?" },
  { key: "teamCollaboration", label: "Team collaboration", short: "Collab",       question: "How was working with the team?" },
  { key: "workload",          label: "Workload",           short: "Workload",     question: "How manageable was your workload?" },
  { key: "jobSatisfaction",   label: "Job satisfaction",   short: "Satisfaction", question: "How satisfied did you feel with your work?" },
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

// ─── Tickets per employee, per sprint ──────────────────────────────────────
//
// Sprint-keyed like VITALS_SURVEYS — the History page (src/pages/HistoryView)
// reads every sprint, not just the current one. S24 is the original, real
// data; S20-S23 are illustrative but grounded in that employee's real
// VITALS_SURVEYS trend for that sprint (e.g. E001's workload-drop-to-2 sprint
// is where its tickets start running over estimate too).

export const VITALS_TICKETS: Record<string, Record<string, Ticket[]>> = {
  E001: {
    S20: [
      { id: "PLT-101", title: "Billing webhooks v2 — kickoff",     status: "done", estimate: 10, actual: 9, points: 5, type: "feature", note: "" },
      { id: "PLT-102", title: "Fix flaky billing test suite",      status: "done", estimate: 4,  actual: 4, points: 2, type: "bug",     note: "" },
    ],
    S21: [
      { id: "PLT-105", title: "Onboarding empty state",            status: "done", estimate: 4, actual: 4, points: 2, type: "feature", note: "" },
      { id: "PLT-106", title: "Audit log pagination",               status: "done", estimate: 5, actual: 6, points: 3, type: "chore",   note: "" },
      { id: "PLT-107", title: "Dependency upgrades",                 status: "done", estimate: 3, actual: 3, points: 2, type: "chore",   note: "" },
    ],
    S22: [
      { id: "PLT-110", title: "Rewrite billing retry logic",        status: "done",        estimate: 8,  actual: 9, points: 5, type: "feature", note: "" },
      { id: "PLT-111", title: "Spike: webhook v2 shape",            status: "in-progress", estimate: 10, actual: 6, points: 5, type: "spike",   note: "" },
    ],
    S23: [
      { id: "PLT-115", title: "Fix slow tenant queries",           status: "done",         estimate: 6, actual: 7, points: 3, type: "perf",  note: "" },
      { id: "PLT-116", title: "Billing webhook retries",            status: "done",         estimate: 5, actual: 5, points: 3, type: "bug",   note: "" },
      { id: "PLT-117", title: "Migrate legacy invoice job",        status: "carried-over", estimate: 8, actual: 2, points: 5, type: "chore", note: "Didn't get to it." },
    ],
    S24: [
      { id: "PLT-412", title: "Migrate billing webhooks to v2",  status: "done",        estimate: 8,  actual: 11, points: 5, type: "feature",  note: "Edge cases in retry logic took longer than expected." },
      { id: "PLT-431", title: "Reduce dashboard TTFB by 200ms",   status: "done",        estimate: 12, actual: 10, points: 8, type: "perf",     note: "Cached the org query — instant win." },
      { id: "PLT-447", title: "Onboarding empty state",           status: "done",        estimate: 4,  actual: 4,  points: 2, type: "feature",  note: "" },
      { id: "PLT-456", title: "Sentry: null org in invoice job",  status: "done",        estimate: 3,  actual: 6,  points: 2, type: "bug",      note: "Reproduction was fiddly." },
      { id: "PLT-463", title: "Spike: SSO via WorkOS",            status: "in-progress", estimate: 16, actual: 14, points: 8, type: "spike",    note: "Carrying findings into S25." },
      { id: "PLT-471", title: "RBAC audit log endpoint",          status: "blocked",     estimate: 6,  actual: 2,  points: 5, type: "feature",  note: "Waiting on schema review from Priya." },
    ],
  },
  E002: {
    S20: [
      { id: "PLT-131", title: "Fix invoice PDF spacing bug",       status: "done", estimate: 3, actual: 4, points: 2, type: "bug",   note: "" },
      { id: "PLT-132", title: "Clean up billing email templates",  status: "done", estimate: 4, actual: 4, points: 2, type: "chore", note: "" },
    ],
    S21: [
      { id: "PLT-135", title: "Add retries to invoice job",        status: "done", estimate: 6, actual: 7, points: 3, type: "feature", note: "" },
      { id: "PLT-136", title: "Settings nav cleanup",               status: "done", estimate: 4, actual: 3, points: 2, type: "chore",   note: "" },
    ],
    S22: [
      { id: "PLT-140", title: "Usage metering — gateway plumbing", status: "done", estimate: 8, actual: 8, points: 5, type: "feature", note: "" },
      { id: "PLT-141", title: "Fix stuck queue alerting",          status: "done", estimate: 4, actual: 5, points: 2, type: "bug",     note: "" },
      { id: "PLT-142", title: "Onboarding polish pairing",         status: "done", estimate: 3, actual: 2, points: 2, type: "chore",   note: "" },
    ],
    S23: [
      { id: "PLT-145", title: "Usage metering — billing hookup",   status: "done", estimate: 8, actual: 7, points: 5, type: "feature", note: "" },
      { id: "PLT-146", title: "Fix duplicate webhook sends",       status: "done", estimate: 4, actual: 4, points: 2, type: "bug",     note: "" },
      { id: "PLT-147", title: "Refactor settings nav v2",          status: "done", estimate: 3, actual: 3, points: 2, type: "chore",   note: "" },
    ],
    S24: [
      { id: "PLT-420", title: "Fix invoice PDF render bug",       status: "done",        estimate: 4,  actual: 5,  points: 2, type: "bug",      note: "Took a bit longer to track down." },
      { id: "PLT-433", title: "Add usage metering to API gateway",status: "done",        estimate: 10, actual: 9,  points: 5, type: "feature",  note: "Pairing with Maya helped." },
      { id: "PLT-449", title: "Refactor settings nav",            status: "done",        estimate: 5,  actual: 4,  points: 3, type: "chore",    note: "" },
      { id: "PLT-460", title: "P1 incident: stuck queue",         status: "done",        estimate: 6,  actual: 8,  points: 5, type: "incident", note: "First incident I led — proud of how it went." },
    ],
  },
  E003: {
    S20: [
      { id: "PLT-161", title: "Draft tenant isolation RFC",        status: "done", estimate: 8, actual: 7, points: 5, type: "rfc",  note: "" },
      { id: "PLT-162", title: "Db perf: index review",              status: "done", estimate: 5, actual: 5, points: 3, type: "perf", note: "" },
    ],
    S21: [
      { id: "PLT-165", title: "Tenant isolation RFC — review round", status: "done", estimate: 6, actual: 5, points: 3, type: "rfc",   note: "" },
      { id: "PLT-166", title: "Mentoring: Lukas pairing block",      status: "done", estimate: 3, actual: 3, points: 2, type: "chore", note: "" },
      { id: "PLT-167", title: "Db perf: query cache spike",         status: "done", estimate: 5, actual: 4, points: 3, type: "spike",  note: "" },
    ],
    S22: [
      { id: "PLT-170", title: "RFC: tenant data isolation — final", status: "done", estimate: 6, actual: 5, points: 3, type: "rfc",  note: "" },
      { id: "PLT-171", title: "Review WorkOS spike",                 status: "done", estimate: 3, actual: 2, points: 2, type: "chore", note: "" },
      { id: "PLT-172", title: "Db perf: slow tenant queries — prep", status: "done", estimate: 5, actual: 6, points: 3, type: "perf",  note: "" },
    ],
    S23: [
      { id: "PLT-175", title: "Db perf: slow tenant queries",       status: "done", estimate: 8, actual: 8, points: 5, type: "perf",  note: "" },
      { id: "PLT-176", title: "Schema review backlog",               status: "done", estimate: 4, actual: 3, points: 2, type: "chore", note: "" },
      { id: "PLT-177", title: "Review WorkOS spike — round 2",       status: "done", estimate: 3, actual: 3, points: 2, type: "chore", note: "" },
    ],
    S24: [
      { id: "PLT-410", title: "RFC: tenant data isolation",       status: "done",        estimate: 14, actual: 12, points: 8, type: "rfc",      note: "Got good cross-team feedback." },
      { id: "PLT-422", title: "Review WorkOS spike",              status: "done",        estimate: 4,  actual: 3,  points: 2, type: "chore",    note: "" },
      { id: "PLT-437", title: "Db perf: slow tenant queries",     status: "done",        estimate: 8,  actual: 8,  points: 5, type: "perf",     note: "" },
      { id: "PLT-468", title: "Schema review: audit log",         status: "in-progress", estimate: 3,  actual: 2,  points: 2, type: "chore",    note: "Need to unblock Maya." },
    ],
  },
  E004: {
    S20: [
      { id: "PLT-191", title: "Onboarding flow — first pass",      status: "done", estimate: 5, actual: 6, points: 3, type: "feature", note: "" },
      { id: "PLT-192", title: "Bug triage rotation",                status: "done", estimate: 4, actual: 4, points: 2, type: "chore",   note: "" },
    ],
    S21: [
      { id: "PLT-195", title: "Bug triage rotation — week 2",      status: "done",        estimate: 4, actual: 5, points: 2, type: "chore", note: "" },
      { id: "PLT-196", title: "Flaky e2e test — first attempt",    status: "in-progress", estimate: 6, actual: 5, points: 3, type: "bug",   note: "Hard to reproduce locally." },
      { id: "PLT-197", title: "Onboarding copy review",             status: "done",        estimate: 2, actual: 2, points: 1, type: "chore", note: "" },
    ],
    S22: [
      { id: "PLT-200", title: "Onboarding flow polish — round 2",  status: "done",        estimate: 6, actual: 8, points: 3, type: "feature", note: "" },
      { id: "PLT-201", title: "Flaky e2e tests",                    status: "in-progress", estimate: 8, actual: 9, points: 5, type: "bug",     note: "Still hard to reproduce locally." },
    ],
    S23: [
      { id: "PLT-205", title: "Email template overhaul — kickoff",  status: "in-progress", estimate: 6, actual: 3, points: 3, type: "feature", note: "" },
      { id: "PLT-206", title: "Fix flaky e2e tests — round 2",      status: "done",        estimate: 6, actual: 7, points: 3, type: "bug",     note: "" },
    ],
    S24: [
      { id: "PLT-415", title: "Onboarding flow polish",           status: "done",        estimate: 6,  actual: 9,  points: 3, type: "feature",  note: "Couldn't find the right person to ask." },
      { id: "PLT-428", title: "Bug triage rotation",              status: "done",        estimate: 5,  actual: 7,  points: 3, type: "chore",    note: "" },
      { id: "PLT-451", title: "Fix flaky e2e tests",              status: "in-progress", estimate: 8,  actual: 10, points: 5, type: "bug",      note: "Hard to reproduce locally." },
      { id: "PLT-466", title: "Email template overhaul",          status: "carried-over",estimate: 6,  actual: 1,  points: 3, type: "feature",  note: "Didn't get to it." },
    ],
  },
  E005: {
    S20: [
      { id: "PLT-221", title: "Design system: button + card components", status: "done", estimate: 8, actual: 7, points: 5, type: "feature", note: "" },
      { id: "PLT-222", title: "Storybook initial setup",                  status: "done", estimate: 4, actual: 3, points: 2, type: "chore",   note: "" },
    ],
    S21: [
      { id: "PLT-225", title: "Design system: form components — kickoff", status: "done", estimate: 8, actual: 9, points: 5, type: "feature", note: "" },
      { id: "PLT-226", title: "Storybook: add controls addon",             status: "done", estimate: 3, actual: 2, points: 2, type: "chore",   note: "" },
      { id: "PLT-227", title: "A11y audit: settings page",                 status: "done", estimate: 5, actual: 5, points: 3, type: "chore",   note: "" },
    ],
    S22: [
      { id: "PLT-230", title: "Design system: form components — v1",  status: "done",        estimate: 8, actual: 8, points: 5, type: "feature", note: "" },
      { id: "PLT-231", title: "Token system cleanup",                   status: "in-progress", estimate: 6, actual: 4, points: 3, type: "chore",   note: "" },
    ],
    S23: [
      { id: "PLT-235", title: "Design system: input + select components", status: "done", estimate: 8, actual: 7, points: 5, type: "feature", note: "" },
      { id: "PLT-236", title: "Token system audit",                        status: "done", estimate: 5, actual: 5, points: 3, type: "chore",   note: "" },
      { id: "PLT-237", title: "Storybook: MDX docs setup",                 status: "done", estimate: 4, actual: 4, points: 2, type: "chore",   note: "" },
    ],
    S24: [
      { id: "PLT-414", title: "Design system: form components",   status: "done",        estimate: 12, actual: 11, points: 8, type: "feature",  note: "Felt collaborative — pairing was great." },
      { id: "PLT-429", title: "Storybook upgrade",                status: "done",        estimate: 4,  actual: 3,  points: 2, type: "chore",    note: "" },
      { id: "PLT-444", title: "A11y audit: dashboard",            status: "done",        estimate: 6,  actual: 6,  points: 3, type: "chore",    note: "" },
      { id: "PLT-462", title: "Refactor token system",            status: "in-progress", estimate: 8,  actual: 5,  points: 5, type: "chore",    note: "" },
    ],
  },
  E006: {
    S20: [
      { id: "PLT-251", title: "Sprint planning + capacity model — v1", status: "done", estimate: 5, actual: 6, points: 3, type: "chore", note: "" },
      { id: "PLT-252", title: "1:1 cadence audit",                       status: "done", estimate: 3, actual: 3, points: 2, type: "chore", note: "" },
    ],
    S21: [
      { id: "PLT-255", title: "Hiring loop: senior eng — kickoff",  status: "in-progress", estimate: 8, actual: 5, points: 5, type: "chore", note: "" },
      { id: "PLT-256", title: "Q2 planning doc — outline",           status: "in-progress", estimate: 6, actual: 4, points: 3, type: "rfc",   note: "" },
      { id: "PLT-257", title: "1:1 cadence rework — v1",             status: "done",         estimate: 4, actual: 4, points: 2, type: "chore", note: "" },
    ],
    S22: [
      { id: "PLT-260", title: "Hiring loop: senior eng — panel",    status: "in-progress", estimate: 8, actual: 6, points: 5, type: "chore", note: "" },
      { id: "PLT-261", title: "Q2 planning doc — draft",             status: "in-progress", estimate: 8, actual: 6, points: 5, type: "rfc",   note: "" },
      { id: "PLT-262", title: "Sprint planning + capacity model — v2", status: "done",       estimate: 5, actual: 5, points: 3, type: "chore", note: "" },
    ],
    S23: [
      { id: "PLT-265", title: "Q2 planning doc — review round",     status: "in-progress", estimate: 8, actual: 6, points: 5, type: "rfc",   note: "" },
      { id: "PLT-266", title: "Hiring loop: senior eng — offer stage", status: "in-progress", estimate: 6, actual: 5, points: 3, type: "chore", note: "" },
      { id: "PLT-267", title: "1:1 cadence rework — rollout",        status: "done",         estimate: 4, actual: 4, points: 2, type: "chore", note: "" },
    ],
    S24: [
      { id: "PLT-401", title: "Sprint planning + capacity model", status: "done",        estimate: 6,  actual: 8,  points: 3, type: "chore",    note: "" },
      { id: "PLT-419", title: "1:1 cadence rework",               status: "done",        estimate: 4,  actual: 5,  points: 2, type: "chore",    note: "" },
      { id: "PLT-441", title: "Hiring loop: senior eng",          status: "in-progress", estimate: 10, actual: 7,  points: 5, type: "chore",    note: "" },
      { id: "PLT-458", title: "Q2 planning doc",                  status: "in-progress", estimate: 8,  actual: 6,  points: 5, type: "rfc",      note: "" },
    ],
  },
  E007: {
    S20: [
      { id: "PLT-281", title: "Notification service — design doc",  status: "done", estimate: 6, actual: 5, points: 3, type: "rfc",   note: "" },
      { id: "PLT-282", title: "On-call shadow week — prep",          status: "done", estimate: 2, actual: 2, points: 1, type: "chore", note: "" },
    ],
    S21: [
      { id: "PLT-285", title: "Notification service rewrite — kickoff", status: "in-progress", estimate: 10, actual: 8, points: 5, type: "feature", note: "" },
      { id: "PLT-286", title: "Dependency upgrades",                      status: "done",        estimate: 3,  actual: 3, points: 2, type: "chore",   note: "" },
    ],
    S22: [
      { id: "PLT-290", title: "Notification service rewrite — core", status: "in-progress", estimate: 14, actual: 10, points: 8, type: "feature", note: "" },
      { id: "PLT-291", title: "Bug: duplicate notification sends",   status: "done",        estimate: 4,  actual: 6,  points: 3, type: "bug",     note: "" },
      { id: "PLT-292", title: "On-call shadow week",                  status: "blocked",     estimate: 0,  actual: 0,  points: 0, type: "chore",   note: "Re-scheduled." },
    ],
    S23: [
      { id: "PLT-295", title: "Bug: race in webhook delivery — investigation", status: "done",        estimate: 3,  actual: 5, points: 2, type: "bug",     note: "" },
      { id: "PLT-296", title: "Notification service rewrite — core, cont.",     status: "in-progress", estimate: 12, actual: 9, points: 8, type: "feature", note: "" },
      { id: "PLT-297", title: "On-call shadow week — re-attempt",                status: "blocked",     estimate: 0,  actual: 0, points: 0, type: "chore",   note: "Re-scheduled again." },
    ],
    S24: [
      { id: "PLT-417", title: "Notification service rewrite",     status: "in-progress", estimate: 16, actual: 13, points: 8, type: "feature",  note: "Feeling underwater on this one." },
      { id: "PLT-432", title: "Bug: race in webhook delivery",    status: "done",        estimate: 4,  actual: 8,  points: 3, type: "bug",      note: "Took longer than I'd like to admit." },
      { id: "PLT-454", title: "Dependency upgrades",              status: "done",        estimate: 3,  actual: 4,  points: 2, type: "chore",    note: "" },
      { id: "PLT-470", title: "On-call shadow week",              status: "blocked",     estimate: 0,  actual: 0,  points: 0, type: "chore",    note: "Re-scheduled." },
    ],
  },
};

// ─── Reflections per employee, per sprint ──────────────────────────────────
//
// Sprint-keyed like VITALS_SURVEYS/VITALS_TICKETS above — see that comment
// for why. S24 is the original, real data; S20-S23 are illustrative but
// grounded in that employee's real per-sprint dimension trend.

export const VITALS_REFLECTIONS: Record<string, Record<string, EmployeeReflection>> = {
  E001: {
    S20: {
      wins: [{ tag: "shipped", title: "Billing webhooks v2 kicked off clean", detail: "Groundwork for the whole quarter's migration." }],
      pains: [],
      prompts: ["What made this sprint feel this good?"],
    },
    S21: {
      wins: [{ tag: "collaboration", title: "Team collab held at 5", detail: "Second sprint in a row." }],
      pains: [{ tag: "estimation", title: "Small overrun on the audit log work", detail: "" }],
      prompts: ["What's one thing you'd want more of, going forward?"],
    },
    S22: {
      wins: [{ tag: "shipped", title: "Billing retry logic rewritten", detail: "Cut failed-webhook volume noticeably." }],
      pains: [{ tag: "workload", title: "Workload dropped from 3 to 2", detail: "First time this low." }],
      prompts: ["What's one thing you'd hand off if you could?"],
    },
    S23: {
      wins: [{ tag: "shipped", title: "Slow tenant query fix landed", detail: "Quiet win, nobody noticed but it mattered." }],
      pains: [
        { tag: "support", title: "Manager support down to 3", detail: "First dip below 4 this run." },
        { tag: "workload", title: "Workload still at 2", detail: "Second sprint running." },
      ],
      prompts: ["What would make manager support feel more present?"],
    },
    S24: {
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
  },
  E002: {
    S20: {
      wins: [{ tag: "shipped", title: "Invoice PDF template cleanup", detail: "" }],
      pains: [
        { tag: "communication", title: "Communication at 2", detail: "Felt hard to stay in the loop this sprint." },
        { tag: "support", title: "Manager support at 2", detail: "" },
      ],
      prompts: ["What would better comms have looked like this sprint?"],
    },
    S21: {
      wins: [{ tag: "growth", title: "Comms and support both ticked up", detail: "Small steps, but noticeable." }],
      pains: [{ tag: "workload", title: "Workload up to 4", detail: "Busier than the last couple sprints." }],
      prompts: ["What's making the workload heavier right now?"],
    },
    S22: {
      wins: [{ tag: "shipped", title: "Usage metering groundwork landed", detail: "Set up the gateway plumbing Maya later built on." }],
      pains: [],
      prompts: ["What made this sprint feel more even?"],
    },
    S23: {
      wins: [{ tag: "support", title: "Manager support hit 5", detail: "Best it's been all year." }],
      pains: [],
      prompts: ["What's helped support feel this strong?"],
    },
    S24: {
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
  },
  E003: {
    S20: {
      wins: [{ tag: "leadership", title: "Tenant isolation RFC drafted", detail: "First pass, before the wider review." }],
      pains: [],
      prompts: ["What part of the RFC came together easiest?"],
    },
    S21: {
      wins: [{ tag: "team", title: "Every dimension at 5 except workload", detail: "Rare, worth noting." }],
      pains: [],
      prompts: ["What's sustaining this run?"],
    },
    S22: {
      wins: [{ tag: "shipped", title: "Tenant isolation RFC landed", detail: "Approved after two review rounds." }],
      pains: [],
      prompts: ["Where could you delegate more?"],
    },
    S23: {
      wins: [{ tag: "mentoring", title: "Two strong reviews helped Maya & Lukas", detail: "" }],
      pains: [{ tag: "workload", title: "Workload at 4 — sustainable but watch it", detail: "" }],
      prompts: ["What's one thing only you can do right now — and is that okay?"],
    },
    S24: {
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
  },
  E004: {
    S20: {
      wins: [{ tag: "shipped", title: "Onboarding flow — first pass", detail: "" }],
      pains: [{ tag: "communication", title: "Communication at 2", detail: "First sprint it showed up this low." }],
      prompts: ["What would help you feel more in the loop?"],
    },
    S21: {
      wins: [],
      pains: [
        { tag: "communication", title: "Communication still at 2", detail: "Second sprint running." },
        { tag: "workload", title: "Workload dropped to 2", detail: "" },
      ],
      prompts: ["Who would you most like a regular pairing slot with?"],
    },
    S22: {
      wins: [{ tag: "collaboration", title: "Team collab ticked up to 4", detail: "" }],
      pains: [{ tag: "communication", title: "Communication at 2 — third sprint", detail: "" }],
      prompts: ["What's a question you sat on this sprint that you wish you'd asked?"],
    },
    S23: {
      wins: [{ tag: "growth", title: "Communication moved up to 3", detail: "First uptick in four sprints." }],
      pains: [{ tag: "estimation", title: "Email template overhaul ran long", detail: "" }],
      prompts: ["What made comms move this sprint?"],
    },
    S24: {
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
  },
  E005: {
    S20: {
      wins: [{ tag: "craft", title: "Design system kickoff — button + card", detail: "" }],
      pains: [],
      prompts: ["What craft moment stood out this sprint?"],
    },
    S21: {
      wins: [{ tag: "collaboration", title: "Team collab held at 5", detail: "" }],
      pains: [{ tag: "support", title: "Manager support dropped to 2", detail: "Lowest it's been." }],
      prompts: ["What kind of manager support would land for you?"],
    },
    S22: {
      wins: [{ tag: "support", title: "Manager support recovered to 3", detail: "" }],
      pains: [],
      prompts: ["What would sustained support look like from here?"],
    },
    S23: {
      wins: [{ tag: "shipped", title: "Form components — first components shipped", detail: "Input and select landed clean." }],
      pains: [{ tag: "support", title: "Manager support steady at 3", detail: "Third sprint in a row." }],
      prompts: ["What would sustained support look like from here?"],
    },
    S24: {
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
  },
  E006: {
    S20: {
      wins: [{ tag: "team", title: "Team collab steady at 4", detail: "" }],
      pains: [],
      prompts: ["Where's your team strongest right now?"],
    },
    S21: {
      wins: [{ tag: "team", title: "Second flat, steady sprint", detail: "Nothing dramatic — in a good way." }],
      pains: [],
      prompts: ["What's one thing you'd remove from your plate?"],
    },
    S22: {
      wins: [{ tag: "team", title: "Team collab climbed to 5", detail: "" }],
      pains: [{ tag: "workload", title: "Own workload dropped to 2", detail: "Q2 planning eating into everything else." }],
      prompts: ["What would a calmer sprint look like for you?"],
    },
    S23: {
      wins: [{ tag: "team", title: "Team collab held at 5", detail: "Second sprint running." }],
      pains: [
        { tag: "balance", title: "Work-life balance dropped to 2", detail: "Q2 planning is heavy." },
        { tag: "workload", title: "Workload still at 2", detail: "" },
      ],
      prompts: ["What's one thing you'd remove from your plate?"],
    },
    S24: {
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
  },
  E007: {
    S20: {
      wins: [{ tag: "shipped", title: "Notification service — design landed", detail: "Clean kickoff, good energy." }],
      pains: [],
      prompts: ["What made this sprint feel this good?"],
    },
    S21: {
      wins: [{ tag: "shipped", title: "Notification service — rewrite kickoff", detail: "" }],
      pains: [{ tag: "balance", title: "Work-life balance eased to 4", detail: "Still solid, just off the peak." }],
      prompts: ["What's a sign that you'd want to pause and regroup?"],
    },
    S22: {
      wins: [],
      pains: [{ tag: "trend", title: "Comms, support, and collab all dropped to 3", detail: "Broad, not one thing in particular." }],
      prompts: ["What's the smallest piece of the rewrite you could ship next?"],
    },
    S23: {
      wins: [{ tag: "shipped", title: "Webhook race condition — root cause found", detail: "" }],
      pains: [
        { tag: "trend", title: "Scores trending down for 3 sprints", detail: "Across balance, comms, and support." },
        { tag: "workload", title: "Workload down to 2", detail: "" },
      ],
      prompts: ["Who's one person you'd like to lean on more?"],
    },
    S24: {
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

// Sprint-scoped reads with the same "default to current sprint" convention
// as vitalsEmpAvg, for call sites (Sprint page) that only ever want S24.
export function vitalsReflection(empId: string, sprint: string = "S24"): EmployeeReflection | undefined {
  return VITALS_REFLECTIONS[empId]?.[sprint];
}

export function vitalsTickets(empId: string, sprint: string = "S24"): Ticket[] {
  return VITALS_TICKETS[empId]?.[sprint] ?? [];
}

// Mutates the shared mock store directly — there's no backend yet, so this
// is how a Check-in submission "writes" data. Existing read-only views
// (Sprint, Team overview, History) already read VITALS_SURVEYS/
// VITALS_REFLECTIONS fresh on every render, so they pick this up on their
// next render with no extra wiring.
export function submitCheckIn(
  empId: string,
  sprint: string,
  metrics: HealthMetrics,
  win: string,
  pain: string,
): void {
  if (!VITALS_SURVEYS[empId]) VITALS_SURVEYS[empId] = {};
  VITALS_SURVEYS[empId][sprint] = metrics;

  if (!VITALS_REFLECTIONS[empId]) VITALS_REFLECTIONS[empId] = {};
  const existing = VITALS_REFLECTIONS[empId][sprint] ?? { wins: [], pains: [], prompts: [] };
  VITALS_REFLECTIONS[empId][sprint] = {
    ...existing,
    wins: win ? [{ tag: "check-in", title: win, detail: "" }, ...existing.wins] : existing.wins,
    pains: pain ? [{ tag: "check-in", title: pain, detail: "" }, ...existing.pains] : existing.pains,
  };
}

// ─── Teams (admin · Team overview) ─────────────────────────────────────────
//
// Engineering's check-ins are the real S24 per-employee averages from
// VITALS_SURVEYS above — not hand-picked numbers — so the team score here
// (3.7) matches the Engineering team average shown on the Sprint page.
// Design / Sales / Customer Support are invented in the same shape, to show
// the "Team overview" concept generalizes past a single team. The six-
// dimension breakdown per team is hand-set (whole numbers, like an
// individual's check-in) rather than derived, to keep DimensionBar's
// integer-scale rendering valid.

// A function, not a static array — Engineering's checkins are derived from
// VITALS_SURVEYS, so this needs to recompute on every call to pick up a
// check-in submitted since the module first loaded (see submitCheckIn above).
export function getVitalsTeams(): Team[] {
  return [
  {
    id: "eng",
    name: "Engineering",
    pod: "Platform pod",
    prevAvg: vitalsTeamAvg("S23"),
    checkins: VITALS_EMPLOYEES.map((e) => ({
      name: e.name,
      initials: e.initials,
      score: vitalsEmpAvg(e.id, "S24"),
    })),
    dims: {
      workLifeBalance:   [3, 3],
      communication:     [4, 4],
      managerSupport:    [3, 3],
      teamCollaboration: [5, 4],
      workload:          [3, 3],
      jobSatisfaction:   [4, 4],
    },
  },
  {
    id: "design",
    name: "Design",
    pod: "Product design",
    prevAvg: 4.3,
    checkins: [
      { name: "Naomi Osei",    initials: "NO", score: 4.8 },
      { name: "Elena Vasquez", initials: "EV", score: 4.6 },
      { name: "Theo Brandt",   initials: "TB", score: 4.3 },
      { name: "Marcus Webb",   initials: "MW", score: 4.3 },
    ],
    dims: {
      workLifeBalance:   [4, 4],
      communication:     [5, 5],
      managerSupport:    [4, 4],
      teamCollaboration: [5, 5],
      workload:          [4, 3],
      jobSatisfaction:   [5, 5],
    },
  },
  {
    id: "sales",
    name: "Sales",
    pod: "Revenue pod",
    prevAvg: 3.4,
    checkins: [
      { name: "Chris Doyle",   initials: "CD", score: 3.9 },
      { name: "Sam Ortiz",     initials: "SO", score: 3.8 },
      { name: "Ryan Cole",     initials: "RC", score: 3.6 },
      { name: "Nadia Farouk",  initials: "NF", score: 3.0 },
      { name: "Wren Halloway", initials: "WH", score: 2.5 },
      { name: "Beatrix Lang",  initials: "BL", score: 2.4 },
    ],
    dims: {
      workLifeBalance:   [3, 3],
      communication:     [3, 4],
      managerSupport:    [4, 4],
      teamCollaboration: [3, 3],
      workload:          [3, 3],
      jobSatisfaction:   [3, 4],
    },
  },
  {
    id: "support",
    name: "Customer Support",
    pod: "Frontline pod",
    prevAvg: 3.0,
    checkins: [
      { name: "Callum Reid",     initials: "CR", score: 3.5 },
      { name: "Dev Anand",       initials: "DA", score: 3.4 },
      { name: "Petra Novak",     initials: "PN", score: 3.2 },
      { name: "Amara Chukwu",    initials: "AC", score: 2.8 },
      { name: "Grace Lindqvist", initials: "GL", score: 2.6 },
      { name: "Femi Osayande",   initials: "FO", score: 2.2 },
      { name: "Yuki Sato",       initials: "YS", score: 2.0 },
      { name: "Isla Byrne",      initials: "IB", score: 2.0 },
      { name: "Tomas Reyes",     initials: "TR", score: 1.8 },
    ],
    dims: {
      workLifeBalance:   [2, 3],
      communication:     [3, 3],
      managerSupport:    [3, 3],
      teamCollaboration: [3, 3],
      workload:          [1, 2],
      jobSatisfaction:   [3, 3],
    },
  },
  ];
}
