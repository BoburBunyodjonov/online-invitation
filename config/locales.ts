/**
 * Locales supported across the platform UI (next-intl) AND inside invitation
 * content (each invitation stores localized values keyed by these codes).
 */
export const LOCALES = ["ru", "en", "uz", "uz-Cyrl"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  uz: "O‘zbekcha",
  "uz-Cyrl": "Ўзбекча",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  uz: "UZ",
  "uz-Cyrl": "ЎЗ",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
