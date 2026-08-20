import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PatternSparkline } from "@/components/ui/PatternSparkline";
import { detectPatternSignals, patternDeltaDisplay, patternSprintWindow } from "@/lib/patterns";
import { VITALS_DIMENSIONS, vitalsTrend } from "@/data/mockData";
import type { Employee } from "@/types";

interface PatternsViewProps {
  employee: Employee;
}

const TONE_CARD_ACTIVE: Record<string, string> = {
  sage: "border-sage shadow-[0_0_0_3px_var(--sage-soft)]",
  clay: "border-clay shadow-[0_0_0_3px_var(--clay-soft)]",
  neutral: "border-foreground/30 shadow-[0_0_0_3px_var(--muted)]",
};

const TONE_TAG: Record<string, string> = {
  sage: "bg-sage-soft text-sage",
  clay: "bg-clay-soft text-clay",
  neutral: "border border-border text-muted-foreground",
};

const TONE_TEXT: Record<string, string> = {
  sage: "text-sage",
  clay: "text-clay",
  neutral: "text-muted-foreground",
};

const TONE_ROW_HIGHLIGHT: Record<string, string> = {
  sage: "border-l-sage bg-sage-soft",
  clay: "border-l-clay bg-clay-soft",
  neutral: "border-l-foreground/30 bg-muted",
};

/**
 * Employee "Patterns" — recurring shape across a trailing window of sprints
 * (see CLAUDE.md "Patterns page"), not a chronological read of check-ins;
 * that's History's job. Signal cards are algorithmically detected, not
 * authored — clicking one highlights its row in the full six-dimension grid.
 */
export function PatternsView({ employee }: PatternsViewProps) {
  const [activeDim, setActiveDim] = useState<string | null>(null);
  const [previewDim, setPreviewDim] = useState<string | null>(null);

  const sprints = patternSprintWindow();
  const signals = detectPatternSignals(employee.id);
  const signalByDim = Object.fromEntries(signals.map((s) => [s.dim, s]));

  const headline =
    signals.length === 0
      ? "Nothing stood out yet."
      : `${signals.length} thing${signals.length > 1 ? "s" : ""} kept showing up.`;

  return (
    <div className="flex max-w-[68rem] flex-col gap-10">
      <div className="flex flex-col gap-2.5">
        <Eyebrow>Patterns · last {sprints.length} sprints</Eyebrow>
        <h1 className="max-w-2xl text-[34px] leading-[1.15] font-semibold tracking-tight text-balance">
          {headline}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          A look back across your last {sprints.length} check-ins — not a new score, just what repeated.
          {signals.length > 0 && " Click a card to see its shape across the full stretch."}
        </p>
      </div>

      {signals.length > 0 && (
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {signals.map((sig) => {
            const dim = VITALS_DIMENSIONS.find((d) => d.key === sig.dim)!;
            const values = vitalsTrend(employee.id, sig.dim).slice(-sprints.length);
            const isActive = activeDim === sig.dim;

            return (
              <button
                key={sig.dim}
                type="button"
                onClick={() => setActiveDim(isActive ? null : sig.dim)}
                onMouseEnter={() => setPreviewDim(sig.dim)}
                onMouseLeave={() => setPreviewDim(null)}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border bg-card p-[1.125rem] text-left transition-[border-color,box-shadow] cursor-pointer",
                  isActive ? TONE_CARD_ACTIVE[sig.tone] : "border-border hover:border-foreground/20",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm leading-snug font-semibold">{dim.label}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-[0.45rem] py-[0.2rem] font-mono text-[10px] font-medium tracking-[0.1em] uppercase whitespace-nowrap",
                      TONE_TAG[sig.tone],
                    )}
                  >
                    {sig.tag}
                  </span>
                </div>
                <p className="m-0 min-h-[2.6em] text-[13px] leading-relaxed text-muted-foreground">
                  {sig.sentence}
                </p>
                <PatternSparkline values={values} sprints={sprints} tone={sig.tone} variant="mini" />
              </button>
            );
          })}
        </section>
      )}

      <section className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between pb-3">
          <Eyebrow>All six dimensions</Eyebrow>
          <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">
            {sprints[0]} → {sprints[sprints.length - 1]}
          </span>
        </div>

        <div className="flex flex-col">
          {VITALS_DIMENSIONS.map((d) => {
            const values = vitalsTrend(employee.id, d.key).slice(-sprints.length);
            const current = values[values.length - 1];
            const signal = signalByDim[d.key];
            const rowTone = signal ? signal.tone : current >= 4 ? "sage" : current <= 2 ? "clay" : "neutral";
            const isHighlighted = activeDim === d.key;
            const isPreview = !isHighlighted && previewDim === d.key;
            const delta = patternDeltaDisplay(values, signal);

            return (
              <div
                key={d.key}
                className={cn(
                  "grid grid-cols-[13rem_1fr_7.5rem] items-center gap-6 rounded-xl border-b border-l-[3px] border-line-soft border-l-transparent px-3 py-[1.125rem] transition-colors",
                  isPreview && "bg-muted",
                  isHighlighted && TONE_ROW_HIGHLIGHT[rowTone],
                )}
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-semibold">{d.label}</span>
                  <span className="truncate text-xs text-muted-foreground">{d.question}</span>
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <PatternSparkline values={values} sprints={sprints} tone={rowTone} variant="full" />
                  <div className="flex justify-between px-0.5 font-mono text-[10px] text-muted-foreground">
                    {sprints.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0.5">
                  <span className="font-mono text-xl leading-none font-semibold tabular-nums">
                    {current.toFixed(1)}
                  </span>
                  <span className={cn("font-mono text-xs tabular-nums", TONE_TEXT[delta.tone])}>
                    {delta.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
