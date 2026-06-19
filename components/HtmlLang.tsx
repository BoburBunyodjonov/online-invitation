"use client";

import { useEffect } from "react";
import type { Locale } from "@/config/locales";

/** Keep <html lang> in sync with the active [locale] segment. */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
