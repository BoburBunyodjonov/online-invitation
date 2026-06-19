import type { Locale } from "@/config/locales";
import uz from "@/messages/uz.json";
import ru from "@/messages/ru.json";
import en from "@/messages/en.json";
import uzCyrl from "@/messages/uz-Cyrl.json";
import type { LocaleLandingTexts, SiteSettingsTexts } from "./types";

const MESSAGE_BY_LOCALE = {
  uz: uz,
  ru: ru,
  en: en,
  "uz-Cyrl": uzCyrl,
} as const;

function textsFromMessages(locale: Locale): LocaleLandingTexts {
  const landing = MESSAGE_BY_LOCALE[locale].landing;
  const seo = MESSAGE_BY_LOCALE[locale].seo;

  return {
    orderCtaTitle: landing.orderCtaTitle,
    orderCtaSubtitle: landing.orderCtaSubtitle,
    orderCtaTelegram: landing.orderCtaTelegram,
    contactTitle: landing.contactTitle,
    contactSubtitle: landing.contactSubtitle,
    heroBadge: landing.heroBadge,
    heroHeadline: landing.heroHeadline,
    heroHeadlineAccent: landing.heroHeadlineAccent,
    heroDescription: landing.heroDescription,
    heroCtaPrimary: landing.heroCtaPrimary,
    heroCtaSecondary: landing.heroCtaSecondary,
    seoTitle: seo.title,
    seoDescription: seo.description,
    seoKeywords: seo.keywords,
    seoOgTitle: seo.ogTitle,
    seoOgDescription: seo.ogDescription,
  };
}

export const DEFAULT_LANDING_TEXTS: SiteSettingsTexts = {
  uz: textsFromMessages("uz"),
  ru: textsFromMessages("ru"),
  en: textsFromMessages("en"),
  "uz-Cyrl": textsFromMessages("uz-Cyrl"),
};

export const DEFAULT_SITE_SETTINGS: import("./types").SiteSettingsDTO = {
  contactPhone:
    process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+998 99 801 93 53",
  telegramUsername:
    process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_USERNAME?.replace(/^@/, "") ??
    "online_invitation_admin",
  texts: DEFAULT_LANDING_TEXTS,
};
