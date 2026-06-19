"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { FloppyDiskIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/config/locales";
import {
  useAdminSiteSettings,
  useUpdateSiteSettings,
} from "@/lib/queries/useSiteSettings";
import { apiErrorMessage } from "@/lib/queries/axios";
import type { SiteSettingsTexts } from "@/lib/site-settings/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

type FormState = {
  contactPhone: string;
  telegramUsername: string;
  texts: SiteSettingsTexts;
};

export function SiteSettingsForm() {
  const t = useTranslations("admin");
  const { data, isPending, isError, refetch } = useAdminSiteSettings();
  const saveMut = useUpdateSiteSettings();
  const [tab, setTab] = useState<Locale>("uz");
  const [form, setForm] = useState<FormState | null>(null);
  const [saved, setSaved] = useState(false);

  const active = form ?? data;

  const localeFields = useMemo(
    () =>
      [
        { key: "heroBadge" as const, label: t("settingsHeroBadge"), section: "hero" },
        { key: "heroHeadline" as const, label: t("settingsHeroHeadline"), section: "hero" },
        { key: "heroHeadlineAccent" as const, label: t("settingsHeroHeadlineAccent"), section: "hero" },
        { key: "heroDescription" as const, label: t("settingsHeroDescription"), section: "hero", multiline: true },
        { key: "heroCtaPrimary" as const, label: t("settingsHeroCtaPrimary"), section: "hero" },
        { key: "heroCtaSecondary" as const, label: t("settingsHeroCtaSecondary"), section: "hero" },
        { key: "seoTitle" as const, label: t("settingsSeoTitle"), section: "seo" },
        { key: "seoDescription" as const, label: t("settingsSeoDescription"), section: "seo", multiline: true },
        { key: "seoKeywords" as const, label: t("settingsSeoKeywords"), section: "seo", multiline: true },
        { key: "seoOgTitle" as const, label: t("settingsSeoOgTitle"), section: "seo" },
        { key: "seoOgDescription" as const, label: t("settingsSeoOgDescription"), section: "seo", multiline: true },
        { key: "orderCtaTitle" as const, label: t("settingsOrderCtaTitle"), section: "order" },
        { key: "orderCtaSubtitle" as const, label: t("settingsOrderCtaSubtitle"), section: "order", multiline: true },
        { key: "orderCtaTelegram" as const, label: t("settingsOrderCtaTelegram"), section: "order" },
        { key: "contactTitle" as const, label: t("settingsContactTitle"), section: "contact" },
        { key: "contactSubtitle" as const, label: t("settingsContactSubtitle"), section: "contact", multiline: true },
      ] as const,
    [t],
  );

  if (isPending || !active) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={360} />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        sx={{ borderRadius: 3 }}
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        }
      >
        {t("loadError")}
      </Alert>
    );
  }

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setSaved(false);
    setForm((prev) => ({ ...(prev ?? active), [key]: value }));
  };

  const updateLocaleText = (
    locale: Locale,
    key: keyof SiteSettingsTexts[Locale],
    value: string,
  ) => {
    setSaved(false);
    setForm((prev) => {
      const base = prev ?? active;
      return {
        ...base,
        texts: {
          ...base.texts,
          [locale]: {
            ...base.texts[locale],
            [key]: value,
          },
        },
      };
    });
  };

  const handleSave = async () => {
    const payload = form ?? active;
    await saveMut.mutateAsync({
      contactPhone: payload.contactPhone.trim(),
      telegramUsername: payload.telegramUsername.trim(),
      texts: payload.texts,
    });
    setForm(null);
    setSaved(true);
  };

  return (
    <Stack spacing={3}>
      <AdminPageHeader
        title={t("settings")}
        subtitle={t("settingsSubtitle")}
        action={
          <Button
            variant="contained"
            startIcon={<FloppyDiskIcon weight="bold" />}
            onClick={handleSave}
            disabled={saveMut.isPending}
          >
            {t("settingsSave")}
          </Button>
        }
      />

      {saved && (
        <Alert severity="success" sx={{ borderRadius: 3 }} onClose={() => setSaved(false)}>
          {t("settingsSaved")}
        </Alert>
      )}

      {saveMut.isError && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {apiErrorMessage(saveMut.error)}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {t("settingsContact")}
          </Typography>
          <Stack spacing={2.5} direction={{ xs: "column", md: "row" }}>
            <TextField
              label={t("settingsContactPhone")}
              value={active.contactPhone}
              onChange={(e) => updateField("contactPhone", e.target.value)}
              fullWidth
              placeholder="+998 99 801 93 53"
            />
            <TextField
              label={t("settingsTelegramUsername")}
              value={active.telegramUsername}
              onChange={(e) => updateField("telegramUsername", e.target.value)}
              fullWidth
              placeholder="online_invitation_admin"
              helperText={t("settingsTelegramHint")}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {t("settingsLandingTexts")}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {t("settingsLandingTextsHint")}
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, value: Locale) => setTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
          >
            {LOCALES.map((locale) => (
              <Tab key={locale} value={locale} label={LOCALE_LABELS[locale]} />
            ))}
          </Tabs>

          <Stack spacing={2.5}>
            {(["hero", "seo", "order", "contact"] as const).map((section) => (
              <Box key={section}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {section === "hero"
                    ? t("settingsHeroSection")
                    : section === "seo"
                      ? t("settingsSeoSection")
                      : section === "order"
                        ? t("settingsOrderCta")
                        : t("settingsContactSection")}
                </Typography>
                <Stack spacing={2.5}>
                  {localeFields
                    .filter((field) => field.section === section)
                    .map((field) => (
                      <TextField
                        key={field.key}
                        label={field.label}
                        value={active.texts[tab][field.key]}
                        onChange={(e) =>
                          updateLocaleText(tab, field.key, e.target.value)
                        }
                        fullWidth
                        multiline={"multiline" in field && field.multiline}
                        minRows={"multiline" in field && field.multiline ? 2 : 1}
                      />
                    ))}
                </Stack>
                {section !== "contact" ? <Divider sx={{ mt: 2.5 }} /> : null}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<FloppyDiskIcon weight="bold" />}
          onClick={handleSave}
          disabled={saveMut.isPending}
        >
          {t("settingsSave")}
        </Button>
      </Box>
    </Stack>
  );
}
