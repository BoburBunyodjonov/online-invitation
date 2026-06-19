import { createTheme, alpha } from "@mui/material/styles";
import {
  palette,
  radii,
  shadows,
  spacingUnit,
  fonts,
  breakpoints,
} from "@/config/design-tokens";

const brand = palette.primary.main;
const brandDark = palette.primary.dark;
const brandLight = palette.primary.light;

/**
 * Platform MUI theme built from the shared design tokens.
 * (Template/invitation pages use their own per-template theme, not this one.)
 */
export const muiTheme = createTheme({
  cssVariables: true,
  spacing: spacingUnit,
  breakpoints: {
    values: {
      xs: breakpoints.xs,
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
    },
  },
  shape: {
    borderRadius: radii.md,
  },
  palette: {
    mode: "light",
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    background: {
      default: palette.background.default,
      paper: palette.background.paper,
    },
    text: {
      primary: palette.text.primary,
      secondary: palette.text.secondary,
      disabled: palette.text.disabled,
    },
    divider: palette.divider,
  },
  typography: {
    fontFamily: fonts.sans,
    h1: { fontFamily: fonts.serif, fontWeight: 600 },
    h2: { fontFamily: fonts.serif, fontWeight: 600 },
    h3: { fontFamily: fonts.serif, fontWeight: 600 },
    h4: { fontFamily: fonts.serif, fontWeight: 600 },
    h5: { fontFamily: fonts.serif, fontWeight: 600 },
    h6: { fontFamily: fonts.serif, fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "a, button": {
          outline: "none",
        },
        "a:focus-visible, button:focus-visible": {
          outline: `2px solid ${alpha(brand, 0.45)}`,
          outlineOffset: 2,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radii.pill,
          paddingInline: 22,
          paddingBlock: 10,
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          border: "none",
          transition: "all 0.22s ease",
        },
        contained: {
          backgroundColor: brand,
          color: "#fff",
          boxShadow: shadows.soft,
          "&:hover": {
            backgroundColor: brandDark,
            boxShadow: shadows.card,
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: shadows.soft,
          },
        },
        outlined: {
          border: `1.5px solid ${alpha(brand, 0.28)}`,
          color: palette.text.primary,
          backgroundColor: alpha("#fff", 0.72),
          backdropFilter: "blur(8px)",
          "&:hover": {
            border: `1.5px solid ${alpha(brand, 0.55)}`,
            backgroundColor: alpha(brand, 0.07),
            boxShadow: shadows.soft,
          },
        },
        text: {
          color: palette.text.secondary,
          "&:hover": {
            backgroundColor: alpha(brand, 0.08),
            color: palette.text.primary,
          },
        },
        sizeLarge: {
          paddingInline: 28,
          paddingBlock: 12,
          fontSize: "1rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: radii.pill,
          border: "none",
        },
        filled: {
          backgroundColor: alpha(brand, 0.12),
          color: brandDark,
          "&:hover": {
            backgroundColor: alpha(brand, 0.18),
          },
        },
        outlined: {
          border: `1.5px solid ${alpha(brand, 0.22)}`,
          backgroundColor: alpha("#fff", 0.5),
          "&:hover": {
            backgroundColor: alpha(brand, 0.06),
            borderColor: alpha(brand, 0.4),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: radii.lg },
        outlined: {
          borderColor: palette.divider,
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radii.xl,
          border: `1px solid ${palette.divider}`,
          boxShadow: shadows.soft,
          backgroundImage: "none",
          overflow: "hidden",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(brand, 0.22),
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(brand, 0.4),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: brand,
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radii.xl,
          border: `1px solid ${palette.divider}`,
          boxShadow: shadows.lifted,
        },
      },
    },
  },
});

export type AppTheme = typeof muiTheme;
