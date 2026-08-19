import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { Star, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { NOTE_PALETTE } from "@/lib/retroBoard";
import type { StickyNote as StickyNoteData } from "@/types";

interface StickyNoteProps {
  note: StickyNoteData;
  dragging: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onChangeText: (value: string) => void;
  onDelete: () => void;
  onCycleColor: () => void;
  onToggleStar: () => void;
}

/**
 * A single draggable, editable corkboard note. Position/rotation are truly
 * continuous drag state, so those stay inline style; everything else is
 * Tailwind to match the rest of the app's components.
 */
export function StickyNote({
  note,
  dragging,
  onPointerDown,
  onChangeText,
  onDelete,
  onCycleColor,
  onToggleStar,
}: StickyNoteProps) {
  const palette = NOTE_PALETTE[note.color];
  const showPin = note.starred || note.pinned;
  const pinColor = note.starred ? "var(--gold)" : palette.cssVar;
  const stop = (e: ReactPointerEvent) => e.stopPropagation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Plain textareas don't grow with their content — without this, a note
  // longer than the min-height box scrolls internally instead of the card
  // growing to fit, which reads as broken on a whiteboard where the whole
  // point is seeing everything at once.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [note.text]);

  return (
    <div
      className={cn(
        "absolute w-[236px] touch-none select-none",
        dragging ? "z-50 cursor-grabbing" : "z-10 cursor-grab",
      )}
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        transform: [
          `rotate(${note.rot}deg)`,
          dragging && "scale(1.05)",
          note.starred && "translateY(-4px)",
        ]
          .filter(Boolean)
          .join(" "),
      }}
      onPointerDown={onPointerDown}
    >
      {showPin ? (
        <div
          className="absolute -top-2 left-1/2 z-20 size-4 -ml-2 rounded-full shadow-[0_2px_4px_oklch(0.2_0.02_70/_0.35),inset_0_1px_1px_oklch(1_0_0/_0.5)]"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${pinColor}, ${pinColor} 40%, oklch(0.3 0.05 40 / 0.9) 100%)`,
          }}
        />
      ) : (
        <div
          className="absolute -top-2.5 left-1/2 z-20 h-[22px] w-[58px] -ml-[29px] border border-[oklch(0.7_0.02_90/_0.4)] bg-[oklch(0.96_0.02_90/_0.75)] shadow-[0_2px_4px_oklch(0.2_0.02_70/_0.15)]"
          style={{ transform: `rotate(${note.tapeRot}deg)` }}
        />
      )}

      <div
        className={cn(
          "relative rounded-[10px] border p-3.5 pb-4 transition-shadow",
          palette.bg,
          note.starred
            ? "border-2 border-gold shadow-[0_0_0_3px_var(--gold-soft),0_18px_30px_-10px_oklch(0.64_0.13_75/_0.45),0_4px_10px_oklch(0.2_0.02_70/_0.18)]"
            : cn(
                palette.border,
                "shadow-[0_14px_26px_-12px_oklch(0.2_0.02_70/_0.35),0_2px_6px_oklch(0.2_0.02_70/_0.12)]",
                dragging &&
                  "shadow-[0_22px_34px_-12px_oklch(0.2_0.02_70/_0.45),0_4px_10px_oklch(0.2_0.02_70/_0.18)]",
              ),
        )}
      >
        <div className="mb-2 flex items-start justify-between">
          <span
            className={cn("font-mono text-[11px] font-medium uppercase tracking-[0.09em]", palette.text)}
          >
            {note.tag}
          </span>
          <div className="flex items-center gap-2" onPointerDown={stop}>
            <button
              onClick={onToggleStar}
              title="Star this note"
              className={cn(
                "grid size-[19px] cursor-pointer place-items-center text-foreground opacity-45 hover:opacity-90",
                note.starred && "text-gold opacity-100",
              )}
            >
              <Star className="size-[17px]" fill={note.starred ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onCycleColor}
              title="Change color"
              className={cn("size-[17px] cursor-pointer rounded-full border border-black/15", palette.dot)}
            />
            <button
              onClick={onDelete}
              aria-label="Delete note"
              className="grid size-5 cursor-pointer place-items-center text-foreground opacity-40 hover:opacity-90"
            >
              <X className="size-[15px]" />
            </button>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          id={`retro-note-${note.id}`}
          value={note.text}
          onChange={(e) => onChangeText(e.target.value)}
          onPointerDown={stop}
          placeholder="Type here…"
          rows={1}
          className="min-h-[102px] w-full resize-none overflow-hidden border-none bg-transparent font-hand text-[19px] leading-snug text-foreground outline-none placeholder:font-sans placeholder:text-[13px] placeholder:text-muted-foreground/70"
        />
      </div>
    </div>
  );
}
