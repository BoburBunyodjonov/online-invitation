/**
 * SINGLE SOURCE OF TRUTH for the platform UI design tokens.
 *
 * Premium burgundy palette inspired by luxury invitation catalogues.
 */

export const palette = {
  primary: {
    main: "#5D2E32",
    light: "#7A4549",
    dark: "#3F1E21",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#8B5A5E",
    light: "#A67B7E",
    dark: "#4A282B",
    contrastText: "#ffffff",
  },
  accent: "#5D2E32",
  background: {
    default: "#FDFBF7",
    paper: "#ffffff",
    subtle: "#F9F6F2",
    catalogue: "#EFEBE7",
  },
  text: {
    primary: "#4A3F3F",
    secondary: "#7D7474",
    disabled: "#A89F9F",
  },
  success: { main: "#1B7A58" },
  warning: { main: "#C4924A" },
  error: { main: "#B84A4A" },
  info: { main: "#5A7A8F" },
  divider: "#E8E2DC",
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const spacingUnit = 8;

export const shadows = {
  soft: "0 4px 24px rgba(93, 46, 50, 0.07)",
  card: "0 8px 32px rgba(93, 46, 50, 0.09)",
  lifted: "0 16px 48px rgba(93, 46, 50, 0.12)",
  header: "0 4px 24px rgba(93, 46, 50, 0.08)",
} as const;

export const fonts = {
  sans: "var(--font-sans)",
  serif: "var(--font-serif)",
  script: "var(--font-script)",
} as const;

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export const cssVariables: Record<string, string> = {
  "--color-brand": palette.primary.main,
  "--color-brand-light": palette.primary.light,
  "--color-brand-dark": palette.primary.dark,
  "--color-accent": palette.accent,
  "--color-bg": palette.background.default,
  "--color-bg-subtle": palette.background.subtle,
  "--color-bg-catalogue": palette.background.catalogue,
  "--color-paper": palette.background.paper,
  "--color-ink": palette.text.primary,
  "--color-ink-soft": palette.text.secondary,
  "--color-divider": palette.divider,
  "--color-success": palette.success.main,
};

export const designTokens = {
  palette,
  radii,
  spacingUnit,
  shadows,
  fonts,
  breakpoints,
  cssVariables,
};

export type DesignTokens = typeof designTokens;
