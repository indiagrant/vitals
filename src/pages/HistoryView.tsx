import { useEffect, useMemo, useState } from "react";
import { Search, Star, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { VITALS_DIMENSIONS, vitalsTickets } from "@/data/mockData";
import { getEmployeeCheckIns, ApiError, type EmployeeCheckIn } from "@/lib/api";
import { historyEntriesFrom, dimensionTone } from "@/lib/history";
import type { HistoryEntry } from "@/lib/history";
import type { Employee, TicketStatus } from "@/types";

interface HistoryViewProps {
  employee: Employee;
}

type FilterKey = "all" | "wins" | "pains" | "tickets" | "prompts";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "wins", label: "Wins" },
  { key: "pains", label: "Pains" },
  { key: "tickets", label: "Tickets" },
  { key: "prompts", label: "Prompts" },
];

const TICKET_DOT: Record<TicketStatus, string> = {
  done: "bg-sage",
  "in-progress": "bg-muted-foreground/50",
  blocked: "bg-clay",
  "carried-over": "bg-note-yellow",
};

const TONE_ACCENT: Record<string, string> = {
  sage: "bg-sage",
  clay: "bg-clay",
  neutral: "bg-muted-foreground/40",
};

function entryMatchesSearch(entry: HistoryEntry, query: string): boolean {
  if (!query) return true;
  const haystack = [
    entry.title,
    entry.synopsis,
    entry.sprint,
    ...entry.wins.map((w) => `${w.title} ${w.detail} ${w.tag}`),
    ...entry.pains.map((p) => `${p.title} ${p.detail} ${p.tag}`),
    ...entry.tickets.map((t) => `${t.id} ${t.title}`),
    ...entry.prompts,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

/**
 * Employee "History" — a chronological journal of past check-ins (wins,
 * pains, tickets, prompts), not a stats/chart surface. Deliberately
 * non-overlapping with Patterns (cross-sprint dimension shape) — see
 * CLAUDE.md "Patterns page" for the full boundary.
 *
 * Scores, wins/pains, and prompts come from the real API. Tickets still
 * come from mockData.ts — no tickets endpoint yet, the same deliberate,
 * flagged gap as the Sprint page's TicketList.
 */
export function HistoryView({ employee }: HistoryViewProps) {
  const [checkIns, setCheckIns] = useState<EmployeeCheckIn[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCheckIns(null);
    setError(null);
    getEmployeeCheckIns(employee.id)
      .then((data) => {
        if (!cancelled) setCheckIns(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Couldn't load your history.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [employee.id]);

  const entries = useMemo(
    () => (checkIns ? historyEntriesFrom(checkIns, (sprintId) => vitalsTickets(employee.id, sprintId)) : null),
    [checkIns, employee.id],
  );

  if (error) {
    return <p className="text-sm text-clay">{error}</p>;
  }

  if (!entries) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  // Keyed by employee so switching users resets expanded/starred/search
  // state rather than carrying one person's UI state over to another's.
  return <HistoryJournal key={employee.id} entries={entries} />;
}

// Split out from HistoryView so its state initializers (e.g. "newest entry
// starts expanded") run once real entries exist, not on an empty first
// render while the fetch is still in flight.
function HistoryJournal({ entries }: { entries: HistoryEntry[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(entries[0] ? [entries[0].sprint] : []));
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  function toggleExpanded(sprint: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sprint)) next.delete(sprint);
      else next.add(sprint);
      return next;
    });
  }

  function toggleStarred(sprint: string) {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(sprint)) next.delete(sprint);
      else next.add(sprint);
      return next;
    });
  }

  function jumpTo(sprint: string) {
    const alreadyExpanded = expanded.has(sprint);
    toggleExpanded(sprint);
    // Only scroll on the expand transition — collapsing shouldn't also jump.
    if (!alreadyExpanded) {
      document.getElementById(`history-entry-${sprint}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const query = search.trim();
  const visibleEntries = entries.filter((e) => entryMatchesSearch(e, query));
  const isExpanded = (entry: HistoryEntry) => (query ? true : filter !== "all" ? true : expanded.has(entry.sprint));

  return (
    <div className="flex flex-col gap-9">
      <div className="flex max-w-2xl flex-col gap-3">
        <Eyebrow>History · {entries.length} entries</Eyebrow>
        <h1 className="text-[34px] leading-[1.15] font-semibold tracking-tight text-balance">
          Every sprint, in your words.
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A log of every check-in you've submitted. Search, filter, or jump to a sprint.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
          <span className="font-mono text-[10.5px] tracking-[0.09em] text-muted-foreground uppercase">
            Each entry's dots
          </span>
          <LegendItem tone="sage" label="Thriving" />
          <LegendItem tone="neutral" label="Steady" />
          <LegendItem tone="clay" label="Struggling" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <label className="flex min-w-60 items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your entries…"
              className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[12.5px] transition-colors cursor-pointer",
                  filter === f.key
                    ? "border-sage bg-sage-soft font-medium text-sage"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <nav aria-label="Jump to sprint" className="flex flex-wrap items-center gap-2">
        {entries.map((entry) => (
          <button
            key={entry.sprint}
            type="button"
            onClick={() => jumpTo(entry.sprint)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11.5px] tracking-[0.03em] transition-colors cursor-pointer",
              expanded.has(entry.sprint)
                ? "border-sage bg-sage-soft text-sage"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            <span className={cn("size-1.5 rounded-full", TONE_ACCENT[entry.tone])} />
            Sprint {entry.sprint.replace("S", "")} · {entry.dates}
          </button>
        ))}
      </nav>

      {visibleEntries.length === 0 ? (
        <div className="max-w-3xl rounded-2xl border border-dashed border-border p-8 text-center text-[13.5px] text-muted-foreground">
          No entries match "{query}".
        </div>
      ) : (
        <div className="columns-1 gap-7 lg:columns-2">
          {visibleEntries.map((entry) => (
            <HistoryEntryCard
              key={entry.sprint}
              entry={entry}
              expanded={isExpanded(entry)}
              starred={starred.has(entry.sprint)}
              filter={filter}
              onToggle={() => toggleExpanded(entry.sprint)}
              onToggleStar={() => toggleStarred(entry.sprint)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LegendItem({ tone, label }: { tone: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-1.5 rounded-full", TONE_ACCENT[tone])} />
      {label}
    </span>
  );
}

function HistoryEntryCard({
  entry,
  expanded,
  starred,
  filter,
  onToggle,
  onToggleStar,
}: {
  entry: HistoryEntry;
  expanded: boolean;
  starred: boolean;
  filter: FilterKey;
  onToggle: () => void;
  onToggleStar: () => void;
}) {
  function sectionClass(key: FilterKey) {
    return filter !== "all" && filter !== key ? "opacity-30" : undefined;
  }

  return (
    <article
      id={`history-entry-${entry.sprint}`}
      className="mb-7 break-inside-avoid rounded-[1.125rem] border border-border bg-card"
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex cursor-pointer flex-col gap-3 rounded-[1.125rem] px-7 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sage"
      >
        <div className="flex items-center justify-between gap-4">
          <Eyebrow>
            Sprint {entry.sprint.replace("S", "")} · {entry.dates}
          </Eyebrow>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex gap-1">
              {entry.moods.map((m, i) => (
                <span
                  key={VITALS_DIMENSIONS[i].key}
                  title={`${VITALS_DIMENSIONS[i].label}: ${m}`}
                  className={cn(
                    "size-[7px] rounded-full",
                    dimensionTone(m) === "sage" && "bg-sage",
                    dimensionTone(m) === "clay" && "bg-clay",
                    dimensionTone(m) === "neutral" && "bg-muted-foreground/45",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar();
              }}
              aria-pressed={starred}
              title="Flag for retro"
              className={cn(
                "grid size-6 place-items-center rounded-md text-border transition-colors cursor-pointer hover:text-muted-foreground",
                starred && "text-gold hover:text-gold",
              )}
            >
              <Star className="size-[17px]" fill={starred ? "currentColor" : "none"} />
            </button>
            <ChevronRight className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-90")} />
          </div>
        </div>

        <h2 className="text-[1.65rem] leading-tight font-semibold tracking-tight text-balance">{entry.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{entry.synopsis}</p>
      </div>

      {expanded && (
        <div className="flex flex-col gap-6 border-t border-line-soft px-7 pt-6 pb-7">
          <div className={sectionClass("wins")}>
            <Eyebrow className="mb-2.5 block">Wins worth keeping</Eyebrow>
            {entry.wins.length === 0 ? (
              <p className="text-[12.5px] text-muted-foreground italic">No wins logged this sprint — yet.</p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {entry.wins.map((w, i) => (
                  <div key={i} className="flex flex-col gap-0.5 border-l-2 border-sage pl-3">
                    <span className="font-mono text-[10.5px] tracking-[0.08em] text-sage uppercase">{w.tag}</span>
                    <p className="text-base leading-snug font-medium">"{w.title}"</p>
                    {w.detail && <span className="text-[12.5px] text-muted-foreground">{w.detail}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={sectionClass("pains")}>
            <Eyebrow className="mb-2.5 block">Worth sitting with</Eyebrow>
            {entry.pains.length === 0 ? (
              <p className="text-[12.5px] text-muted-foreground italic">Nothing surfaced. That's a kind of signal too.</p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {entry.pains.map((p, i) => (
                  <div key={i} className="flex flex-col gap-0.5 border-l-2 border-clay pl-3">
                    <span className="font-mono text-[10.5px] tracking-[0.08em] text-clay uppercase">{p.tag}</span>
                    <p className="text-base leading-snug font-medium">"{p.title}"</p>
                    {p.detail && <span className="text-[12.5px] text-muted-foreground">{p.detail}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={sectionClass("tickets")}>
            <Eyebrow className="mb-2.5 block">What you worked on</Eyebrow>
            {entry.tickets.length === 0 ? (
              <p className="text-[12.5px] text-muted-foreground italic">No tickets on record for this sprint.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {entry.tickets.map((t) => (
                  <span
                    key={t.id}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1.5 text-[12.5px]"
                  >
                    <span className={cn("size-1.5 shrink-0 rounded-full", TICKET_DOT[t.status])} />
                    <span className="font-mono text-[11px] text-muted-foreground">{t.id}</span>
                    {t.title}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={sectionClass("prompts")}>
            <Eyebrow className="mb-2.5 block">Prompts you sat with</Eyebrow>
            {entry.prompts.length === 0 ? (
              <p className="text-[12.5px] text-muted-foreground italic">No prompts on record for this sprint.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {entry.prompts.map((p, i) => (
                  <li key={i} className="relative pl-4 text-[13.5px] text-foreground/85 italic">
                    <span className="absolute left-0 text-muted-foreground">—</span>
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
