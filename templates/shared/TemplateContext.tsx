"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Locale } from "@/config/locales";
import type {
  InvitationData,
  LocalizedString,
} from "@/lib/validation/invitation-data";
import type { ThemeDefaults } from "@/lib/validation/template";

interface TemplateContextValue {
  data: InvitationData;
  theme: ThemeDefaults;
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Resolve a localized string for the current display locale (with fallback). */
  t: (value?: LocalizedString) => string;
}

const TemplateContext = createContext<TemplateContextValue | null>(null);

export function TemplateProvider({
  data,
  theme,
  children,
}: {
  data: InvitationData;
  theme: ThemeDefaults;
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(data.defaultLocale);

  const value = useMemo<TemplateContextValue>(() => {
    const t = (val?: LocalizedString) => {
      if (!val) return "";
      return val[locale] ?? val[data.defaultLocale] ?? Object.values(val)[0] ?? "";
    };
    return { data, theme, locale, setLocale, t };
  }, [data, theme, locale]);

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const ctx = useContext(TemplateContext);
  if (!ctx) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return ctx;
}
