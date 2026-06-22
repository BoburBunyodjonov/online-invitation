"use client";

import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { CaretDownIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import type { FieldDef, FieldsSchema, FieldSection } from "@/lib/validation/field-schema";
import { FIELD_SECTION_ORDER } from "@/lib/validation/field-schema";
import type { Locale } from "@/config/locales";
import { ICON_KEYS } from "@/templates/shared/icon-map";
import { getByPath, setByPath, type Path } from "./path-utils";
import { FileUploadField } from "./FileUploadField";

interface SchemaFormProps {
  schema: FieldsSchema;
  value: Record<string, unknown>;
  editLocale: Locale;
  onChange: (next: Record<string, unknown>) => void;
}

function groupBySection(schema: FieldsSchema) {
  const groups = new Map<FieldSection | "other", Array<[string, FieldDef]>>();

  for (const [name, def] of Object.entries(schema)) {
    const section = def.section ?? "other";
    const list = groups.get(section) ?? [];
    list.push([name, def]);
    groups.set(section, list);
  }

  const ordered: Array<{
    section: FieldSection | "other";
    fields: Array<[string, FieldDef]>;
  }> = [];

  for (const section of FIELD_SECTION_ORDER) {
    const fields = groups.get(section);
    if (fields?.length) ordered.push({ section, fields });
  }

  const other = groups.get("other");
  if (other?.length) ordered.push({ section: "other", fields: other });

  return ordered;
}

export function SchemaForm({
  schema,
  value,
  editLocale,
  onChange,
}: SchemaFormProps) {
  const t = useTranslations("admin.fields");
  const sections = groupBySection(schema);

  const update = (path: Path, v: unknown) =>
    onChange(setByPath(value, path, v));

  const fieldLabel = (name: string, def: FieldDef) => {
    if (t.has(name as Parameters<typeof t.has>[0])) {
      return t(name as Parameters<typeof t>[0]);
    }
    return def.label ?? name;
  };

  const sectionLabel = (section: FieldSection | "other") => {
    if (section === "other") return t("section_other");
    const key = `section_${section}` as Parameters<typeof t>[0];
    if (t.has(key as Parameters<typeof t.has>[0])) {
      return t(key);
    }
    return section;
  };

  const renderField = (def: FieldDef, path: Path, label: string) => {
    const current = getByPath(value, path);

    if (
      def.localized &&
      (def.type === "text" || def.type === "textarea")
    ) {
      const localizedPath = [...path, editLocale];
      const localizedVal = (getByPath(value, localizedPath) as string) ?? "";
      return (
        <TextField
          key={path.join(".")}
          label={label}
          value={localizedVal}
          onChange={(e) => update(localizedPath, e.target.value)}
          fullWidth
          multiline={def.type === "textarea"}
          minRows={def.type === "textarea" ? 3 : undefined}
          helperText={def.help}
        />
      );
    }

    switch (def.type) {
      case "text":
      case "textarea":
        return (
          <TextField
            key={path.join(".")}
            label={label}
            value={(current as string) ?? ""}
            onChange={(e) => update(path, e.target.value)}
            fullWidth
            multiline={def.type === "textarea"}
            minRows={def.type === "textarea" ? 3 : undefined}
            helperText={def.help}
          />
        );

      case "date":
        return (
          <TextField
            key={path.join(".")}
            label={label}
            type="date"
            value={(current as string) ?? ""}
            onChange={(e) => update(path, e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        );

      case "time":
        return (
          <TextField
            key={path.join(".")}
            label={label}
            type="time"
            value={(current as string) ?? ""}
            onChange={(e) => update(path, e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        );

      case "number":
        return (
          <TextField
            key={path.join(".")}
            label={label}
            type="number"
            value={(current as number) ?? ""}
            onChange={(e) => update(path, Number(e.target.value))}
            fullWidth
          />
        );

      case "boolean":
        return (
          <FormControlLabel
            key={path.join(".")}
            control={
              <Switch
                checked={Boolean(current)}
                onChange={(e) => update(path, e.target.checked)}
              />
            }
            label={label}
          />
        );

      case "iconKey":
        return (
          <TextField
            key={path.join(".")}
            label={label}
            select
            value={(current as string) ?? ""}
            onChange={(e) => update(path, e.target.value)}
            fullWidth
          >
            {ICON_KEYS.map((k) => (
              <MenuItem key={k} value={k}>
                {k}
              </MenuItem>
            ))}
          </TextField>
        );

      case "image":
        return (
          <FileUploadField
            key={path.join(".")}
            label={label}
            value={current as string}
            onChange={(url) => update(path, url)}
          />
        );

      case "audio":
        return (
          <FileUploadField
            key={path.join(".")}
            label={label}
            accept="audio/*"
            preview={false}
            value={current as string}
            onChange={(url) => update(path, url)}
          />
        );

      case "image[]": {
        const arr = (current as string[]) ?? [];
        return (
          <Box key={path.join(".")}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {label}
            </Typography>
            <Stack spacing={2}>
              {arr.map((url, i) => (
                <Stack
                  key={i}
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Box sx={{ flex: 1 }}>
                    <FileUploadField
                      label={t("galleryItem", { index: i + 1 })}
                      value={url}
                      onChange={(u) => update([...path, i], u)}
                    />
                  </Box>
                  <IconButton
                    onClick={() =>
                      update(path, arr.filter((_, idx) => idx !== i))
                    }
                  >
                    <TrashIcon weight="duotone" />
                  </IconButton>
                </Stack>
              ))}
              <Button
                startIcon={<PlusIcon weight="bold" />}
                onClick={() => update(path, [...arr, ""])}
                sx={{ alignSelf: "flex-start" }}
              >
                {t("addImage")}
              </Button>
            </Stack>
          </Box>
        );
      }

      case "object":
        return (
          <Paper
            key={path.join(".")}
            variant="outlined"
            sx={{ p: 2, borderRadius: 2 }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {label}
            </Typography>
            <Stack spacing={2}>
              {Object.entries(def.fields ?? {}).map(([k, d]) =>
                renderField(d, [...path, k], fieldLabel(k, d)),
              )}
            </Stack>
          </Paper>
        );

      case "list": {
        const arr = (current as unknown[]) ?? [];
        return (
          <Box key={path.join(".")}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {label}
            </Typography>
            <Stack spacing={2}>
              {arr.map((_, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("scheduleItem", { index: i + 1 })}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        update(path, arr.filter((_, idx) => idx !== i))
                      }
                    >
                      <TrashIcon weight="duotone" />
                    </IconButton>
                  </Stack>
                  <Stack spacing={2}>
                    {Object.entries(def.itemFields ?? {}).map(([k, d]) =>
                      renderField(d, [...path, i, k], fieldLabel(k, d)),
                    )}
                  </Stack>
                </Paper>
              ))}
              <Button
                startIcon={<PlusIcon weight="bold" />}
                onClick={() => update(path, [...arr, {}])}
                sx={{ alignSelf: "flex-start" }}
              >
                {t("addScheduleItem")}
              </Button>
            </Stack>
          </Box>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Stack spacing={1}>
      {sections.map(({ section, fields }, index) => (
        <Accordion
          key={section}
          defaultExpanded={index < 3}
          disableGutters
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px !important",
            "&:before": { display: "none" },
            overflow: "hidden",
          }}
        >
          <AccordionSummary expandIcon={<CaretDownIcon weight="bold" />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {sectionLabel(section)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2.5}>
              {fields.map(([name, def]) =>
                renderField(def, [name], fieldLabel(name, def)),
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
