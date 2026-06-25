"use client";

import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type { ThemeDefaults } from "@/lib/validation/template";
import { FONT_PAIR_KEYS } from "@/templates/shared/font-pairs";
import { THEME_PRESETS } from "@/templates/sample-data";

const PRESET_LABELS: Record<string, string> = {
  beach: "Beach",
  islamic: "Islamic",
  "blue-envelope": "Blue envelope",
  "uzb-style": "Uzbek heritage",
};

export function ThemePickerField({
  value,
  onChange,
}: {
  value: ThemeDefaults;
  onChange: (theme: ThemeDefaults) => void;
}) {
  const update = (patch: Partial<ThemeDefaults>) => {
    onChange({ ...value, ...patch });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2" color="text.secondary">
        Theme
      </Typography>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        {Object.entries(THEME_PRESETS).map(([key, preset]) => (
          <Chip
            key={key}
            label={PRESET_LABELS[key] ?? key}
            size="small"
            variant={
              value.backgroundColor === preset.backgroundColor &&
              value.accentColor === preset.accentColor &&
              value.mode === preset.mode
                ? "filled"
                : "outlined"
            }
            onClick={() => onChange({ ...preset })}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          height: 56,
          display: "flex",
        }}
      >
        <Box sx={{ flex: 1, bgcolor: value.backgroundColor }} />
        <Box sx={{ width: 72, bgcolor: value.accentColor }} />
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flex: 1 }}>
          <Box
            component="input"
            type="color"
            value={value.backgroundColor}
            onChange={(e) => update({ backgroundColor: e.target.value })}
            sx={{
              width: 40,
              height: 40,
              border: "none",
              borderRadius: 1,
              cursor: "pointer",
              p: 0,
            }}
          />
          <TextField
            label="Background"
            value={value.backgroundColor}
            onChange={(e) => update({ backgroundColor: e.target.value })}
            size="small"
            fullWidth
          />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flex: 1 }}>
          <Box
            component="input"
            type="color"
            value={value.accentColor}
            onChange={(e) => update({ accentColor: e.target.value })}
            sx={{
              width: 40,
              height: 40,
              border: "none",
              borderRadius: 1,
              cursor: "pointer",
              p: 0,
            }}
          />
          <TextField
            label="Accent"
            value={value.accentColor}
            onChange={(e) => update({ accentColor: e.target.value })}
            size="small"
            fullWidth
          />
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl size="small" fullWidth>
          <InputLabel>Font pair</InputLabel>
          <Select
            label="Font pair"
            value={value.fontPair}
            onChange={(e) => update({ fontPair: e.target.value })}
          >
            {FONT_PAIR_KEYS.map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={value.mode === "dark"}
              onChange={(e) => update({ mode: e.target.checked ? "dark" : "light" })}
            />
          }
          label={value.mode === "dark" ? "Dark mode" : "Light mode"}
          sx={{ ml: 0, minWidth: 140 }}
        />
      </Stack>
    </Stack>
  );
}
