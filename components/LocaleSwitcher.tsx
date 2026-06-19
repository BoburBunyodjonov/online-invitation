"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { GlobeIcon } from "@phosphor-icons/react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/config/locales";
import { setLocale } from "@/app/actions/locale";
import { getPathname } from "@/i18n/navigation";
import { parseLocaleParam } from "@/lib/seo/locale-url";
import { LOCALE_COOKIE } from "@/i18n/constants";
import { useRouter } from "next/navigation";

function useActiveLocale(variant: "default" | "landing"): Locale {
  const contextLocale = useLocale() as Locale;
  const params = useParams();

  if (variant === "landing" && typeof params.locale === "string") {
    return parseLocaleParam(params.locale) ?? contextLocale;
  }

  return contextLocale;
}

export function LocaleSwitcher({
  variant = "default",
}: {
  variant?: "default" | "landing";
}) {
  const current = useActiveLocale(variant);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const choose = (l: Locale) => {
    setAnchor(null);
    startTransition(() => {
      if (variant === "landing") {
        document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
        router.replace(getPathname({ href: "/", locale: l }));
      } else {
        setLocale(l);
      }
    });
  };

  if (variant === "landing") {
    return (
      <>
        <button
          type="button"
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-label={LOCALE_LABELS[current]}
          title={LOCALE_LABELS[current]}
          style={{
            width: "2rem",
            height: "2rem",
            display: "grid",
            placeItems: "center",
            borderRadius: "999px",
            border: "1px solid color-mix(in srgb, var(--color-brand) 18%, transparent)",
            background: "rgba(255,255,255,0.85)",
            color: "var(--color-brand)",
            cursor: "pointer",
          }}
        >
          <GlobeIcon weight="duotone" size={18} />
        </button>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          {LOCALES.map((l) => (
            <MenuItem key={l} selected={l === current} onClick={() => choose(l)}>
              {LOCALE_LABELS[l]}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => setAnchor(e.currentTarget)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.35rem 0.75rem",
          borderRadius: "999px",
          color: "var(--color-ink-soft)",
          fontSize: "0.85rem",
          fontWeight: 600,
        }}
      >
        <GlobeIcon weight="duotone" size={18} />
        {LOCALE_LABELS[current]}
      </button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {LOCALES.map((l) => (
          <MenuItem key={l} selected={l === current} onClick={() => choose(l)}>
            {LOCALE_LABELS[l]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
