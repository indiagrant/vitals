// Thin, typed wrappers around the backend API. This is the only place in
// the frontend that should call fetch() directly for app data — every
// endpoint gets one typed, tested entry point here, instead of ad-hoc
// fetch calls scattered through components.

import type { HealthMetrics } from "@/types";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export interface ReflectionResult {
  id: number;
  checkInId: number;
  kind: "WIN" | "PAIN";
  tag: string;
  title: string;
  detail: string;
}

export interface CheckInResult extends HealthMetrics {
  id: number;
  employeeId: string;
  sprintId: string;
  prompts: string[];
  reflections: ReflectionResult[];
}

// Same argument order/shape as mockData.ts's submitCheckIn() — a
// deliberate match, so swapping the call site is a small, obvious diff.
export async function submitCheckIn(
  employeeId: string,
  sprintId: string,
  metrics: HealthMetrics,
  win: string,
  pain: string,
): Promise<CheckInResult> {
  const res = await fetch("/api/checkins", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employeeId, sprintId, metrics, win, pain }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.error ?? "Failed to submit check-in", res.status, data.details);
  }

  return data as CheckInResult;
}
