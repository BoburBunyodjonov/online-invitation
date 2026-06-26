"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type { TemplateDTO } from "@/lib/types";
import { thumbnailSchema } from "@/lib/validation/template";
import { useUpdateTemplate } from "@/lib/queries/useTemplates";
import { apiErrorMessage } from "@/lib/queries/axios";
import { TemplateCoverField } from "./TemplateCoverField";

export function TemplateCoverDialog({
  template,
  onClose,
}: {
  template: TemplateDTO;
  onClose: () => void;
}) {
  const t = useTranslations("admin");
  const [cover, setCover] = useState(template.thumbnail ?? "");
  const [error, setError] = useState<string | null>(null);
  const updateMut = useUpdateTemplate();

  const handleSave = async () => {
    setError(null);
    const parsed = thumbnailSchema.safeParse(cover);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("templateFormThumbnailRequired"));
      return;
    }

    try {
      await updateMut.mutateAsync({
        id: template.id,
        input: { thumbnail: parsed.data },
      });
      onClose();
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("editCover")}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TemplateCoverField
          templateName={template.name}
          previewHref={`/templates/${template.slug}/preview`}
          value={cover}
          onChange={setCover}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button variant="contained" onClick={handleSave} disabled={updateMut.isPending}>
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
