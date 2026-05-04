import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { VITALS_REFLECTIONS } from "@/data/mockData";
import type { Reflection } from "@/types";

interface WinsAndPainsProps {
  empId: string;
}

export function WinsAndPains({ empId }: WinsAndPainsProps) {
  const r = VITALS_REFLECTIONS[empId];
  if (!r) return null;

  return (
    <section className="grid md:grid-cols-2 gap-5">
      <ReflectionPanel
        tone="sage"
        eyebrow="Wins worth keeping"
        items={r.wins}
        emptyText="No wins logged this sprint — yet."
      />
      <ReflectionPanel
        tone="clay"
        eyebrow="Worth sitting with"
        items={r.pains}
        emptyText="Nothing surfaced. That's a kind of signal too."
      />
    </section>
  );
}

function ReflectionPanel({
  tone,
  eyebrow,
  items,
  emptyText,
}: {
  tone: "sage" | "clay";
  eyebrow: string;
  items: Reflection[];
  emptyText: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 flex flex-col gap-4",
        tone === "sage" && "bg-sage-soft border-sage/20",
        tone === "clay" && "bg-clay-soft border-clay/20",
      )}
    >
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {items.map((item, i) => (
            <li key={i} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "font-mono text-[12px] uppercase tracking-[0.1em] shrink-0",
                    tone === "sage" ? "text-sage" : "text-clay",
                  )}
                >
                  {item.tag}
                </span>
                <span className="text-[14px] font-medium text-foreground">
                  {item.title}
                </span>
              </div>
              {item.detail && (
                <p className="text-[12px] text-muted-foreground pl-[calc(var(--spacing)*0+0px)]">
                  {item.detail}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
