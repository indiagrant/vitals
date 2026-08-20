import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RatingRow } from "@/components/ui/RatingRow";
import { Button } from "@/components/ui/Button";
import { VITALS_DIMENSIONS, submitCheckIn } from "@/data/mockData";
import type { Employee, HealthMetrics } from "@/types";

interface CheckInViewProps {
  employee: Employee;
  sprint: string;
  onDone: () => void;
}

const NOTE_LIMIT = 80;

export function CheckInView({ employee, sprint, onDone }: CheckInViewProps) {
  const [ratings, setRatings] = useState<Partial<Record<keyof HealthMetrics, number>>>({});
  const [win, setWin] = useState("");
  const [pain, setPain] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const ratedCount = Object.keys(ratings).length;
  const allRated = ratedCount === VITALS_DIMENSIONS.length;
  const ratedValues = Object.values(ratings) as number[];
  const runningAvg = ratedValues.length
    ? ratedValues.reduce((s, v) => s + v, 0) / ratedValues.length
    : null;

  function handleSubmit() {
    // allRated gates the submit button, so every dimension key is present.
    const metrics = ratings as HealthMetrics;
    submitCheckIn(employee.id, sprint, metrics, win.trim(), pain.trim());
    setFinalScore(runningAvg ?? 0);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-5 items-start max-w-md">
        <div className="size-11 rounded-full bg-sage-soft text-sage grid place-items-center">
          <Check className="size-5" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Logged for Sprint {sprint.replace("S", "")}.</h2>
        <p className="text-sm text-muted-foreground">
          Thanks, {employee.name.split(" ")[0]}. This is what feeds your Sprint page — head there any
          time to see the full picture.
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-4xl font-semibold tabular-nums">{finalScore.toFixed(1)}</span>
          <span className="font-mono text-xs uppercase tracking-[0.13em] text-muted-foreground">
            Your check-in
          </span>
        </div>
        <Button onClick={onDone} className="mt-1">
          Go to your Sprint page
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2.5">
        <Eyebrow>Check-in · Sprint {sprint.replace("S", "")}</Eyebrow>
        <h1 className="text-[34px] font-semibold tracking-tight">How was this sprint?</h1>
        <p className="text-sm text-muted-foreground">Six taps, two optional notes — about 90 seconds.</p>
      </div>

      <div className="flex flex-col gap-7">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <span className="font-mono text-xs text-muted-foreground tracking-[0.04em]">
            <b className="text-foreground">{ratedCount}</b>/6 rated
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.13em] text-muted-foreground">
              Running average
            </span>
            <span className="font-mono text-lg font-semibold tabular-nums">
              {runningAvg !== null ? runningAvg.toFixed(1) : "—"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-9">
          {VITALS_DIMENSIONS.map((dim) => (
            <RatingRow
              key={dim.key}
              question={dim.question}
              value={ratings[dim.key] ?? 0}
              onChange={(v) => setRatings((prev) => ({ ...prev, [dim.key]: v }))}
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <NotePanel
          tone="sage"
          eyebrow="Wins worth keeping"
          placeholder="One thing that felt good…"
          value={win}
          onChange={setWin}
        />
        <NotePanel
          tone="clay"
          eyebrow="Worth sitting with"
          placeholder="One thing that didn't…"
          value={pain}
          onChange={setPain}
        />
      </div>

      <div className="flex items-center gap-3.5">
        <Button size="lg" disabled={!allRated} onClick={handleSubmit}>
          Submit check-in
        </Button>
        {!allRated && <span className="text-[12.5px] text-muted-foreground">Rate all six to submit</span>}
      </div>
    </div>
  );
}

function NotePanel({
  tone,
  eyebrow,
  placeholder,
  value,
  onChange,
}: {
  tone: "sage" | "clay";
  eyebrow: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const nearLimit = value.length >= NOTE_LIMIT - 10;

  return (
    <div
      className={cn(
        "rounded-2xl p-7 flex flex-col gap-3.5 border",
        tone === "sage" ? "bg-sage-soft border-sage/20" : "bg-clay-soft border-clay/20",
      )}
    >
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <input
        type="text"
        maxLength={NOTE_LIMIT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-card px-5 py-5 text-[16px] text-foreground placeholder:text-muted-foreground outline-none focus:border-sage"
      />
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] text-muted-foreground">Optional</span>
        <span className={cn("font-mono text-[11px] text-muted-foreground", nearLimit && "text-clay")}>
          {value.length}/{NOTE_LIMIT}
        </span>
      </div>
    </div>
  );
}
