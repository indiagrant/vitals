import type { Dimension, Employee, HealthMetrics } from "@/types";

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
