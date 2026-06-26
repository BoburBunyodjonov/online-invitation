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
import { useTranslations } from "next-intl";
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
  const t = useTranslations("admin");
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

  const zodOptions = {
    fieldLabels: {
      thumbnail: t("validation_thumbnail"),
      slug: t("validation_slug"),
      name: t("validation_name"),
      category: t("validation_category"),
      fieldsSchema: t("validation_fieldsSchema"),
      themeDefaults: t("validation_themeDefaults"),
      previewImages: t("validation_previewImages"),
    },
    invalidOrMissing: (field: string) =>
      t("validation_invalidOrMissing", { field }),
    fallback: t("validation_failed"),
  };

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
      setError(formatZodError(parsedFields.error, zodOptions));
      return;
    }

    const parsedTheme = themeDefaultsSchema.safeParse(themeDefaults);
    if (!parsedTheme.success) {
      setError(formatZodError(parsedTheme.error, zodOptions));
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
      setError(formatZodError(parsed.error, zodOptions));
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
      const msg = apiErrorMessage(e);
      setError(
        msg === "A template with this slug already exists"
          ? t("templateFormSlugExists")
          : msg,
      );
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? t("templateFormEdit") : t("newTemplate")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {!isEdit && <NewTemplateChecklist componentKey={componentKey} />}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label={t("templateFormName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label={t("templateFormSlug")}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              fullWidth
              helperText={t("templateFormSlugHint")}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label={t("templateFormCategory")}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            />
            <TextField
              label={t("templateFormComponent")}
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
              label={t("templateFormPrice")}
              type="number"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
              helperText={t("templateFormPriceHint")}
            />
            <TextField
              label={t("templateFormCurrency")}
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
            label={t("templateFormThumbnail")}
            value={thumbnail}
            onChange={(url) => {
              setThumbnail(url);
              setThumbnailTouched(true);
            }}
            error={
              thumbnailTouched && !thumbnail.trim()
                ? t("templateFormThumbnailRequired")
                : undefined
            }
            helperText={t("templateFormThumbnailHint")}
            uploadLabel={t("upload")}
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
            label={t("published")}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={badgeNew}
                  onChange={(e) => setBadgeNew(e.target.checked)}
                />
              }
              label={t("templateFormBadgeNew")}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={badgePopular}
                  onChange={(e) => setBadgePopular(e.target.checked)}
                />
              }
              label={t("templateFormBadgePopular")}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {isEdit ? t("save") : t("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
