import { useEffect, useRef, useState, type MouseEvent } from "react";
import { PULSE_BASELINE, toneForScore, type Tone } from "@/lib/teamPulse";
import type { Team, TeamCheckIn } from "@/types";

interface TeamTraceProps {
  team: Team;
  size?: "sm" | "lg";
}

interface TooltipState {
  x: number;
  y: number;
  checkin: TeamCheckIn;
}

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function toneVar(tone: Tone): string {
  if (tone === "sage") return "--sage";
  if (tone === "clay") return "--clay";
  return "--muted-foreground";
}

/**
 * One beat per check-in: a small ECG-style complex (notch, spike, overshoot,
 * settle) whose direction and height are driven by that check-in's score
 * relative to PULSE_BASELINE — not random noise.
 */
function beatOffsets(norm: number): Array<[x: number, y: number]> {
  return [
    [0.00, 0],
    [0.28, 0],
    [0.35, norm * -0.10],
    [0.44, norm * 1.00],
    [0.53, norm * -0.32],
    [0.63, norm * 0.10],
    [0.76, 0],
    [1.00, 0],
  ];
}

function draw(canvas: HTMLCanvasElement, team: Team, big: boolean) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;
  const dpr = window.devicePixelRatio || 1;
  const wantW = Math.round(rect.width * dpr);
  const wantH = Math.round(rect.height * dpr);
  if (canvas.width !== wantW) canvas.width = wantW;
  if (canvas.height !== wantH) canvas.height = wantH;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const midY = rect.height / 2;
  const amp = rect.height * 0.42;
  const n = team.checkins.length;
  const segW = rect.width / n;

  ctx.lineWidth = big ? 2 : 1.7;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  team.checkins.forEach((c, i) => {
    const color = cssVar(toneVar(toneForScore(c.score)));
    const norm = Math.max(-1, Math.min(1, (c.score - PULSE_BASELINE) / 2));
    const x0 = i * segW;
    const pts = beatOffsets(norm);

    ctx.strokeStyle = color;
    ctx.beginPath();
    pts.forEach(([px, py], j) => {
      const x = x0 + px * segW;
      const y = midY - py * amp;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const [peakX, peakY] = pts[3];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x0 + peakX * segW, midY - peakY * amp, big ? 3 : 2.25, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Static pulse trace for a team — each beat is one person's check-in
 * (VITALS_TEAMS[].checkins), not a live or animated signal.
 */
export function TeamTrace({ team, size = "sm" }: TeamTraceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const big = size === "lg";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    draw(canvas, team, big);

    const ro = new ResizeObserver(() => draw(canvas, team, big));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [team, big]);

  function handleMove(e: MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.max(
      0,
      Math.min(team.checkins.length - 1, Math.floor((x / rect.width) * team.checkins.length)),
    );
    setTooltip({ x: e.clientX, y: e.clientY, checkin: team.checkins[idx] });
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={
          big
            ? "w-full h-[92px] block rounded-xl bg-line-soft"
            : "w-full h-[58px] block rounded-lg bg-line-soft"
        }
        onMouseMove={handleMove}
        onMouseLeave={() => setTooltip(null)}
      />
      {/* Canvas has no accessible content of its own (and its per-point
          tooltip is mouse-only) — this is the real text equivalent. */}
      <ul className="sr-only">
        {team.checkins.map((c) => (
          <li key={c.name}>
            {c.name}: {c.score.toFixed(1)} out of 5
          </li>
        ))}
      </ul>
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none rounded-lg bg-foreground text-background font-mono text-[11.5px] leading-tight px-2.5 py-1.5 shadow-lg"
          style={{ left: tooltip.x + 14, top: tooltip.y + 16 }}
        >
          <span className="font-semibold">{tooltip.checkin.name}</span>
          <span className="opacity-75 ml-1.5">{tooltip.checkin.score.toFixed(1)} / 5</span>
        </div>
      )}
    </div>
  );
}
