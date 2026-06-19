"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";
import { REGISTRY_KEYS } from "@/templates/registry";
import {
  DEFAULT_FIELDS_SCHEMA,
  BEACH_THEME,
} from "@/templates/sample-data";
import type { TemplateDTO } from "@/lib/types";
import { CURRENCIES } from "@/lib/format-price";
import {
  useCreateTemplate,
  useUpdateTemplate,
} from "@/lib/queries/useTemplates";
import { templateInputSchema } from "@/lib/validation/template";
import { apiErrorMessage } from "@/lib/queries/axios";
import { FileUploadField } from "./FileUploadField";

export function TemplateFormDialog({
  template,
  onClose,
}: {
  template: TemplateDTO | null;
  onClose: () => void;
}) {
  const isEdit = Boolean(template);
  const [name, setName] = useState(template?.name ?? "");
  const [slug, setSlug] = useState(template?.slug ?? "");
  const [category, setCategory] = useState(template?.category ?? "classic");
  const [componentKey, setComponentKey] = useState(
    template?.componentKey ?? REGISTRY_KEYS[0],
  );
  const [thumbnail, setThumbnail] = useState(template?.thumbnail ?? "");
  const [priceAmount, setPriceAmount] = useState(
    String(template?.priceAmount ?? 0),
  );
  const [currency, setCurrency] = useState(template?.currency ?? "UZS");
  const [isPublished, setIsPublished] = useState(template?.isPublished ?? false);
  const [badgeNew, setBadgeNew] = useState(template?.badgeNew ?? false);
  const [badgePopular, setBadgePopular] = useState(template?.badgePopular ?? false);
  const [fieldsSchemaText, setFieldsSchemaText] = useState(
    JSON.stringify(template?.fieldsSchema ?? DEFAULT_FIELDS_SCHEMA, null, 2),
  );
  const [themeText, setThemeText] = useState(
    JSON.stringify(template?.themeDefaults ?? BEACH_THEME, null, 2),
  );
  const [error, setError] = useState<string | null>(null);

  const createMut = useCreateTemplate();
  const updateMut = useUpdateTemplate();
  const saving = createMut.isPending || updateMut.isPending;

  const handleSave = async () => {
    setError(null);
    let fieldsSchema: unknown;
    let themeDefaults: unknown;
    try {
      fieldsSchema = JSON.parse(fieldsSchemaText);
      themeDefaults = JSON.parse(themeText);
    } catch {
      setError("Fields schema / theme must be valid JSON");
      return;
    }

    const parsed = templateInputSchema.safeParse({
      name,
      slug,
      category,
      componentKey,
      thumbnail,
      previewImages: template?.previewImages ?? [],
      fieldsSchema,
      themeDefaults,
      priceAmount: Math.max(0, Math.floor(Number(priceAmount) || 0)),
      currency,
      isPublished,
      badgeNew,
      badgePopular,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Validation failed");
      return;
    }

    try {
      if (isEdit && template) {
        await updateMut.mutateAsync({ id: template.id, input: parsed.data });
      } else {
        await createMut.mutateAsync(parsed.data);
      }
      onClose();
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? "Edit template" : "New template"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              fullWidth
              helperText="lowercase-with-dashes"
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            />
            <TextField
              label="Component"
              select
              value={componentKey}
              onChange={(e) => setComponentKey(e.target.value)}
              fullWidth
            >
              {REGISTRY_KEYS.map((k) => (
                <MenuItem key={k} value={k}>
                  {k}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Price"
              type="number"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
              helperText="Major units: 350000 UZS, 49 USD, 175 EUR"
            />
            <TextField
              label="Currency"
              select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              fullWidth
            >
              {CURRENCIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <FileUploadField
            label="Thumbnail"
            value={thumbnail}
            onChange={setThumbnail}
          />

          <TextField
            label="Fields schema (JSON)"
            value={fieldsSchemaText}
            onChange={(e) => setFieldsSchemaText(e.target.value)}
            multiline
            minRows={6}
            fullWidth
            slotProps={{ htmlInput: { style: { fontFamily: "monospace", fontSize: 12 } } }}
          />
          <TextField
            label="Theme defaults (JSON)"
            value={themeText}
            onChange={(e) => setThemeText(e.target.value)}
            multiline
            minRows={4}
            fullWidth
            slotProps={{ htmlInput: { style: { fontFamily: "monospace", fontSize: 12 } } }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
            }
            label="Published"
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={badgeNew}
                  onChange={(e) => setBadgeNew(e.target.checked)}
                />
              }
              label="Badge: New"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={badgePopular}
                  onChange={(e) => setBadgePopular(e.target.checked)}
                />
              }
              label="Badge: Popular"
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {isEdit ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
