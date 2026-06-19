import {
  SparkleIcon,
  TelegramLogoIcon,
  LinkSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { TemplateGallery } from "@/components/TemplateGallery";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingOrderCta } from "@/components/landing/LandingOrderCta";
import { LandingJsonLd } from "@/components/landing/LandingJsonLd";
import { getSiteSettings } from "@/lib/server/site-settings";
import { buildLandingMetadata } from "@/lib/seo/landing-metadata";
import type { Locale } from "@/config/locales";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildLandingMetadata(locale);
}

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const tc = await getTranslations("common");
  const siteSettings = await getSiteSettings();

  const steps = [
    { icon: SparkleIcon, title: t("step1Title"), text: t("step1Text") },
    { icon: TelegramLogoIcon, title: t("step2Title"), text: t("step2Text") },
    { icon: LinkSimpleIcon, title: t("step3Title"), text: t("step3Text") },
  ];

  return (
    <div className="landing-shell">
      <LandingJsonLd />
      <LandingHeader />

      <LandingHero />

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        style={{
          paddingBlock: "clamp(4rem, 10vw, 6rem)",
          paddingInline: "clamp(1rem, 4vw, 2rem)",
          background: "var(--color-bg)",
        }}
      >
        <div style={{ maxWidth: "72rem", marginInline: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 5vw, 3.5rem)" }}>
            <p className="landing-section-label" style={{ justifyContent: "center" }}>
              <SparkleIcon weight="fill" size={12} />
              {t("howLabel")}
            </p>
            <h2 className="landing-section-title" style={{ marginTop: "1rem" }}>
              {t("howTitle")}
            </h2>
            <p className="landing-section-subtitle">{t("howSubtitle")}</p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            {steps.map((step, i) => (
              <article key={i} className="how-step-card">
                <div className="how-step-icon">
                  <step.icon weight="duotone" size={28} />
                </div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-text">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LandingFeatures />

      {/* CATALOGUE */}
      <section
        id="templates"
        style={{
          paddingBlock: "clamp(4rem, 10vw, 6rem)",
          paddingInline: "clamp(1rem, 4vw, 2rem)",
          background: "var(--color-bg-catalogue)",
        }}
      >
        <div style={{ maxWidth: "72rem", marginInline: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 6vw, 3.5rem)" }}>
            <p className="landing-section-label" style={{ justifyContent: "center" }}>
              <SparkleIcon weight="fill" size={12} />
              {t("catalogueLabel")}
            </p>
            <h2 className="landing-section-title" style={{ marginTop: "1rem" }}>
              {t("catalogueTitle")}
            </h2>
            <p className="landing-section-subtitle">{t("catalogueSubtitle")}</p>
          </div>

          <TemplateGallery telegramUsername={siteSettings.telegramUsername} />
        </div>
      </section>

      <LandingOrderCta />

      <footer className="landing-footer">
        © {new Date().getFullYear()} {tc("brand")}
      </footer>
    </div>
  );
}
