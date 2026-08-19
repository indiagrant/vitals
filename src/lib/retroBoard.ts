import {
  VITALS_DIMENSIONS,
  VITALS_REFLECTIONS,
  VITALS_SPRINTS,
  VITALS_SURVEYS,
} from "@/data/mockData";
import type { StickyNote, StickyNoteColor } from "@/types";

export const COLOR_ORDER: StickyNoteColor[] = ["sage", "clay", "yellow", "blue", "pink"];

export const NOTE_PALETTE: Record<
  StickyNoteColor,
  { bg: string; text: string; border: string; dot: string; cssVar: string }
> = {
  sage:   { bg: "bg-sage-soft",        text: "text-sage",        border: "border-sage/20",        dot: "bg-sage",        cssVar: "var(--sage)" },
  clay:   { bg: "bg-clay-soft",        text: "text-clay",        border: "border-clay/20",         dot: "bg-clay",        cssVar: "var(--clay)" },
  yellow: { bg: "bg-note-yellow-soft", text: "text-note-yellow", border: "border-note-yellow/20",  dot: "bg-note-yellow", cssVar: "var(--note-yellow)" },
  blue:   { bg: "bg-note-blue-soft",   text: "text-note-blue",   border: "border-note-blue/20",    dot: "bg-note-blue",   cssVar: "var(--note-blue)" },
  pink:   { bg: "bg-note-pink-soft",   text: "text-note-pink",   border: "border-note-pink/20",    dot: "bg-note-pink",   cssVar: "var(--note-pink)" },
};

export function nextColor(color: StickyNoteColor): StickyNoteColor {
  return COLOR_ORDER[(COLOR_ORDER.indexOf(color) + 1) % COLOR_ORDER.length];
}

// A note's rendered footprint, expressed as a percent of the board — used
// for both the "don't drag off the board" clamp and the overlap math below.
export const NOTE_W_PCT = 19;
export const NOTE_H_PCT = 32;

// A note must be dragged substantially onto another — not just nearby — to
// cluster. Expressed as a fraction of the smaller note's area that must
// overlap.
const CLUSTER_OVERLAP = 0.12;

// Loose scatter so a freshly-generated board doesn't look grid-aligned.
// Cycles for employees with more or fewer seeded notes than this list.
const LAYOUT_SLOTS: Array<{ x: number; y: number }> = [
  { x: 5,  y: 8 },  { x: 30, y: 5 },  { x: 55, y: 10 }, { x: 78, y: 6 },
  { x: 4,  y: 46 }, { x: 27, y: 55 }, { x: 50, y: 47 }, { x: 74, y: 54 },
  { x: 16, y: 70 }, { x: 40, y: 74 }, { x: 62, y: 68 }, { x: 84, y: 30 },
];

function slotRotation(index: number): number {
  return ((index * 37) % 10) - 5;
}

function slotTapeRotation(index: number): number {
  return ((index * 53) % 12) - 6;
}

function clampPct(v: number): number {
  return Math.max(0, Math.min(74, v));
}

type SeedNote = Omit<StickyNote, "x" | "y" | "rot" | "tapeRot" | "pinned">;

// The one standout dimension delta vs. the previous sprint, if any — a
// lightweight, single-sprint-back comparison. Deliberately NOT the
// multi-sprint algorithmic detection Patterns already owns (see CLAUDE.md
// "Patterns page" — Retro prep stays scoped to "this check-in", not a
// cross-sprint shape).
function buildSignalNote(empId: string, sprint: string): SeedNote | null {
  const idx = (VITALS_SPRINTS as readonly string[]).indexOf(sprint);
  if (idx <= 0) return null;
  const prevSprint = VITALS_SPRINTS[idx - 1];

  const current = VITALS_SURVEYS[empId]?.[sprint];
  const prev = VITALS_SURVEYS[empId]?.[prevSprint];
  if (!current || !prev) return null;

  let biggest: { label: string; value: number; delta: number } | null = null;
  for (const dim of VITALS_DIMENSIONS) {
    const delta = current[dim.key] - prev[dim.key];
    if (delta !== 0 && (!biggest || Math.abs(delta) > Math.abs(biggest.delta))) {
      biggest = { label: dim.label, value: current[dim.key], delta };
    }
  }
  if (!biggest || Math.abs(biggest.delta) < 1) return null;

  const direction = biggest.delta > 0 ? "rose" : "fell";
  return {
    id: "signal-delta",
    color: "blue",
    tag: "Signal",
    starred: false,
    text: `${biggest.label} ${direction} to ${biggest.value} this sprint\n${biggest.delta > 0 ? "+" : ""}${biggest.delta} vs ${prevSprint} — worth a mention?`,
  };
}

export function buildSeedNotes(empId: string, sprint: string): StickyNote[] {
  const reflection = VITALS_REFLECTIONS[empId];
  const seeds: SeedNote[] = [];

  reflection?.wins.forEach((w, i) =>
    seeds.push({
      id: `win-${i}`,
      color: "sage",
      tag: "Win",
      starred: false,
      text: w.detail ? `${w.title}\n${w.detail}` : w.title,
    }),
  );
  reflection?.pains.forEach((p, i) =>
    seeds.push({
      id: `pain-${i}`,
      color: "clay",
      tag: "Pain",
      starred: false,
      text: p.detail ? `${p.title}\n${p.detail}` : p.title,
    }),
  );
  reflection?.prompts.forEach((q, i) =>
    seeds.push({ id: `prompt-${i}`, color: "yellow", tag: "Prompt", starred: false, text: q }),
  );

  const signal = buildSignalNote(empId, sprint);
  if (signal) seeds.push(signal);

  return seeds.map((seed, i) => {
    const slot = LAYOUT_SLOTS[i % LAYOUT_SLOTS.length];
    return {
      ...seed,
      x: slot.x,
      y: slot.y,
      rot: slotRotation(i),
      tapeRot: slotTapeRotation(i),
      pinned: i % 2 === 1,
    };
  });
}

export function newBlankNote(index: number): StickyNote {
  return {
    id: `note-${Date.now()}`,
    x: clampPct(28 + Math.random() * 34),
    y: clampPct(22 + Math.random() * 40),
    rot: Math.random() * 10 - 5,
    tapeRot: Math.random() * 12 - 6,
    pinned: index % 2 === 1,
    color: COLOR_ORDER[index % COLOR_ORDER.length],
    tag: "Note",
    starred: false,
    text: "",
  };
}

export function tidyLayout(notes: StickyNote[]): StickyNote[] {
  const cols = 4;
  const marginX = 5;
  const topMargin = 6;
  const bottomMargin = 10;
  const cellW = (100 - marginX * 2) / cols;
  const rows = Math.max(1, Math.ceil(notes.length / cols));
  const cellH = (100 - topMargin - bottomMargin) / rows;

  return notes.map((n, i) => ({
    ...n,
    x: marginX + (i % cols) * cellW,
    y: topMargin + Math.floor(i / cols) * cellH,
    rot: i % 2 === 0 ? -2 : 2,
  }));
}

export interface ClusterBox {
  key: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

function overlapFraction(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): number {
  const ow = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const oh = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (ow <= 0 || oh <= 0) return 0;
  return (ow * oh) / Math.min(a.w * a.h, b.w * b.h);
}

export function computeClusters(notes: StickyNote[]): ClusterBox[] {
  const rects = notes.map((n) => ({ id: n.id, x: n.x, y: n.y, w: NOTE_W_PCT, h: NOTE_H_PCT }));
  const parent = new Map<string, string>();
  rects.forEach((r) => parent.set(r.id, r.id));

  function find(a: string): string {
    let root = a;
    while (parent.get(root) !== root) root = parent.get(root)!;
    parent.set(a, root);
    return root;
  }
  function union(a: string, b: string) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }

  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      if (overlapFraction(rects[i], rects[j]) >= CLUSTER_OVERLAP) union(rects[i].id, rects[j].id);
    }
  }

  const groups = new Map<string, typeof rects>();
  rects.forEach((r) => {
    const root = find(r.id);
    const group = groups.get(root) ?? [];
    group.push(r);
    groups.set(root, group);
  });

  const boxes: ClusterBox[] = [];
  groups.forEach((group) => {
    if (group.length < 2) return;
    const minX = Math.min(...group.map((r) => r.x)) - 3;
    const minY = Math.min(...group.map((r) => r.y)) - 4;
    const maxX = Math.max(...group.map((r) => r.x + r.w)) + 3;
    const maxY = Math.max(...group.map((r) => r.y + r.h)) + 4;
    boxes.push({
      key: group.map((r) => r.id).sort().join("|"),
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY,
    });
  });
  return boxes;
}

export function buildAgendaText(employeeName: string, sprint: string, notes: StickyNote[]): string {
  const sprintLabel = `Sprint ${sprint.replace(/^S/, "")}`;
  const lines = [`Retro prep — ${sprintLabel} (${employeeName})`, ""];
  notes.forEach((n) => {
    if (!n.text.trim()) return;
    const [title, ...rest] = n.text.split("\n");
    const prefix = n.starred ? "★ " : "• ";
    lines.push(`${prefix}[${n.tag}] ${title}`);
    if (rest.length) lines.push(`   ${rest.join(" ")}`);
  });
  if (lines.length === 2) lines.push("(Board is empty — add a note first.)");
  return lines.join("\n");
}
