import type { Locale } from "@/config/locales";

export type LocaleLandingTexts = {
  orderCtaTitle: string;
  orderCtaSubtitle: string;
  orderCtaTelegram: string;
  contactTitle: string;
  contactSubtitle: string;
  heroBadge: string;
  heroHeadline: string;
  heroHeadlineAccent: string;
  heroDescription: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoOgTitle: string;
  seoOgDescription: string;
};

export type SiteSettingsTexts = Record<Locale, LocaleLandingTexts>;

export type SiteSettingsDTO = {
  contactPhone: string;
  telegramUsername: string;
  texts: SiteSettingsTexts;
  updatedAt?: string;
};
