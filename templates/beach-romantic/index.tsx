"use client";

/* eslint-disable @next/next/no-img-element */
import { HeartIcon, CaretDoubleDownIcon } from "@phosphor-icons/react";
import type { InvitationData } from "@/lib/validation/invitation-data";
import type { ThemeDefaults } from "@/lib/validation/template";
import { TemplateProvider, useTemplate } from "../shared/TemplateContext";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { MusicToggle } from "../shared/MusicToggle";
import { CountdownTimer } from "../shared/CountdownTimer";
import { WeddingCalendar } from "../shared/WeddingCalendar";
import { ScheduleList } from "../shared/ScheduleList";
import { VenueMap } from "../shared/VenueMap";
import { PhotoGallery } from "../shared/PhotoGallery";
import { UnlockGate } from "../shared/UnlockGate";
import { TEMPLATE_STRINGS } from "../shared/template-strings";
import { resolveFontPair } from "../shared/font-pairs";

export interface TemplateProps {
  data: InvitationData;
  theme: ThemeDefaults;
}

function Section({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section className={`px-6 py-16 sm:py-20 ${className}`} style={style}>
      {children}
    </section>
  );
}

function BeachRomanticInner() {
  const { data, theme, locale, t } = useTemplate();
  const accent = theme.accentColor;
  const strings = TEMPLATE_STRINGS[locale];
  const fonts = resolveFontPair(theme.fontPair);

  const weddingDate = new Date(`${data.weddingDate}T${data.startTime || "00:00"}`);
  const dateLabel = weddingDate.toLocaleDateString(
    locale === "uz-Cyrl" ? "uz" : locale,
    { day: "numeric", month: "long", year: "numeric" },
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.mode === "dark" ? "#f5efe9" : "var(--color-ink)",
        fontFamily: fonts.body,
      }}
    >
      {/* HERO */}
      <header className="relative flex h-screen min-h-[600px] w-full items-center justify-center overflow-hidden">
        {data.heroPhoto ? (
          <img
            src={data.heroPhoto}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, ${accent}, ${theme.backgroundColor})`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

        <div className="absolute left-4 top-4 z-10">
          <LanguageSwitcher accent={accent} />
        </div>
        <div className="absolute right-4 top-4 z-10">
          <MusicToggle src={data.backgroundMusic} accent={accent} />
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/80">
            {strings.invite}
          </p>
          <h1
            className="text-5xl leading-tight sm:text-6xl"
            style={{ fontFamily: fonts.script }}
          >
            {t(data.groomName)}
            <span className="mx-3 inline-block align-middle">
              <HeartIcon weight="fill" size={32} color={accent} />
            </span>
            {t(data.brideName)}
          </h1>
          <p className="mt-4 text-lg tracking-wide text-white/90">{dateLabel}</p>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-white/80">
          <span className="mb-1 text-[10px] uppercase tracking-widest">
            {strings.scrollDown}
          </span>
          <CaretDoubleDownIcon weight="bold" size={22} className="animate-bounce" />
        </div>
      </header>

      {/* INTRO */}
      {t(data.intro) && (
        <Section className="text-center">
          <HeartIcon
            weight="duotone"
            size={40}
            color={accent}
            className="mx-auto mb-6"
          />
          <p className="mx-auto max-w-md text-lg leading-relaxed text-ink-soft">
            {t(data.intro)}
          </p>
        </Section>
      )}

      {/* VERSE (optional, e.g. islamic-style) */}
      {data.verse && (data.verse.arabic || t(data.verse.translation)) && (
        <Section
          className="text-center"
          style={{ backgroundColor: `${accent}10` } as React.CSSProperties}
        >
          {data.verse.arabic && (
            <p className="mb-4 text-2xl leading-loose" dir="rtl">
              {data.verse.arabic}
            </p>
          )}
          {t(data.verse.translation) && (
            <p className="mx-auto max-w-md italic text-ink-soft">
              “{t(data.verse.translation)}”
            </p>
          )}
          {t(data.verse.source) && (
            <p className="mt-2 text-sm" style={{ color: accent }}>
              {t(data.verse.source)}
            </p>
          )}
        </Section>
      )}

      {/* COUNTDOWN + CALENDAR */}
      <Section className="flex flex-col items-center gap-10">
        <h2
          className="text-3xl"
          style={{ fontFamily: fonts.heading, color: accent }}
        >
          {dateLabel}
        </h2>
        <CountdownTimer
          target={weddingDate}
          accent={accent}
          labels={strings.countdown}
        />
        <WeddingCalendar
          date={weddingDate}
          accent={accent}
          weekdayLabels={strings.weekdays}
        />
        <p className="text-ink-soft">
          {strings.startAt}{" "}
          <span className="font-semibold" style={{ color: accent }}>
            {data.startTime}
          </span>
        </p>
      </Section>

      {/* SCHEDULE */}
      {data.schedule?.length > 0 && (
        <Section style={{ backgroundColor: `${accent}10` } as React.CSSProperties}>
          <ScheduleList accent={accent} />
        </Section>
      )}

      {/* VENUE */}
      <Section className="flex flex-col items-center gap-6">
        <VenueMap accent={accent} labels={strings.route} />
      </Section>

      {/* GALLERY */}
      {data.gallery?.length > 0 && (
        <Section style={{ backgroundColor: `${accent}10` } as React.CSSProperties}>
          <PhotoGallery />
        </Section>
      )}

      {/* FOOTER */}
      <footer className="px-6 py-12 text-center">
        <HeartIcon
          weight="fill"
          size={28}
          color={accent}
          className="mx-auto mb-3"
        />
        <p style={{ fontFamily: fonts.script }} className="text-2xl">
          {t(data.groomName)} & {t(data.brideName)}
        </p>
      </footer>
    </div>
  );
}

export default function BeachRomanticTemplate({ data, theme }: TemplateProps) {
  const strings = TEMPLATE_STRINGS[data.defaultLocale];
  return (
    <TemplateProvider data={data} theme={theme}>
      <UnlockGate
        enabled={data.unlockGate}
        accent={theme.accentColor}
        backgroundImage={data.heroPhoto}
        title={data.greeting?.[data.defaultLocale] ?? strings.gate.title}
        subtitle={strings.gate.subtitle}
        buttonLabel={strings.gate.button}
      >
        <BeachRomanticInner />
      </UnlockGate>
    </TemplateProvider>
  );
}
