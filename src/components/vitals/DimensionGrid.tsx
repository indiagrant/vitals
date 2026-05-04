import { Eyebrow } from "./Eyebrow";
import { DimensionBar } from "./DimensionBar";
import { VITALS_DIMENSIONS, VITALS_SURVEYS, VITALS_SPRINTS } from "@/data/mockData";

interface DimensionGridProps {
  empId: string;
  sprint: string;
}

export function DimensionGrid({ empId, sprint }: DimensionGridProps) {
  const current = VITALS_SURVEYS[empId]?.[sprint];
  if (!current) return null;

  const idx = VITALS_SPRINTS.indexOf(sprint as typeof VITALS_SPRINTS[number]);
  const prevSprint = idx > 0 ? VITALS_SPRINTS[idx - 1] : null;
  const prev = prevSprint ? VITALS_SURVEYS[empId]?.[prevSprint] : undefined;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between">
        <Eyebrow>Six dimensions, this sprint</Eyebrow>
        {prevSprint && (
          <span className="font-mono text-[12px] text-muted-foreground tracking-[0.06em] uppercase">
            vs. {prevSprint}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {VITALS_DIMENSIONS.map((d) => (
          <DimensionBar
            key={d.key}
            label={d.label}
            value={current[d.key]}
            prevValue={prev?.[d.key]}
          />
        ))}
      </div>
    </section>
  );
}
