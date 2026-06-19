import Link from "next/link";
import {
  SparkleIcon,
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  CalendarPlusIcon,
  MusicNotesIcon,
  ImagesIcon,
} from "@phosphor-icons/react/dist/ssr";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/server/db";
import type { Locale } from "@/config/locales";
import { getSiteSettings, getLocaleLandingTexts } from "@/lib/server/site-settings";
import { SAMPLE_DATA } from "@/templates/sample-data";
import { HeroPreviewCountdown } from "./HeroPreviewCountdown";

const HERO_PREVIEW_IMAGE = SAMPLE_DATA.heroPhoto;
const HERO_CARD_ISLAMIC =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85";
const HERO_CARD_CLASSIC = "/templates/blue-envelope/assets/blue%20ornament%20.png";

function formatPreviewDate(locale: Locale) {
  const date = new Date(`${SAMPLE_DATA.weddingDate}T12:00:00`);
  return new Intl.DateTimeFormat(locale === "uz-Cyrl" ? "uz-UZ" : locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function previewCoupleNames(locale: Locale) {
  const groom = SAMPLE_DATA.groomName[locale] ?? SAMPLE_DATA.groomName.uz;
  const bride = SAMPLE_DATA.brideName[locale] ?? SAMPLE_DATA.brideName.uz;
  return `${bride} & ${groom}`;
}

export async function LandingHero() {
  const t = await getTranslations("landing");
  const locale = (await getLocale()) as Locale;
  const settings = await getSiteSettings();
  const copy = getLocaleLandingTexts(settings, locale);

  const templateCount = await prisma.template.count({
    where: { isPublished: true },
  });
  const statTemplates = templateCount > 0 ? String(templateCount) : "3";

  const orbitFeatures = [
    { icon: ClockIcon, text: t("heroFloatCountdown") },
    { icon: MapPinIcon, text: t("heroFloatMap") },
    { icon: CalendarPlusIcon, text: t("heroFloatCalendar") },
    { icon: MusicNotesIcon, text: t("feature4Title") },
    { icon: ImagesIcon, text: t("feature2Title") },
  ];

  const stats = [
    { value: statTemplates, label: t("heroStat1Label") },
    { value: t("heroStat2Value"), label: t("heroStat2Label") },
    { value: t("heroStat3Value"), label: t("heroStat3Label") },
  ];

  const marqueeItems = [
    t("heroFloatCountdown"),
    t("heroFloatMap"),
    t("heroFloatCalendar"),
    t("feature2Title"),
    t("feature4Title"),
    t("feature6Title"),
  ];

  return (
    <section className="landing-hero">
      <div className="landing-hero-watermark" aria-hidden>
        {t("heroWatermark")}
      </div>
      <div className="landing-hero-grain" aria-hidden />
      <div className="landing-hero-arc landing-hero-arc--one" aria-hidden />
      <div className="landing-hero-arc landing-hero-arc--two" aria-hidden />

      <div className="landing-hero-frame landing-hero-frame--tl" aria-hidden />
      <div className="landing-hero-frame landing-hero-frame--br" aria-hidden />

      <div className="landing-hero-inner">
        <div className="landing-hero-copy">
          <div className="landing-hero-ribbon">
            <SparkleIcon weight="fill" size={11} />
            <span>{copy.heroBadge || t("heroBadge")}</span>
          </div>

          <h1 className="landing-hero-title">
            <span className="landing-hero-headline">
              {copy.heroHeadline || t("heroHeadline")}
            </span>
            <span className="landing-hero-accent">
              {copy.heroHeadlineAccent || t("heroHeadlineAccent")}
            </span>
          </h1>

          <p className="landing-hero-desc">
            {copy.heroDescription || t("heroDescription")}
          </p>

          <div className="landing-hero-actions">
            <Link href="#templates" className="landing-hero-btn landing-hero-btn--primary">
              <span className="landing-hero-btn-shine" aria-hidden />
              {copy.heroCtaPrimary || t("heroCtaPrimary")}
              <ArrowRightIcon weight="bold" size={16} />
            </Link>
            <Link href="#how-it-works" className="landing-hero-btn landing-hero-btn--ghost">
              {copy.heroCtaSecondary || t("heroCtaSecondary")}
            </Link>
          </div>

          <ul className="landing-hero-chips">
            {orbitFeatures.slice(0, 3).map((item, i) => (
              <li key={i}>
                <item.icon weight="duotone" size={15} />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="landing-hero-stage" aria-hidden>
          <div className="landing-hero-orbit-ring" />

          {orbitFeatures.map((item, i) => (
            <div
              key={i}
              className="landing-hero-orbit-pill"
              style={{ ["--orbit-i" as string]: i }}
            >
              <item.icon weight="duotone" size={14} />
              <span>{item.text}</span>
            </div>
          ))}

          <div className="landing-hero-card-fan">
            <article className="landing-hero-sheet landing-hero-sheet--left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_CARD_ISLAMIC} alt="" />
              <span className="landing-hero-sheet-tag">Islamic</span>
            </article>

            <article className="landing-hero-sheet landing-hero-sheet--right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_CARD_CLASSIC} alt="" />
              <span className="landing-hero-sheet-tag">Classic</span>
            </article>

            <div className="landing-hero-phone-wrap">
              <div className="landing-hero-phone">
                <div className="landing-hero-phone-island" />
                <div className="landing-hero-phone-screen">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={HERO_PREVIEW_IMAGE} alt="" className="landing-hero-phone-bg" />
                  <div className="landing-hero-phone-overlay">
                    <p className="landing-hero-phone-greeting">{t("heroPhoneGreeting")}</p>
                    <p className="landing-hero-phone-names">{previewCoupleNames(locale)}</p>
                    <p className="landing-hero-phone-date">{formatPreviewDate(locale)}</p>
                    <HeroPreviewCountdown
                      targetDate={SAMPLE_DATA.weddingDate}
                      labels={{
                        days: t("heroCountdownDays"),
                        hours: t("heroCountdownHours"),
                        minutes: t("heroCountdownMinutes"),
                        seconds: t("heroCountdownSeconds"),
                      }}
                    />
                  </div>
                </div>
              </div>
              <span className="landing-hero-live-badge">
                <span className="landing-hero-live-dot" />
                {t("heroLivePreview")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-hero-glass-bar">
        {stats.map((stat, i) => (
          <div key={i} className="landing-hero-glass-stat">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="landing-hero-marquee" aria-hidden>
        <div className="landing-hero-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="landing-hero-marquee-item">
              <SparkleIcon weight="fill" size={10} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
