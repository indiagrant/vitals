import { useEffect, useState } from "react";

/**
 * Docs-only MDX pages (Colors/Typography/Spacing) render with no `<Story>`
 * in the tree, so Storybook's toolbar theme global and its preview hooks
 * (useGlobals, etc.) aren't reachable here — they only work inside a story
 * or decorator function. This is a small, self-contained light/dark toggle
 * instead: plain React state applying the app's real `dark` class to
 * <html>, which is enough for every var(--token) swatch on the page to
 * repaint. (Storybook's own docs-page chrome stays its fixed white/light
 * background regardless — that's Storybook's shell, not part of the design
 * system, so page copy on these pages uses fixed legible colors rather than
 * theme tokens; only the swatches themselves demonstrate the live values.)
 */
export function ThemeSync() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        padding: "6px 12px",
        borderRadius: 6,
        border: "1px solid #d8d5cb",
        background: "#fff",
        color: "#333",
        cursor: "pointer",
        marginBottom: 16,
      }}
    >
      {dark ? "Switch swatches to light" : "Switch swatches to dark"}
    </button>
  );
}
