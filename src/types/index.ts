// ─── Domain types ──────────────────────────────────────────────────────────

export interface HealthMetrics {
  workLifeBalance: number;
  communication: number;
  managerSupport: number;
  teamCollaboration: number;
  workload: number;
  jobSatisfaction: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  initials: string;
  tenure: string;
}

export interface Dimension {
  key: keyof HealthMetrics;
  label: string;
  short: string;
}

// ─── Sprint / ticket types ─────────────────────────────────────────────────

export type TicketStatus = "done" | "in-progress" | "blocked" | "carried-over";
export type TicketType =
  | "feature"
  | "bug"
  | "chore"
  | "spike"
  | "rfc"
  | "perf"
  | "incident";

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  estimate: number; // hours
  actual: number;   // hours
  points: number;
  type: TicketType;
  note: string;
}

// ─── Reflection types ──────────────────────────────────────────────────────

export interface Reflection {
  tag: string;
  title: string;
  detail: string;
}

export interface EmployeeReflection {
  wins: Reflection[];
  pains: Reflection[];
  prompts: string[];
}

// ─── App-level types ───────────────────────────────────────────────────────

export type ViewRole = "employee" | "admin";
