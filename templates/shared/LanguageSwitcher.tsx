"use client";

import { LOCALE_SHORT } from "@/config/locales";
import { useTemplate } from "./TemplateContext";

export function LanguageSwitcher({ accent }: { accent: string }) {
  const { data, locale, setLocale } = useTemplate();

  return (
    <div className="glass-pill flex items-center gap-1 px-1.5 py-1">
      {data.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className="btn-invite-ghost px-2.5 py-1 text-xs"
            style={{
              backgroundColor: active ? accent : "transparent",
              color: active ? "#fff" : "rgba(255,255,255,0.88)",
              boxShadow: active ? "0 4px 14px rgba(0,0,0,0.18)" : "none",
            }}
            aria-pressed={active}
          >
            {LOCALE_SHORT[l]}
          </button>
        );
      })}
    </div>
  );
}
