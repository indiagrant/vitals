import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Badge — small mono-caps tone label. Reuses the app-wide sage/clay/muted
 * tone vocabulary (see Eyebrow, DimensionBar) rather than its own color
 * system, so a status reads consistently wherever it appears.
 */
export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone: "sage" | "clay" | "muted";
}) {
  return (
    <span
      className={cn(
        "font-mono text-[12px] uppercase tracking-[0.1em]",
        tone === "sage"  && "text-sage",
        tone === "clay"  && "text-clay",
        tone === "muted" && "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
