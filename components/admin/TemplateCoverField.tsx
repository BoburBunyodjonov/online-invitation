"use client";

import { Box, Paper, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { TemplateCardPreview } from "@/components/landing/TemplateCardPreview";
import { FileUploadField } from "./FileUploadField";

export function TemplateCoverField({
  templateName,
  previewHref = "#",
  value,
  onChange,
  error,
}: {
  templateName: string;
  previewHref?: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) {
  const t = useTranslations("admin");

  return (
    <Stack spacing={2}>
      <FileUploadField
        label={t("templateFormCover")}
        value={value}
        onChange={onChange}
        error={error}
        helperText={t("templateFormCoverHint")}
        uploadLabel={t("upload")}
      />

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          {t("templateFormCoverPreview")}
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "var(--color-bg-subtle)",
            overflow: "hidden",
            "& .catalogue-card-visual--link": {
              pointerEvents: "none",
            },
            "& .catalogue-card-hover": {
              display: "none",
            },
          }}
        >
          <div className="catalogue-card-visual-wrap" style={{ maxWidth: 320, margin: "0 auto" }}>
            <TemplateCardPreview
              thumbnail={value}
              name={templateName || t("templateFormName")}
              previewHref={previewHref}
              previewLabel={t("templateFormCoverPreview")}
            />
          </div>
        </Paper>
      </Box>
    </Stack>
  );
}
