import { HeroCheckIn } from "@/components/vitals/HeroCheckIn";
import { DimensionGrid } from "@/components/vitals/DimensionGrid";
import { TicketList } from "@/components/vitals/TicketList";
import { WinsAndPains } from "@/components/vitals/WinsAndPains";
import { Prompts } from "@/components/vitals/Prompts";
import type { Employee } from "@/types";

interface SprintViewProps {
  employee: Employee;
  sprint: string;
}

/**
 * The Employee "Sprint" home page.
 * Lays out the post-sprint reflection from highest-level signal
 * (hero check-in) down to actionable nudges (prompts).
 */
export function SprintView({ employee, sprint }: SprintViewProps) {
  return (
    <div className="flex flex-col gap-10 ">
      <HeroCheckIn employee={employee} sprint={sprint} />
      <DimensionGrid empId={employee.id} sprint={sprint} />
      <TicketList empId={employee.id} />
      <WinsAndPains empId={employee.id} />
      <Prompts empId={employee.id} />
    </div>
  );
}
