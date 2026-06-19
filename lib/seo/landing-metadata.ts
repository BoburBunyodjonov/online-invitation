import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSiteSettings, getLocaleLandingTexts } from "@/lib/server/site-settings";
import { getSiteUrl } from "@/lib/seo/site-url";
import { getLocalizedUrl, localizedAlternateLanguages, localePathSegment } from "@/lib/seo/locale-url";
import type { Locale } from "@/config/locales";

const OG_LOCALE: Record<Locale, string> = {
  uz: "uz_UZ",
  "uz-Cyrl": "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
};

export async function buildLandingMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations("seo");
  const settings = await getSiteSettings();
  const copy = getLocaleLandingTexts(settings, locale);
  const siteUrl = getSiteUrl();
  const pageUrl = getLocalizedUrl(locale);

  const title = copy.seoTitle || t("title");
  const description = copy.seoDescription || t("description");
  const ogTitle = copy.seoOgTitle || t("ogTitle");
  const ogDescription = copy.seoOgDescription || t("ogDescription");
  const keywords = (copy.seoKeywords || t("keywords"))
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const ogImagePath = `/${localePathSegment(locale)}/opengraph-image`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: t("siteName"), url: siteUrl }],
    creator: t("siteName"),
    publisher: t("siteName"),
    category: "wedding",
    alternates: {
      canonical: pageUrl,
      languages: localizedAlternateLanguages(),
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: pageUrl,
      siteName: t("siteName"),
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImagePath],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
    ...(process.env.YANDEX_SITE_VERIFICATION
      ? { verification: { yandex: process.env.YANDEX_SITE_VERIFICATION } }
      : {}),
  };
}
