import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "@/config/locales";
import { LOCALE_COOKIE } from "./constants";

/** URL path segment per locale (`uz-Cyrl` → `uz-cyrl`). */
export const LOCALE_PATH_SEGMENT = {
  ru: "ru",
  en: "en",
  uz: "uz",
  "uz-Cyrl": "uz-cyrl",
} as const;

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: {
    mode: "always",
    prefixes: {
      "uz-Cyrl": "/uz-cyrl",
    },
  },
  localeCookie: {
    name: LOCALE_COOKIE,
  },
  localeDetection: false,
});
