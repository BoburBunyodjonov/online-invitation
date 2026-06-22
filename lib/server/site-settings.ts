import { LOCALES } from "@/config/locales";
import type { Locale } from "@/config/locales";
import { prisma } from "@/lib/server/db";
import {
  DEFAULT_LANDING_TEXTS,
  DEFAULT_SITE_SETTINGS,
} from "@/lib/site-settings/defaults";
import type {
  LocaleLandingTexts,
  SiteSettingsDTO,
  SiteSettingsTexts,
} from "@/lib/site-settings/types";
import type { SiteSettingsInput } from "@/lib/validation/site-settings";

function mergeTexts(
  stored: Partial<SiteSettingsTexts> | null | undefined,
): SiteSettingsTexts {
  const result = { ...DEFAULT_LANDING_TEXTS };
  if (!stored) return result;

  for (const locale of LOCALES) {
    const patch = stored[locale];
    if (patch) {
      result[locale] = { ...result[locale], ...patch };
    }
  }
  return result;
}

export async function getSiteSettings(): Promise<SiteSettingsDTO> {
  if (!prisma.siteSettings) {
    return DEFAULT_SITE_SETTINGS;
  }

  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  if (!row) {
    return DEFAULT_SITE_SETTINGS;
  }

  return {
    contactPhone: row.contactPhone || DEFAULT_SITE_SETTINGS.contactPhone,
    telegramUsername:
      row.telegramUsername.replace(/^@/, "") ||
      DEFAULT_SITE_SETTINGS.telegramUsername,
    texts: mergeTexts(row.texts as Partial<SiteSettingsTexts>),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function getLocaleLandingTexts(
  settings: SiteSettingsDTO,
  locale: Locale,
): LocaleLandingTexts {
  return settings.texts[locale] ?? settings.texts.uz;
}

export async function updateSiteSettings(
  input: SiteSettingsInput,
): Promise<SiteSettingsDTO> {
  if (!prisma.siteSettings) {
    throw new Error(
      "Database schema mismatch. Run `npm run db:migrate` and restart the dev server.",
    );
  }

  const row = await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      contactPhone: input.contactPhone,
      telegramUsername: input.telegramUsername,
      texts: input.texts as object,
    },
    update: {
      contactPhone: input.contactPhone,
      telegramUsername: input.telegramUsername,
      texts: input.texts as object,
    },
  });

  return {
    contactPhone: row.contactPhone,
    telegramUsername: row.telegramUsername.replace(/^@/, ""),
    texts: mergeTexts(row.texts as Partial<SiteSettingsTexts>),
    updatedAt: row.updatedAt.toISOString(),
  };
}
