import { buildAgendaText, computeClusters, COLOR_ORDER, NOTE_W_PCT, nextColor, tidyLayout } from "./retroBoard";
import type { StickyNote } from "@/types";

function makeNote(overrides: Partial<StickyNote> = {}): StickyNote {
  return {
    id: "n1",
    x: 0,
    y: 0,
    rot: 0,
    tapeRot: 0,
    pinned: false,
    color: "sage",
    tag: "Note",
    starred: false,
    text: "",
    ...overrides,
  };
}

describe("nextColor", () => {
  it("cycles through COLOR_ORDER and wraps at the end", () => {
    for (let i = 0; i < COLOR_ORDER.length - 1; i++) {
      expect(nextColor(COLOR_ORDER[i])).toBe(COLOR_ORDER[i + 1]);
    }
    expect(nextColor(COLOR_ORDER[COLOR_ORDER.length - 1])).toBe(COLOR_ORDER[0]);
  });
});

describe("tidyLayout", () => {
  it("lays notes into a 4-column grid, wrapping to a new row at index 4", () => {
    const notes = Array.from({ length: 5 }, (_, i) => makeNote({ id: `n${i}`, x: 50, y: 50 }));
    const laid = tidyLayout(notes);
    expect(laid[4].x).toBe(5); // marginX — back to column 0
    expect(laid[4].y).toBeGreaterThan(laid[0].y); // row 2
  });

  it("alternates rotation by even/odd index", () => {
    const notes = Array.from({ length: 4 }, (_, i) => makeNote({ id: `n${i}` }));
    const laid = tidyLayout(notes);
    expect(laid[0].rot).toBe(-2);
    expect(laid[1].rot).toBe(2);
  });

  it("preserves other note fields", () => {
    const notes = [makeNote({ id: "n0", color: "clay", text: "hello", starred: true })];
    const laid = tidyLayout(notes);
    expect(laid[0]).toMatchObject({ id: "n0", color: "clay", text: "hello", starred: true });
  });
});

describe("computeClusters", () => {
  it("clusters two notes that overlap enough", () => {
    const a = makeNote({ id: "a", x: 10, y: 10 });
    const b = makeNote({ id: "b", x: 25, y: 10 });
    const clusters = computeClusters([a, b]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].noteIds.sort()).toEqual(["a", "b"]);
  });

  it("does not cluster notes that are far apart", () => {
    const a = makeNote({ id: "a", x: 0, y: 0 });
    const b = makeNote({ id: "b", x: 80, y: 80 });
    expect(computeClusters([a, b])).toEqual([]);
  });

  it("unions three notes into one cluster via transitivity even when the outer two don't directly overlap", () => {
    // a-b overlap, b-c overlap, but a and c (2x the a-b offset, wider than
    // NOTE_W_PCT) don't touch directly — union-find should still merge all three.
    const a = makeNote({ id: "a", x: 10, y: 10 });
    const b = makeNote({ id: "b", x: 25, y: 10 });
    const c = makeNote({ id: "c", x: 40, y: 10 });
    expect(25 - 10).toBeLessThan(NOTE_W_PCT); // sanity: a-b actually overlap
    expect(40 - 10).toBeGreaterThan(NOTE_W_PCT); // sanity: a-c do not
    const clusters = computeClusters([a, b, c]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].noteIds.sort()).toEqual(["a", "b", "c"]);
  });

  it("derives the cluster key from sorted note ids, independent of input order", () => {
    const b = makeNote({ id: "b", x: 10, y: 10 });
    const a = makeNote({ id: "a", x: 25, y: 10 });
    const clusters = computeClusters([b, a]);
    expect(clusters[0].key).toBe("a|b");
  });
});

describe("buildAgendaText", () => {
  it("formats the header from the employee name and sprint, stripping the leading S", () => {
    const text = buildAgendaText("Maya Chen", "S24", []);
    expect(text.split("\n")[0]).toBe("Retro prep — Sprint 24 (Maya Chen)");
  });

  it("skips notes with blank text", () => {
    const notes = [makeNote({ id: "n1", text: "   " }), makeNote({ id: "n2", text: "Real note" })];
    const text = buildAgendaText("Maya Chen", "S24", notes);
    expect(text).toContain("Real note");
    expect(text.split("\n").filter((l) => l.trim() === "")).not.toContain("   ");
  });

  it("prefixes starred notes with a star and others with a bullet", () => {
    const notes = [
      makeNote({ id: "n1", starred: true, tag: "Pain", text: "Important thing" }),
      makeNote({ id: "n2", starred: false, tag: "Win", text: "Normal thing" }),
    ];
    const text = buildAgendaText("Maya Chen", "S24", notes);
    expect(text).toContain("★ [Pain] Important thing");
    expect(text).toContain("• [Win] Normal thing");
  });

  it("renders a multi-line note as a title line plus an indented detail line", () => {
    const notes = [makeNote({ text: "Title here\nDetail line" })];
    const text = buildAgendaText("Maya Chen", "S24", notes);
    expect(text).toContain("[Note] Title here");
    expect(text).toContain("   Detail line");
  });

  it("shows a placeholder line when there are no notes with real text", () => {
    expect(buildAgendaText("Maya Chen", "S24", [])).toContain("(Board is empty — add a note first.)");
  });
});

// buildSeedNotes reads live mockData state (VITALS_REFLECTIONS/VITALS_SURVEYS
// via buildSignalNote), so this block resets the module registry before
// every test — see CLAUDE.md "Testing".
describe("buildSeedNotes", () => {
  let mockData: typeof import("@/data/mockData");
  let retroBoard: typeof import("./retroBoard");

  beforeEach(async () => {
    vi.resetModules();
    mockData = await import("@/data/mockData");
    retroBoard = await import("./retroBoard");
  });

  it("creates one note per win/pain/prompt with the right color and tag", () => {
    const reflection = mockData.VITALS_REFLECTIONS.E001;
    const notes = retroBoard.buildSeedNotes("E001", "S24");

    const wins = notes.filter((n) => n.tag === "Win");
    expect(wins).toHaveLength(reflection.wins.length);
    expect(wins.every((n) => n.color === "sage")).toBe(true);

    const pains = notes.filter((n) => n.tag === "Pain");
    expect(pains).toHaveLength(reflection.pains.length);
    expect(pains.every((n) => n.color === "clay")).toBe(true);

    const prompts = notes.filter((n) => n.tag === "Prompt");
    expect(prompts).toHaveLength(reflection.prompts.length);
    expect(prompts.every((n) => n.color === "yellow")).toBe(true);
  });

  it("includes a Signal note when the two most recent sprints have a meaningful dimension delta", () => {
    // E001's teamCollaboration rose from 4 (S23) to 5 (S24).
    const notes = retroBoard.buildSeedNotes("E001", "S24");
    const signal = notes.find((n) => n.tag === "Signal");
    expect(signal).toBeDefined();
    expect(signal?.color).toBe("blue");
    expect(signal?.text).toContain("Team collaboration");
  });

  it("omits the Signal note for the first sprint (no previous sprint to compare)", () => {
    const notes = retroBoard.buildSeedNotes("E001", "S20");
    expect(notes.find((n) => n.tag === "Signal")).toBeUndefined();
  });

  it("populates x/y/rot/tapeRot and alternates pinned by index parity", () => {
    const notes = retroBoard.buildSeedNotes("E001", "S24");
    notes.forEach((n, i) => {
      expect(typeof n.x).toBe("number");
      expect(typeof n.y).toBe("number");
      expect(n.pinned).toBe(i % 2 === 1);
    });
  });
});
