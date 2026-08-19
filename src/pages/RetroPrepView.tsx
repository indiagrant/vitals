import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ClipboardList, LayoutGrid, Maximize2, Minimize2, Plus, RotateCcw, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/vitals/Eyebrow";
import { StickyNote } from "@/components/vitals/StickyNote";
import {
  buildAgendaText,
  buildSeedNotes,
  computeClusters,
  newBlankNote,
  nextColor,
  tidyLayout,
} from "@/lib/retroBoard";
import type { Employee, StickyNote as StickyNoteData } from "@/types";

interface RetroPrepViewProps {
  employee: Employee;
  sprint: string;
}

const CORK_BACKGROUND_IMAGE = [
  "radial-gradient(circle at 12% 22%, oklch(0.6 0.03 70 / 0.10) 0 1.2px, transparent 1.6px)",
  "radial-gradient(circle at 68% 8%, oklch(0.6 0.03 70 / 0.08) 0 1px, transparent 1.5px)",
  "radial-gradient(circle at 40% 62%, oklch(0.6 0.03 70 / 0.09) 0 1.2px, transparent 1.6px)",
  "radial-gradient(circle at 86% 48%, oklch(0.6 0.03 70 / 0.07) 0 1px, transparent 1.5px)",
  "radial-gradient(circle at 22% 85%, oklch(0.6 0.03 70 / 0.09) 0 1.2px, transparent 1.6px)",
  "radial-gradient(circle at 92% 88%, oklch(0.6 0.03 70 / 0.08) 0 1px, transparent 1.5px)",
].join(", ");

const NOTE_DRAG_W = 236;
const NOTE_DRAG_H = 168;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function ToolButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof LayoutGrid;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground hover:border-sage hover:bg-sage-soft hover:text-sage"
    >
      <Icon className="size-[15px]" />
      {label}
    </button>
  );
}

export function RetroPrepView({ employee, sprint }: RetroPrepViewProps) {
  const [notes, setNotes] = useState<StickyNoteData[]>(() => buildSeedNotes(employee.id, sprint));
  const [clusterTitles, setClusterTitles] = useState<Record<string, string>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const [present, setPresent] = useState(false);
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy text");
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const agendaRef = useRef<HTMLTextAreaElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // A fresh board (with its own starting talking points) per employee/sprint —
  // mirrors how CheckInView / SprintView re-derive from mockData on prop change.
  useEffect(() => {
    setNotes(buildSeedNotes(employee.id, sprint));
    setClusterTitles({});
    setDragId(null);
  }, [employee.id, sprint]);

  // Runs after React has committed the new note's DOM node — a plain
  // requestAnimationFrame in the click handler raced the commit and could
  // leave focus stuck on the FAB button, where a stray Space keystroke
  // re-triggers its click and silently spawns duplicate notes.
  useEffect(() => {
    if (!pendingFocusId) return;
    document.getElementById(`retro-note-${pendingFocusId}`)?.focus();
    setPendingFocusId(null);
  }, [pendingFocusId, notes]);

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      if (!dragId) return;
      const board = boardRef.current;
      if (!board) return;
      const rect = board.getBoundingClientRect();
      const x = clamp(e.clientX - rect.left - dragOffset.current.x, 0, Math.max(0, rect.width - NOTE_DRAG_W));
      const y = clamp(e.clientY - rect.top - dragOffset.current.y, 0, Math.max(0, rect.height - NOTE_DRAG_H));
      const xPct = (x / rect.width) * 100;
      const yPct = (y / rect.height) * 100;
      setNotes((prev) => prev.map((n) => (n.id === dragId ? { ...n, x: xPct, y: yPct } : n)));
    }
    function handleUp() {
      setDragId(null);
    }
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragId]);

  function handlePointerDownCard(e: ReactPointerEvent<HTMLDivElement>, note: StickyNoteData) {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left - (note.x / 100) * rect.width,
      y: e.clientY - rect.top - (note.y / 100) * rect.height,
    };
    setNotes((prev) => [...prev.filter((n) => n.id !== note.id), note]);
    setDragId(note.id);
  }

  function handleAddNote() {
    const note = newBlankNote(notes.length);
    setNotes((prev) => [...prev, note]);
    setPendingFocusId(note.id);
  }

  function handleTidy() {
    setNotes((prev) => tidyLayout(prev));
    setClusterTitles({});
  }

  function handleReset() {
    setNotes(buildSeedNotes(employee.id, sprint));
    setClusterTitles({});
    setDragId(null);
  }

  function handleOpenAgenda() {
    setCopyLabel("Copy text");
    setAgendaOpen(true);
    requestAnimationFrame(() => {
      agendaRef.current?.focus();
      agendaRef.current?.select();
    });
  }

  function handleCopyAgenda() {
    const el = agendaRef.current;
    if (el) {
      el.focus();
      el.select();
      try {
        document.execCommand("copy");
      } catch {
        // best-effort — the textarea stays selected for a manual copy either way
      }
    }
    setCopyLabel("Copied!");
    setTimeout(() => setCopyLabel("Copy text"), 1500);
  }

  const clusters = useMemo(() => computeClusters(notes), [notes]);
  const agendaText = useMemo(
    () => buildAgendaText(employee.name, sprint, notes),
    [employee.name, sprint, notes],
  );

  const board = (
    <div
      ref={boardRef}
      id="retro-corkboard"
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-border",
        "bg-[oklch(0.9_0.018_75)] shadow-[inset_0_2px_10px_oklch(0.22_0.02_70/_0.1),inset_0_0_0_6px_oklch(0.97_0.008_80/_0.5)]",
        present ? "h-full" : "flex-1 min-h-[520px]",
      )}
      style={{ backgroundImage: CORK_BACKGROUND_IMAGE, backgroundSize: "130px 130px, 90px 90px, 150px 150px, 110px 110px, 100px 100px, 140px 140px" }}
    >
      <button
        onClick={() => setPresent((p) => !p)}
        title={present ? "Exit present mode" : "Enter present mode"}
        className="absolute left-3.5 top-3.5 z-[6] grid size-[34px] cursor-pointer place-items-center rounded-lg border border-border bg-card/85 text-foreground shadow-sm"
      >
        {present ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
      </button>

      {clusters.map((box) => (
        <div
          key={box.key}
          className="absolute z-0 rounded-[18px] border-2 border-dashed border-sage/40 bg-sage/5 transition-[left,top,width,height] duration-100"
          style={{ left: `${box.left}%`, top: `${box.top}%`, width: `${box.width}%`, height: `${box.height}%` }}
        >
          <input
            type="text"
            value={clusterTitles[box.key] ?? ""}
            onChange={(e) => setClusterTitles((prev) => ({ ...prev, [box.key]: e.target.value }))}
            onPointerDown={(e) => e.stopPropagation()}
            placeholder="Name this group…"
            className="absolute -top-3 left-4 z-[3] min-w-[110px] max-w-[70%] rounded-full border border-sage bg-card px-2.5 py-[3px] font-mono text-[10.5px] uppercase tracking-[0.07em] text-sage outline-none placeholder:font-sans placeholder:text-[11px] placeholder:normal-case placeholder:tracking-normal placeholder:text-sage/55"
          />
        </div>
      ))}

      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          dragging={note.id === dragId}
          onPointerDown={(e) => handlePointerDownCard(e, note)}
          onChangeText={(value) => setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, text: value } : n)))}
          onChangeTag={(value) => setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, tag: value } : n)))}
          onDelete={() => setNotes((prev) => prev.filter((n) => n.id !== note.id))}
          onCycleColor={() =>
            setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, color: nextColor(n.color) } : n)))
          }
          onToggleStar={() =>
            setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, starred: !n.starred } : n)))
          }
        />
      ))}

      <button
        onClick={(e) => {
          e.currentTarget.blur();
          handleAddNote();
        }}
        title="Add a blank note"
        className="absolute bottom-6 right-6 z-[5] grid size-[52px] cursor-pointer place-items-center rounded-full bg-sage text-primary-foreground shadow-[0_10px_22px_-8px_oklch(0.22_0.008_130/_0.4)] transition-transform hover:scale-[1.06]"
      >
        <Plus className="size-[22px]" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-6">
      {!present && (
        <div className="flex items-start justify-between gap-5">
          <div className="flex max-w-xl flex-col gap-1.5">
            <Eyebrow>Retro prep</Eyebrow>
            <h1 className="text-3xl font-semibold tracking-tight">Get your thoughts on the board.</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Auto-pulled talking points from this sprint — drag them around, add your own, delete what
              doesn&rsquo;t matter.
            </p>
          </div>
          <div className="flex shrink-0 items-start gap-2 pt-0.5">
            <ToolButton icon={LayoutGrid} label="Tidy board" onClick={handleTidy} />
            <ToolButton icon={RotateCcw} label="Reset board" onClick={handleReset} />
            <ToolButton icon={ClipboardList} label="Copy as agenda" onClick={handleOpenAgenda} />
          </div>
        </div>
      )}

      {present ? <div className="fixed inset-0 z-[100] bg-background p-4">{board}</div> : board}

      {agendaOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[oklch(0.2_0.01_130/_0.45)]"
          onClick={() => setAgendaOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-[480px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-20px_oklch(0.2_0.02_70/_0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-[18px] py-4">
              <span className="text-[15px] font-semibold">Copy as agenda</span>
              <button
                onClick={() => setAgendaOpen(false)}
                aria-label="Close"
                className="grid size-[26px] cursor-pointer place-items-center rounded-md text-muted-foreground hover:bg-secondary"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-3 overflow-auto px-[18px] py-4">
              <textarea
                ref={agendaRef}
                readOnly
                value={agendaText}
                className="min-h-[280px] w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-[12.5px] leading-relaxed text-foreground outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAgendaOpen(false)}
                  className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground"
                >
                  Close
                </button>
                <button
                  onClick={handleCopyAgenda}
                  className="min-w-[92px] cursor-pointer rounded-lg bg-sage px-4 py-2 text-[13px] font-semibold text-primary-foreground"
                >
                  {copyLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
