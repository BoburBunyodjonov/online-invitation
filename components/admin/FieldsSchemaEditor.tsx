"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CaretDownIcon } from "@phosphor-icons/react";
import {
  FIELD_SECTION_ORDER,
  type FieldSection,
  type FieldsSchema,
  fieldsSchemaSchema,
} from "@/lib/validation/field-schema";
import { DEFAULT_FIELDS_SCHEMA } from "@/templates/sample-data";

const SECTION_LABELS: Record<FieldSection, string> = {
  couple: "Couple",
  event: "Event",
  text: "Text",
  verse: "Verse",
  venue: "Venue",
  schedule: "Schedule",
  media: "Media",
  settings: "Settings",
};

function fieldsBySection(): Record<FieldSection, string[]> {
  const grouped = Object.fromEntries(
    FIELD_SECTION_ORDER.map((s) => [s, [] as string[]]),
  ) as Record<FieldSection, string[]>;

  for (const [key, def] of Object.entries(DEFAULT_FIELDS_SCHEMA)) {
    const section = def.section ?? "text";
    grouped[section].push(key);
  }
  return grouped;
}

const GROUPED_FIELDS = fieldsBySection();

export function FieldsSchemaEditor({
  value,
  onChange,
}: {
  value: FieldsSchema;
  onChange: (schema: FieldsSchema) => void;
}) {
  const [advanced, setAdvanced] = useState(false);
  const [jsonText, setJsonText] = useState(() => JSON.stringify(value, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (!advanced) {
      setJsonText(JSON.stringify(value, null, 2));
    }
  }, [value, advanced]);

  const enabledKeys = useMemo(() => new Set(Object.keys(value)), [value]);

  const toggleField = (key: string, enabled: boolean) => {
    const next = { ...value };
    if (enabled) {
      const def = DEFAULT_FIELDS_SCHEMA[key];
      if (def) next[key] = def;
    } else {
      delete next[key];
    }
    onChange(next);
  };

  const applyJson = (): boolean => {
    try {
      const parsed = JSON.parse(jsonText);
      const validated = fieldsSchemaSchema.safeParse(parsed);
      if (!validated.success) {
        setJsonError(validated.error.issues[0]?.message ?? "Invalid schema");
        return false;
      }
      setJsonError(null);
      onChange(validated.data);
      return true;
    } catch {
      setJsonError("Must be valid JSON");
      return false;
    }
  };

  const leaveAdvanced = () => {
    if (applyJson()) setAdvanced(false);
  };

  if (advanced) {
    return (
      <Stack spacing={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={advanced}
              onChange={(e) => {
                if (!e.target.checked) leaveAdvanced();
              }}
            />
          }
          label="Advanced JSON editor"
        />
        {jsonError && <Alert severity="error">{jsonError}</Alert>}
        <TextField
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          onBlur={applyJson}
          multiline
          minRows={8}
          fullWidth
          slotProps={{
            htmlInput: { style: { fontFamily: "monospace", fontSize: 12 } },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Changes apply on blur. Toggle off to return to the visual editor.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Editable fields
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={advanced}
              onChange={(e) => setAdvanced(e.target.checked)}
            />
          }
          label="Advanced JSON"
          sx={{ mr: 0 }}
        />
      </Stack>

      {FIELD_SECTION_ORDER.map((section) => {
        const keys = GROUPED_FIELDS[section];
        if (!keys.length) return null;
        const enabledInSection = keys.filter((k) => enabledKeys.has(k)).length;

        return (
          <Accordion
            key={section}
            disableGutters
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              "&:before": { display: "none" },
              borderRadius: "8px !important",
              overflow: "hidden",
              mb: 1,
            }}
          >
            <AccordionSummary expandIcon={<CaretDownIcon size={18} />}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {SECTION_LABELS[section]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {enabledInSection}/{keys.length}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 0.5,
                }}
              >
                {keys.map((key) => {
                  const def = DEFAULT_FIELDS_SCHEMA[key];
                  return (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          size="small"
                          checked={enabledKeys.has(key)}
                          onChange={(e) => toggleField(key, e.target.checked)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2">
                            {def?.label ?? key}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {key} · {def?.type}
                          </Typography>
                        </Box>
                      }
                    />
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
