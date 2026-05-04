import { Eyebrow } from "./Eyebrow";
import { VITALS_REFLECTIONS } from "@/data/mockData";

interface PromptsProps {
  empId: string;
}

/**
 * Three open-ended questions to take into the next 1:1 or retro.
 * Designed to feel like a thoughtful nudge, not a homework list.
 */
export function Prompts({ empId }: PromptsProps) {
  const prompts = VITALS_REFLECTIONS[empId]?.prompts ?? [];
  if (prompts.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <Eyebrow>Take into your next 1:1</Eyebrow>
        <span className="font-mono text-[12px] text-muted-foreground tracking-[0.06em] uppercase">
          generated for you
        </span>
      </div>
      <ol className="flex flex-col gap-3.5">
        {prompts.map((p, i) => (
          <li key={i} className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums shrink-0 mt-px">
              0{i + 1}
            </span>
            <p className="text-[15px] text-foreground leading-snug">{p}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
