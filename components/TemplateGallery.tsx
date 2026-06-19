"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import Link from "next/link";
import { TelegramLogoIcon } from "@phosphor-icons/react";
import { Box, Skeleton, Alert, Button } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { useTemplates } from "@/lib/queries/useTemplates";
import { getTelegramOrderUrl } from "@/config/telegram";
import type { Locale } from "@/config/locales";
import {
  formatPriceFrom,
  type CurrencyCode,
} from "@/lib/format-price";
import { TemplateCardPreview } from "@/components/landing/TemplateCardPreview";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function TemplateGallery({
  telegramUsername,
}: {
  telegramUsername?: string;
}) {
  const t = useTranslations("common");
  const tl = useTranslations("landing");
  const locale = useLocale() as Locale;
  const { data: templates, isPending, isError, refetch } = useTemplates();
  const [category, setCategory] = useState<string>("__all__");

  const categories = useMemo(() => {
    const set = new Set((templates ?? []).map((tpl) => tpl.category));
    return Array.from(set);
  }, [templates]);

  const filtered = useMemo(() => {
    if (!templates) return [];
    return category === "__all__"
      ? templates
      : templates.filter((tpl) => tpl.category === category);
  }, [templates, category]);

  if (isPending) {
    return (
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={520}
            sx={{ borderRadius: "1.25rem" }}
          />
        ))}
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        sx={{ borderRadius: 3 }}
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        }
      >
        {t("error")}
      </Alert>
    );
  }

  if (!templates.length) {
    return (
      <Alert severity="info" sx={{ borderRadius: 3 }}>
        {tl("noTemplates")}
      </Alert>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.55rem",
        }}
      >
        <button
          type="button"
          className={`landing-filter-chip${category === "__all__" ? " is-active" : ""}`}
          onClick={() => setCategory("__all__")}
        >
          {tl("allCategories")}
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`landing-filter-chip${category === c ? " is-active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {capitalize(c)}
          </button>
        ))}
      </div>

      <div className="catalogue-grid">
        {filtered.map((tpl) => {
          const previewHref = `/templates/${tpl.slug}/preview`;
          const currency = (tpl.currency ?? "UZS") as CurrencyCode;
          const priceLabel =
            tpl.priceAmount > 0
              ? formatPriceFrom(tpl.priceAmount, currency, tl("priceFrom"), locale)
              : tl("priceOnRequest");
          const orderHref = getTelegramOrderUrl(
            tpl.slug,
            tpl.name,
            locale,
            tpl.priceAmount,
            currency,
            telegramUsername,
          );
          const thumb =
            tpl.thumbnail ||
            (tpl.previewImages?.[0] as string | undefined) ||
            "";

          return (
            <article key={tpl.id} className="catalogue-card">
              <div className="catalogue-card-visual-wrap">
                <div className="catalogue-card-badges">
                  {tpl.badgeNew && (
                    <span className="catalogue-card-badge">{tl("badgeNew")}</span>
                  )}
                  {tpl.badgePopular && (
                    <span className="catalogue-card-badge catalogue-card-badge--popular">
                      {tl("badgePopular")}
                    </span>
                  )}
                </div>
                <TemplateCardPreview
                  thumbnail={thumb}
                  name={tpl.name}
                  previewHref={previewHref}
                  previewLabel={t("preview")}
                />
              </div>

              <div className="catalogue-card-body">
                <div className="catalogue-card-meta">
                  <span className="catalogue-card-category">
                    {capitalize(tpl.category)}
                  </span>
                  <span className="catalogue-card-price-tag">{priceLabel}</span>
                </div>
                <h3 className="catalogue-card-title">{tpl.name}</h3>
                <p className="catalogue-card-desc">
                  {tl("templateCardDesc", { category: capitalize(tpl.category) })}
                </p>

                <div className="catalogue-card-footer">
                  <Link href={previewHref} className="catalogue-card-link">
                    {tl("viewTheme")} →
                  </Link>
                  <a
                    href={orderHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="catalogue-card-order-btn"
                  >
                    <TelegramLogoIcon weight="fill" size={15} />
                    {tl("navOrder")}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
