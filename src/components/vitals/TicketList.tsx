import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { VITALS_TICKETS } from "@/data/mockData";
import type { Ticket, TicketStatus } from "@/types";

interface TicketListProps {
  empId: string;
}

const STATUS_LABEL: Record<TicketStatus, string> = {
  done:           "shipped",
  "in-progress":  "in flight",
  blocked:        "blocked",
  "carried-over": "carried over",
};

const STATUS_TONE: Record<TicketStatus, "sage" | "clay" | "muted"> = {
  done:           "sage",
  "in-progress":  "muted",
  blocked:        "clay",
  "carried-over": "clay",
};

export function TicketList({ empId }: TicketListProps) {
  const tickets = VITALS_TICKETS[empId] ?? [];
  if (tickets.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <Eyebrow>What you worked on</Eyebrow>
        <p className="text-sm text-muted-foreground">No tickets on record for this sprint.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <Eyebrow>What you worked on</Eyebrow>
        <span className="font-mono text-[12px] text-muted-foreground tracking-[0.06em] uppercase">
          {tickets.length} tickets
        </span>
      </div>
      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        {tickets.map((t) => (
          <TicketRow key={t.id} ticket={t} />
        ))}
      </ul>
    </section>
  );
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  const tone = STATUS_TONE[ticket.status];
  const overUnder = ticket.estimate > 0 ? ticket.actual / ticket.estimate : 1;
  return (
    <li className="px-5 py-4 flex flex-col gap-2.5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] text-muted-foreground tracking-[0.04em]">
          {ticket.id}
        </span>
        <h3 className="text-[14px] font-medium text-foreground flex-1">{ticket.title}</h3>
        <span
          className={cn(
            "font-mono text-[12px] uppercase tracking-[0.1em]",
            tone === "sage"  && "text-sage",
            tone === "clay"  && "text-clay",
            tone === "muted" && "text-muted-foreground",
          )}
        >
          {STATUS_LABEL[ticket.status]}
        </span>
      </div>

      {/* estimate vs actual — single bar with a tick */}
      {ticket.estimate > 0 && (
        <div className="flex items-center gap-3">
          <EstimateBar estimate={ticket.estimate} actual={ticket.actual} />
          <span className="font-mono text-[12px] tabular-nums text-muted-foreground shrink-0 w-24 text-right">
            {ticket.actual}h / {ticket.estimate}h
            {overUnder > 1.2 && <span className="text-clay ml-1">·{Math.round((overUnder - 1) * 100)}%</span>}
            {overUnder < 0.85 && <span className="text-sage ml-1">·{Math.round((1 - overUnder) * 100)}%</span>}
          </span>
        </div>
      )}

      {ticket.note && (
        <p className="text-[12px] text-muted-foreground italic max-w-2xl">
          "{ticket.note}"
        </p>
      )}
    </li>
  );
}

function EstimateBar({ estimate, actual }: { estimate: number; actual: number }) {
  // bar represents max(estimate, actual); tick at estimate, fill to actual
  const max = Math.max(estimate, actual, 1);
  const tickPct = (estimate / max) * 100;
  const fillPct = (actual / max) * 100;
  const over = actual > estimate;

  return (
    <div className="relative flex-1 h-1.5 rounded-full bg-line-soft overflow-visible">
      {/* fill */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full",
          over ? "bg-clay/70" : "bg-sage/70",
        )}
        style={{ width: `${fillPct}%` }}
      />
      {/* estimate tick */}
      <div
        className="absolute -top-0.5 -bottom-0.5 w-px bg-foreground/60"
        style={{ left: `${tickPct}%` }}
        aria-label="estimate"
      />
    </div>
  );
}
