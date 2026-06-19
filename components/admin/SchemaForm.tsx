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
} from "@mui/material";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import type { FieldDef, FieldsSchema } from "@/lib/validation/field-schema";
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

export function SchemaForm({
  schema,
  value,
  editLocale,
  onChange,
}: SchemaFormProps) {
  const update = (path: Path, v: unknown) =>
    onChange(setByPath(value, path, v));

  const renderField = (def: FieldDef, path: Path, label: string) => {
    const current = getByPath(value, path);

    // Localized text/textarea: edit the value for the active locale.
    if (
      def.localized &&
      (def.type === "text" || def.type === "textarea")
    ) {
      const localizedPath = [...path, editLocale];
      const localizedVal = (getByPath(value, localizedPath) as string) ?? "";
      return (
        <TextField
          key={path.join(".")}
          label={`${label} (${editLocale})`}
          value={localizedVal}
          onChange={(e) => update(localizedPath, e.target.value)}
          fullWidth
          multiline={def.type === "textarea"}
          minRows={def.type === "textarea" ? 2 : undefined}
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
            minRows={def.type === "textarea" ? 2 : undefined}
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
                      label={`Image ${i + 1}`}
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
                Add image
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
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {label}
            </Typography>
            <Stack spacing={2}>
              {Object.entries(def.fields ?? {}).map(([k, d]) =>
                renderField(d, [...path, k], d.label ?? k),
              )}
            </Stack>
          </Paper>
        );

      case "list": {
        const arr = (current as unknown[]) ?? [];
        return (
          <Box key={path.join(".")}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {label}
            </Typography>
            <Stack spacing={2}>
              {arr.map((_, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", mb: 1 }}
                  >
                    <Typography variant="subtitle2">Item {i + 1}</Typography>
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
                      renderField(d, [...path, i, k], d.label ?? k),
                    )}
                  </Stack>
                </Paper>
              ))}
              <Button
                startIcon={<PlusIcon weight="bold" />}
                onClick={() => update(path, [...arr, {}])}
                sx={{ alignSelf: "flex-start" }}
              >
                Add item
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
    <Stack spacing={3}>
      {Object.entries(schema).map(([name, def]) =>
        renderField(def, [name], def.label ?? name),
      )}
    </Stack>
  );
}
