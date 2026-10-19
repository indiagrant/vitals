// Derives "this sprint's data, plus the previous sprint for comparison"
// from an employee's full check-in history — the shape the Sprint page's
// components actually need, computed once in SprintView rather than
// separately inside each of its four children.

import type { EmployeeCheckIn } from "./api";
import type { HealthMetrics, Reflection } from "@/types";

export interface SprintData {
  current: HealthMetrics;
  previous: HealthMetrics | null;
  previousSprintId: string | null;
  wins: Reflection[];
  pains: Reflection[];
  prompts: string[];
}

// Finds `sprintId`'s check-in within the full history, plus the one
// immediately before it — ordered by Sprint.order, not array position,
// since the API makes no promise about what order rows come back in.
export function sprintDataFor(checkIns: EmployeeCheckIn[], sprintId: string): SprintData | null {
  const sorted = [...checkIns].sort((a, b) => a.sprint.order - b.sprint.order);
  const idx = sorted.findIndex((c) => c.sprintId === sprintId);
  if (idx === -1) return null;

  const current = sorted[idx];
  const previous = idx > 0 ? sorted[idx - 1] : null;

  return {
    current: extractMetrics(current),
    previous: previous ? extractMetrics(previous) : null,
    previousSprintId: previous?.sprintId ?? null,
    wins: current.reflections.filter((r) => r.kind === "WIN").map(toReflection),
    pains: current.reflections.filter((r) => r.kind === "PAIN").map(toReflection),
    prompts: current.prompts,
  };
}

export function extractMetrics(c: EmployeeCheckIn): HealthMetrics {
  return {
    workLifeBalance: c.workLifeBalance,
    communication: c.communication,
    managerSupport: c.managerSupport,
    teamCollaboration: c.teamCollaboration,
    workload: c.workload,
    jobSatisfaction: c.jobSatisfaction,
  };
}

function toReflection(r: EmployeeCheckIn["reflections"][number]): Reflection {
  return { tag: r.tag, title: r.title, detail: r.detail };
}
