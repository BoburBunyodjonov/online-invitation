/**
 * Named font pairings a template can pick via themeDefaults.fontPair.
 * These reference the CSS variables loaded once in app/layout.tsx via next/font.
 */
export const FONT_PAIRS: Record<
  string,
  { heading: string; script: string; body: string }
> = {
  "playfair-vibes": {
    heading: "var(--font-serif)",
    script: "var(--font-script)",
    body: "var(--font-sans)",
  },
};

export const FONT_PAIR_KEYS = Object.keys(FONT_PAIRS);

export function resolveFontPair(key: string) {
  return FONT_PAIRS[key] ?? FONT_PAIRS["playfair-vibes"];
}
