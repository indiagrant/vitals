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

export type ViewRole = "employee" | "admin";
