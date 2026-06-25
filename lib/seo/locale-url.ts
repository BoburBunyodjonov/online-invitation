import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/config/locales";
import { LOCALE_PATH_SEGMENT } from "@/i18n/routing";
import { getSiteUrl } from "./site-url";

export function localePathSegment(locale: Locale): string {
  return LOCALE_PATH_SEGMENT[locale];
}

export function getLocalizedPath(locale: Locale, path = ""): string {
  const base = `/${localePathSegment(locale)}`;
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getLocalizedUrl(locale: Locale, path = ""): string {
  return `${getSiteUrl()}${getLocalizedPath(locale, path)}`;
}

/** Map `[locale]` param (code or URL segment) to a platform locale. */
export function parseLocaleParam(param: string): Locale | null {
  if (isLocale(param)) return param;

  const normalized = param.toLowerCase();
  for (const locale of LOCALES) {
    if (localePathSegment(locale).toLowerCase() === normalized) return locale;
  }
  return null;
}

export function localizedAlternateLanguages(): Record<string, string> {
  const entries = LOCALES.map((locale) => [
    locale === "uz-Cyrl" ? "uz-Cyrl" : locale,
    getLocalizedUrl(locale),
  ]);
  return Object.fromEntries([
    ...entries,
    ["x-default", getLocalizedUrl(DEFAULT_LOCALE)],
  ]);
}
