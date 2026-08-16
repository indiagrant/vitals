import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/teamPulse";

interface PatternSparklineProps {
  values: number[]; // 1-5 scale
  sprints: string[]; // sprint id per point, same length as values
  tone: Tone;
  variant?: "mini" | "full";
  className?: string;
}

const TONE_VAR: Record<Tone, string> = {
  sage: "var(--sage)",
  clay: "var(--clay)",
  neutral: "var(--muted-foreground)",
};

/**
 * Sprint-over-sprint sparkline on a fixed 1-5 domain, so rows stay
 * comparable to each other. The "full" variant (used in the six-dimension
 * grid) adds reference gridlines, an area fill, and per-point tooltips; the
 * "mini" variant (used on signal cards) stays decorative.
 */
export function PatternSparkline({ values, sprints, tone, variant = "mini", className }: PatternSparklineProps) {
  const gradId = useId();
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const big = variant === "full";

  const w = big ? 440 : 220;
  const h = big ? 52 : 32;
  const pad = big ? 10 : 4;
  const color = TONE_VAR[tone];

  const x = (i: number) => pad + (i * (w - pad * 2)) / (values.length - 1);
  const y = (v: number) => pad + (1 - (v - 1) / 4) * (h - pad * 2);
  const points = values.map((v, i) => [x(i), y(v)] as const);

  const areaPoints = [
    `${x(0)},${h - pad}`,
    ...points.map(([px, py]) => `${px},${py}`),
    `${x(values.length - 1)},${h - pad}`,
  ].join(" ");

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className={big ? "block h-[52px] w-full" : "block h-8 w-full"}
      >
        {big &&
          [1, 2, 3, 4, 5].map((v) => (
            <line
              key={v}
              x1={pad}
              x2={w - pad}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--line-soft)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}

        {big && (
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.16} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
        {big && <polygon points={areaPoints} fill={`url(#${gradId})`} />}

        <polyline
          points={points.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={big ? 2 : 1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {points.map(([px, py], i) => {
          const isLast = i === points.length - 1;
          const r = big ? (isLast ? 4.5 : 3) : isLast ? 3 : 2;
          return (
            <g key={sprints[i] ?? i}>
              {big && isLast && <circle cx={px} cy={py} r={r + 4} fill={color} opacity={0.16} />}
              <circle
                cx={px}
                cy={py}
                r={r}
                fill={isLast ? color : "var(--card)"}
                stroke={color}
                strokeWidth={1.75}
                vectorEffect="non-scaling-stroke"
                className={big ? "cursor-pointer" : undefined}
                onMouseEnter={big ? (e) => setHover({ i, x: e.clientX, y: e.clientY }) : undefined}
                onMouseMove={big ? (e) => setHover({ i, x: e.clientX, y: e.clientY }) : undefined}
                onMouseLeave={big ? () => setHover(null) : undefined}
              />
            </g>
          );
        })}
      </svg>

      {big && hover && (
        <div
          className="pointer-events-none fixed z-50 flex flex-col gap-0.5 rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] shadow-lg"
          style={{ left: hover.x + 14, top: hover.y - 10 }}
        >
          <span className="uppercase tracking-[0.08em] text-muted-foreground">{sprints[hover.i]}</span>
          <span className="font-semibold text-foreground">{values[hover.i].toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}
