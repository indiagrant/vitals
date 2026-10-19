import { Eyebrow } from "@/components/ui/Eyebrow";
import { DimensionBar } from "@/components/ui/DimensionBar";
import { VITALS_DIMENSIONS } from "@/data/mockData";
import type { HealthMetrics } from "@/types";

interface DimensionGridProps {
  current: HealthMetrics;
  previous: HealthMetrics | null;
  previousSprintId: string | null;
}

export function DimensionGrid({ current, previous, previousSprintId }: DimensionGridProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between">
        <Eyebrow>Six dimensions, this sprint</Eyebrow>
        {previousSprintId && (
          <span className="font-mono text-[12px] text-muted-foreground tracking-[0.06em] uppercase">
            vs. {previousSprintId}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {VITALS_DIMENSIONS.map((d) => (
          <DimensionBar
            key={d.key}
            label={d.label}
            value={current[d.key]}
            prevValue={previous?.[d.key]}
          />
        ))}
      </div>
    </section>
  );
}
