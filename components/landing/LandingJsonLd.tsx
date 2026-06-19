import { getLocale, getTranslations } from "next-intl/server";
import { getSiteSettings, getLocaleLandingTexts } from "@/lib/server/site-settings";
import { getSiteUrl } from "@/lib/seo/site-url";
import { getLocalizedUrl } from "@/lib/seo/locale-url";
import { getTelegramContactUrl } from "@/config/telegram";
import type { Locale } from "@/config/locales";

export async function LandingJsonLd() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("seo");
  const settings = await getSiteSettings();
  const copy = getLocaleLandingTexts(settings, locale);
  const siteUrl = getSiteUrl();
  const pageUrl = getLocalizedUrl(locale);
  const description = copy.seoDescription || t("description");
  const telegramUrl = getTelegramContactUrl(locale, settings.telegramUsername);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: t("siteName"),
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    description,
    telephone: settings.contactPhone,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.contactPhone,
      contactType: "customer service",
      availableLanguage: ["Uzbek", "Russian", "English"],
      url: telegramUrl,
    },
    sameAs: [`https://t.me/${settings.telegramUsername.replace(/^@/, "")}`],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: t("siteName"),
    url: siteUrl,
    description,
    inLanguage: ["uz", "ru", "en"],
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#service`,
    name: t("serviceName"),
    description: t("serviceDescription"),
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: {
      "@type": "Country",
      name: "Uzbekistan",
    },
    serviceType: "Online wedding invitation design",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/#templates`,
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { q: "faq1Q", a: "faq1A" },
      { q: "faq2Q", a: "faq2A" },
      { q: "faq3Q", a: "faq3A" },
    ].map(({ q, a }) => ({
      "@type": "Question",
      name: t(q as "faq1Q"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(a as "faq1A"),
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("siteName"),
        item: siteUrl,
      },
    ],
  };

  const graphs = [organization, website, service, faq, breadcrumb];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graphs,
        }),
      }}
    />
  );
}
