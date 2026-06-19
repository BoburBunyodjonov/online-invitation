"use client";

import { StarAndCrescentIcon, CaretDoubleDownIcon } from "@phosphor-icons/react";
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

function IslamicElegantInner() {
  const { data, theme, locale, t } = useTemplate();
  const accent = theme.accentColor;
  const strings = TEMPLATE_STRINGS[locale];
  const fonts = resolveFontPair(theme.fontPair);
  const dark = theme.mode === "dark";

  const weddingDate = new Date(`${data.weddingDate}T${data.startTime || "00:00"}`);
  const dateLabel = weddingDate.toLocaleDateString(
    locale === "uz-Cyrl" ? "uz" : locale,
    { day: "numeric", month: "long", year: "numeric" },
  );

  const border = `1px solid ${accent}55`;

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: theme.backgroundColor,
        color: dark ? "#f3ece1" : "var(--color-ink)",
        fontFamily: fonts.body,
      }}
    >
      {/* HERO — ornamental framed, not full-bleed photo */}
      <header className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <div className="absolute left-4 top-4 z-10">
          <LanguageSwitcher accent={accent} />
        </div>
        <div className="absolute right-4 top-4 z-10">
          <MusicToggle src={data.backgroundMusic} accent={accent} />
        </div>

        <div
          className="flex w-full max-w-md flex-col items-center rounded-3xl px-8 py-14"
          style={{ border }}
        >
          <StarAndCrescentIcon weight="duotone" size={48} color={accent} />
          <p className="mt-6 text-xs uppercase tracking-[0.3em] opacity-70">
            {strings.invite}
          </p>
          {data.verse?.arabic && (
            <p className="mt-6 text-2xl leading-loose" dir="rtl">
              {data.verse.arabic}
            </p>
          )}
          <h1
            className="mt-6 text-4xl sm:text-5xl"
            style={{ fontFamily: fonts.script, color: accent }}
          >
            {t(data.groomName)} & {t(data.brideName)}
          </h1>
          <p className="mt-4 tracking-wide opacity-80">{dateLabel}</p>
        </div>

        <CaretDoubleDownIcon
          weight="bold"
          size={22}
          color={accent}
          className="mt-10 animate-bounce"
        />
      </header>

      {data.verse && t(data.verse.translation) && (
        <section className="px-6 py-16 text-center">
          <p className="mx-auto max-w-md italic opacity-80">
            “{t(data.verse.translation)}”
          </p>
          {t(data.verse.source) && (
            <p className="mt-2 text-sm" style={{ color: accent }}>
              {t(data.verse.source)}
            </p>
          )}
        </section>
      )}

      <section className="flex flex-col items-center gap-10 px-6 py-16">
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
        <p className="opacity-80">
          {strings.startAt}{" "}
          <span className="font-semibold" style={{ color: accent }}>
            {data.startTime}
          </span>
        </p>
      </section>

      {data.schedule?.length > 0 && (
        <section className="px-6 py-16">
          <ScheduleList accent={accent} />
        </section>
      )}

      <section className="flex flex-col items-center px-6 py-16">
        <VenueMap accent={accent} labels={strings.route} />
      </section>

      {data.gallery?.length > 0 && (
        <section className="px-6 py-16">
          <PhotoGallery />
        </section>
      )}

      <footer className="px-6 py-12 text-center">
        <StarAndCrescentIcon
          weight="duotone"
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

export default function IslamicElegantTemplate({ data, theme }: TemplateProps) {
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
        <IslamicElegantInner />
      </UnlockGate>
    </TemplateProvider>
  );
}
