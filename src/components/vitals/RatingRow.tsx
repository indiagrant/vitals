import { useState } from "react";
import { cn } from "@/lib/utils";

interface RatingRowProps {
  question: string;
  value: number; // 0 = unrated, 1-5 = rated
  onChange: (value: number) => void;
}

function toneFor(value: number) {
  return value >= 4 ? "sage" : value <= 2 ? "clay" : "neutral";
}

/**
 * Interactive counterpart to DimensionBar — tap a segment to rate 1-5.
 * The value column is a fixed width so the question never reflows when a
 * rating (or hover preview) appears next to it.
 */
export function RatingRow({ question, value, onChange }: RatingRowProps) {
  const [preview, setPreview] = useState(0);
  const showing = preview || value;
  const tone = toneFor(showing || 3);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-baseline justify-between gap-3 min-h-[46px]">
        <span className="flex-1 min-w-0 text-[16px] leading-snug">{question}</span>
        <span className="shrink-0 min-w-[36px] text-right font-mono text-[14px] text-muted-foreground">
          {value ? `${value}/5` : preview ? `${preview}/5` : "—"}
        </span>
      </div>
      <div className="flex gap-2" onMouseLeave={() => setPreview(0)}>
        {[1, 2, 3, 4, 5].map((step) => {
          const filled = step <= showing;
          return (
            <button
              key={step}
              type="button"
              aria-label={`${question} — ${step} of 5`}
              onMouseEnter={() => setPreview(step)}
              onClick={() => onChange(step)}
              className={cn(
                "h-4 flex-1 rounded-full transition-colors cursor-pointer",
                filled
                  ? tone === "sage"
                    ? "bg-sage"
                    : tone === "clay"
                    ? "bg-clay"
                    : "bg-foreground/40"
                  : "bg-line-soft",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
