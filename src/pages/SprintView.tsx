import { useEffect, useState } from "react";
import { HeroCheckIn } from "@/components/vitals/HeroCheckIn";
import { DimensionGrid } from "@/components/vitals/DimensionGrid";
import { TicketList } from "@/components/vitals/TicketList";
import { WinsAndPains } from "@/components/vitals/WinsAndPains";
import { Prompts } from "@/components/vitals/Prompts";
import { getEmployeeCheckIns, ApiError, type EmployeeCheckIn } from "@/lib/api";
import { sprintDataFor } from "@/lib/sprintData";
import { vitalsTeamAvg } from "@/data/mockData";
import type { Employee } from "@/types";

interface SprintViewProps {
  employee: Employee;
  sprint: string;
}

/**
 * The Employee "Sprint" home page.
 * Lays out the post-sprint reflection from highest-level signal
 * (hero check-in) down to actionable nudges (prompts).
 *
 * Fetches the employee's full check-in history once (not per sprint —
 * the sprint pager just re-slices data already in hand). Team average
 * and tickets still come from mockData.ts: team average needs every
 * employee's data (no aggregate endpoint yet), and tickets have no API
 * endpoint at all yet — both deliberate, flagged gaps, not oversights.
 */
export function SprintView({ employee, sprint }: SprintViewProps) {
  const [checkIns, setCheckIns] = useState<EmployeeCheckIn[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCheckIns(null);
    setError(null);
    getEmployeeCheckIns(employee.id)
      .then((data) => {
        if (!cancelled) setCheckIns(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Couldn't load this sprint's data.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [employee.id]);

  if (error) {
    return <p className="text-sm text-clay">{error}</p>;
  }

  if (!checkIns) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  const data = sprintDataFor(checkIns, sprint);
  if (!data) {
    return <p className="text-sm text-muted-foreground">No check-in recorded for this sprint yet.</p>;
  }

  return (
    <div className="flex flex-col gap-10 ">
      <HeroCheckIn current={data.current} previous={data.previous} teamScore={vitalsTeamAvg(sprint)} />
      <DimensionGrid current={data.current} previous={data.previous} previousSprintId={data.previousSprintId} />
      <TicketList empId={employee.id} sprint={sprint} />
      <WinsAndPains wins={data.wins} pains={data.pains} />
      <Prompts prompts={data.prompts} />
    </div>
  );
}
