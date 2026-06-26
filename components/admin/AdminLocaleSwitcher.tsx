"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Menu, MenuItem } from "@mui/material";
import { GlobeIcon } from "@phosphor-icons/react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/config/locales";
import { setLocale } from "@/app/actions/locale";

export function AdminLocaleSwitcher() {
  const current = useLocale() as Locale;
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const choose = (locale: Locale) => {
    setAnchor(null);
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-label={LOCALE_LABELS[current]}
        title={LOCALE_LABELS[current]}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.35rem 0.75rem",
          borderRadius: "999px",
          color: "var(--mui-palette-text-secondary)",
          fontSize: "0.85rem",
          fontWeight: 600,
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <GlobeIcon weight="duotone" size={18} />
        {LOCALE_LABELS[current]}
      </button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {LOCALES.map((locale) => (
          <MenuItem
            key={locale}
            selected={locale === current}
            onClick={() => choose(locale)}
          >
            {LOCALE_LABELS[locale]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
