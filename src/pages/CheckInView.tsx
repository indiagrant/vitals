import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RatingRow } from "@/components/ui/RatingRow";
import { Button } from "@/components/ui/Button";
import { VITALS_DIMENSIONS, vitalsAvg } from "@/data/mockData";
import { submitCheckIn, getEmployeeCheckIns, ApiError, type EmployeeCheckIn } from "@/lib/api";
import { extractMetrics } from "@/lib/sprintData";
import type { Employee, HealthMetrics } from "@/types";

interface CheckInViewProps {
  employee: Employee;
  sprint: string;
  onDone: () => void;
}

const NOTE_LIMIT = 80;

// A check-in's reflections can include richer seeded ones (tagged
// "shipped", "workload", etc.) alongside what this form itself wrote —
// only the latter is ever read back in for editing.
function checkInNoteText(checkIn: EmployeeCheckIn, kind: "WIN" | "PAIN"): string {
  return checkIn.reflections.find((r) => r.kind === kind && r.tag === "check-in")?.title ?? "";
}

export function CheckInView({ employee, sprint, onDone }: CheckInViewProps) {
  // Whether this employee already has a check-in for this sprint — fetched
  // once on load, so the page can show "already submitted" instead of the
  // blank form, rather than letting every visit silently re-open it.
  const [checkIns, setCheckIns] = useState<EmployeeCheckIn[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const [ratings, setRatings] = useState<Partial<Record<keyof HealthMetrics, number>>>({});
  const [win, setWin] = useState("");
  const [pain, setPain] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCheckIns(null);
    setLoadError(null);
    getEmployeeCheckIns(employee.id)
      .then((data) => {
        if (!cancelled) setCheckIns(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Couldn't load your check-in status.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [employee.id]);

  const existingCheckIn = checkIns?.find((c) => c.sprintId === sprint) ?? null;
  const ratedCount = Object.keys(ratings).length;
  const allRated = ratedCount === VITALS_DIMENSIONS.length;
  const ratedValues = Object.values(ratings) as number[];
  const runningAvg = ratedValues.length
    ? ratedValues.reduce((s, v) => s + v, 0) / ratedValues.length
    : null;

  function startEditing(checkIn: EmployeeCheckIn) {
    setRatings(extractMetrics(checkIn));
    setWin(checkInNoteText(checkIn, "WIN"));
    setPain(checkInNoteText(checkIn, "PAIN"));
    setSubmitError(null);
    setEditing(true);
  }

  async function handleSubmit() {
    // allRated gates the submit button, so every dimension key is present.
    const metrics = ratings as HealthMetrics;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitCheckIn(employee.id, sprint, metrics, win.trim(), pain.trim());
      // Resubmitting IS editing (same endpoint, replaces rather than
      // accumulates) — refetch so the summary screen reflects it.
      const fresh = await getEmployeeCheckIns(employee.id);
      setCheckIns(fresh);
      setEditing(false);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Couldn't save your check-in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return <p className="text-sm text-clay">{loadError}</p>;
  }

  if (!checkIns) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (existingCheckIn && !editing) {
    return (
      <SubmittedSummary
        employee={employee}
        sprint={sprint}
        score={vitalsAvg(extractMetrics(existingCheckIn))}
        onEdit={() => startEditing(existingCheckIn)}
        onDone={onDone}
      />
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2.5">
        <Eyebrow>Check-in · Sprint {sprint.replace("S", "")}</Eyebrow>
        <h1 className="text-[34px] font-semibold tracking-tight">
          {editing ? "Edit your check-in" : "How was this sprint?"}
        </h1>
        <p className="text-sm text-muted-foreground">Six taps, two optional notes. About 90 seconds.</p>
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

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3.5">
          <Button size="lg" disabled={!allRated || submitting} onClick={handleSubmit}>
            {submitting ? "Submitting…" : editing ? "Save changes" : "Submit check-in"}
          </Button>
          {editing && (
            <Button variant="ghost" disabled={submitting} onClick={() => setEditing(false)}>
              Cancel
            </Button>
          )}
          {!allRated && <span className="text-[12.5px] text-muted-foreground">Rate all six to submit</span>}
        </div>
        {submitError && <p className="text-[12.5px] text-clay">{submitError}</p>}
      </div>
    </div>
  );
}

function SubmittedSummary({
  employee,
  sprint,
  score,
  onEdit,
  onDone,
}: {
  employee: Employee;
  sprint: string;
  score: number;
  onEdit: () => void;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 items-start max-w-md">
      <div className="size-11 rounded-full bg-sage-soft text-sage grid place-items-center">
        <Check className="size-5" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">Logged for Sprint {sprint.replace("S", "")}.</h2>
      <p className="text-sm text-muted-foreground">
        Thanks, {employee.name.split(" ")[0]}. This is what feeds your Sprint page. Head there any
        time to see the full picture.
      </p>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-4xl font-semibold tabular-nums">{score.toFixed(1)}</span>
        <span className="font-mono text-xs uppercase tracking-[0.13em] text-muted-foreground">
          Your check-in
        </span>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <Button onClick={onDone}>Go to your Sprint page</Button>
        <Button variant="outline" onClick={onEdit}>
          Edit your check-in
        </Button>
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
