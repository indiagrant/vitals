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
  isAdmin?: boolean; // has access to the Admin section, in addition to their own employee pages
}

export interface Dimension {
  key: keyof HealthMetrics;
  label: string;
  short: string;
  question: string; // warm phrasing used on the Check-in form
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

// ─── Team (admin) types ────────────────────────────────────────────────────

export interface TeamCheckIn {
  name: string;
  initials: string;
  score: number; // 1-5, this person's average across the six dimensions
}

export interface Team {
  id: string;
  name: string;
  pod: string;
  prevAvg: number; // aggregate team score, previous sprint
  checkins: TeamCheckIn[];
  dims: Record<keyof HealthMetrics, [current: number, previous: number]>;
}

// ─── App-level types ───────────────────────────────────────────────────────

export type ViewRole = "employee" | "admin";
