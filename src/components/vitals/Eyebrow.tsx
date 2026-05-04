import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Eyebrow — small mono caps label used throughout Vitals for section headers.
 */
export function Eyebrow({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "muted" | "sage" | "clay" | "fg";
}) {
  return (
    <span
      className={cn(
        "font-mono text-[12px] uppercase tracking-[0.14em]",
        tone === "muted" && "text-muted-foreground",
        tone === "sage"  && "text-sage",
        tone === "clay"  && "text-clay",
        tone === "fg"    && "text-foreground",
        className,
      )}
      {...props}
    />
  );
}
