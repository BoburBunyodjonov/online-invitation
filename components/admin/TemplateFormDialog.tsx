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
  Divider,
} from "@mui/material";
import { REGISTRY_KEYS } from "@/templates/registry";
import {
  DEFAULT_FIELDS_SCHEMA,
  getCatalogDefaultsForComponent,
  getFieldsSchemaForComponent,
  getThemeForComponent,
} from "@/templates/sample-data";
import type { TemplateDTO } from "@/lib/types";
import type { FieldsSchema } from "@/lib/validation/field-schema";
import type { ThemeDefaults } from "@/lib/validation/template";
import { CURRENCIES } from "@/lib/format-price";
import {
  useCreateTemplate,
  useUpdateTemplate,
} from "@/lib/queries/useTemplates";
import { fieldsSchemaSchema } from "@/lib/validation/field-schema";
import { templateInputSchema, themeDefaultsSchema } from "@/lib/validation/template";
import { formatZodError } from "@/lib/validation/format-zod-error";
import { apiErrorMessage } from "@/lib/queries/axios";
import { FileUploadField } from "./FileUploadField";
import { ThemePickerField } from "./ThemePickerField";
import { FieldsSchemaEditor } from "./FieldsSchemaEditor";
import { PreviewImagesField } from "./PreviewImagesField";
import { NewTemplateChecklist } from "./NewTemplateChecklist";

export function TemplateFormDialog({
  template,
  onClose,
}: {
  template: TemplateDTO | null;
  onClose: () => void;
}) {
  const isEdit = Boolean(template);
  const initialKey = template?.componentKey ?? REGISTRY_KEYS[0];
  const initialCatalog = !template ? getCatalogDefaultsForComponent(initialKey) : undefined;
  const [name, setName] = useState(template?.name ?? "");
  const [slug, setSlug] = useState(template?.slug ?? "");
  const [category, setCategory] = useState(template?.category ?? "classic");
  const [componentKey, setComponentKey] = useState(initialKey);
  const [thumbnail, setThumbnail] = useState(
    template?.thumbnail ?? initialCatalog?.thumbnail ?? "",
  );
  const [previewImages, setPreviewImages] = useState<string[]>(
    template?.previewImages ?? initialCatalog?.previewImages ?? [],
  );
  const [priceAmount, setPriceAmount] = useState(
    String(template?.priceAmount ?? 0),
  );
  const [currency, setCurrency] = useState(template?.currency ?? "UZS");
  const [isPublished, setIsPublished] = useState(template?.isPublished ?? false);
  const [badgeNew, setBadgeNew] = useState(template?.badgeNew ?? false);
  const [badgePopular, setBadgePopular] = useState(template?.badgePopular ?? false);
  const [fieldsSchema, setFieldsSchema] = useState<FieldsSchema>(
    (template?.fieldsSchema as FieldsSchema) ?? DEFAULT_FIELDS_SCHEMA,
  );
  const [themeDefaults, setThemeDefaults] = useState<ThemeDefaults>(
    (template?.themeDefaults as ThemeDefaults) ??
      getThemeForComponent(template?.componentKey ?? REGISTRY_KEYS[0]),
  );
  const [thumbnailTouched, setThumbnailTouched] = useState(Boolean(template?.thumbnail));
  const [error, setError] = useState<string | null>(null);

  const applyComponentDefaults = (key: string, resetMedia: boolean) => {
    setFieldsSchema(getFieldsSchemaForComponent(key));
    setThemeDefaults(getThemeForComponent(key));
    if (resetMedia) {
      const catalog = getCatalogDefaultsForComponent(key);
      if (catalog) {
        setThumbnail(catalog.thumbnail);
        setPreviewImages(catalog.previewImages);
        setThumbnailTouched(false);
      }
    }
  };

  const createMut = useCreateTemplate();
  const updateMut = useUpdateTemplate();
  const saving = createMut.isPending || updateMut.isPending;

  const handleSave = async () => {
    setError(null);

    const parsedFields = fieldsSchemaSchema.safeParse(fieldsSchema);
    if (!parsedFields.success) {
      setError(formatZodError(parsedFields.error));
      return;
    }

    const parsedTheme = themeDefaultsSchema.safeParse(themeDefaults);
    if (!parsedTheme.success) {
      setError(formatZodError(parsedTheme.error));
      return;
    }

    const parsed = templateInputSchema.safeParse({
      name,
      slug,
      category,
      componentKey,
      thumbnail,
      previewImages,
      fieldsSchema: parsedFields.data,
      themeDefaults: parsedTheme.data,
      priceAmount: Math.max(0, Math.floor(Number(priceAmount) || 0)),
      currency,
      isPublished,
      badgeNew,
      badgePopular,
    });

    if (!parsed.success) {
      setThumbnailTouched(true);
      setError(formatZodError(parsed.error));
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
          {!isEdit && <NewTemplateChecklist componentKey={componentKey} />}

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
              onChange={(e) => {
                const key = e.target.value;
                setComponentKey(key);
                if (!isEdit) {
                  applyComponentDefaults(key, true);
                }
              }}
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
            onChange={(url) => {
              setThumbnail(url);
              setThumbnailTouched(true);
            }}
            error={thumbnailTouched && !thumbnail.trim() ? "Thumbnail is required" : undefined}
            helperText="Required — upload an image or use the default from the component"
          />

          <PreviewImagesField value={previewImages} onChange={setPreviewImages} />

          <Divider />

          <ThemePickerField value={themeDefaults} onChange={setThemeDefaults} />

          <Divider />

          <FieldsSchemaEditor value={fieldsSchema} onChange={setFieldsSchema} />

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
