"use client";

/* eslint-disable @next/next/no-img-element */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { InvitationData } from "@/lib/validation/invitation-data";
import type { ThemeDefaults } from "@/lib/validation/template";
import { buildCalendarGrid } from "../blue-envelope/calendar";
import {
  DARK_BLUE_UI,
  formatCalendarMonth,
  formatDotDate,
  formatEventDate,
  formatShortDate,
  toDarkBlueLang,
  type DarkBlueLang,
} from "./locales";
import { TemplateCredit } from "../shared/TemplateCredit";
import "./styles.css";

const ASSETS = "/templates/dark-blue-invitation/assets";
const DEFAULT_MUSIC = `${ASSETS}/music.mp3`;
const MUSIC_VOLUME = 0.18;
const LANGUAGE_STORAGE_KEY = "darkBlueInvitationLanguage";

const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
const ONE_HOUR_MS = ONE_MINUTE_MS * 60;
const ONE_DAY_MS = ONE_HOUR_MS * 24;

const PALETTE_SWATCHES = [
  {
    image: `${ASSETS}/fabric-cream-D2RXeaOQ.jpg`,
    labelKey: "paletteCream",
    hex: "#F2E2C2",
  },
  {
    image: `${ASSETS}/fabric-blue-BIVvkzCo.jpg`,
    labelKey: "palettePowder",
    hex: "#BFD8E8",
  },
  {
    image: `${ASSETS}/fabric-navy-Dr3kDD5b.jpg`,
    labelKey: "paletteIndigo",
    hex: "#1E3A6E",
  },
] as const;

export interface TemplateProps {
  data: InvitationData;
  theme: ThemeDefaults;
}

function pickLocalized(
  field: Partial<Record<string, string>> | undefined,
  lang: DarkBlueLang,
  fallback = "",
) {
  if (!field) return fallback;
  return (
    field[lang] ??
    field.ru ??
    field["uz-Cyrl"] ??
    field.uz ??
    Object.values(field)[0] ??
    fallback
  );
}

function splitScheduleLabel(label: string): { title: string; desc: string } {
  const [title, desc] = label.split(" — ");
  return { title: title.trim(), desc: desc?.trim() ?? "" };
}

function getInitialLang(data: InvitationData): DarkBlueLang {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "ru" || saved === "uz") return saved;
    } catch {
      // Ignore storage access issues.
    }
  }
  return toDarkBlueLang(data.defaultLocale);
}

function getWeddingTimestamp(data: InvitationData) {
  return new Date(
    `${data.weddingDate}T${data.startTime || "18:00"}:00+05:00`,
  ).getTime();
}

function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`dbi-divider ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 14 14" fill="none">
        <path
          d="M7 1c1 2 2.5 3.5 5 5-2.5 1.5-4 3-5 7-1-4-2.5-5.5-5-7 2.5-1.5 4-3 5-5z"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

function CornerOrnament({
  position,
  dark = false,
}: {
  position: "tl" | "tr" | "br" | "bl";
  dark?: boolean;
}) {
  const stroke = dark ? "var(--dbi-cream)" : "var(--dbi-ink)";
  return (
    <svg
      className={`dbi-corner dbi-corner--${position}`}
      viewBox="0 0 60 60"
      fill="none"
      stroke={stroke}
      strokeWidth="1"
      aria-hidden
    >
      <path d="M2 30 C 2 14, 14 2, 30 2" strokeLinecap="round" />
      <path d="M8 30 C 8 18, 18 8, 30 8" opacity="0.6" />
      <path
        d="M14 14 c 4 -2 8 -2 12 0 M14 14 c -2 4 -2 8 0 12"
        opacity="0.7"
      />
      <circle cx="14" cy="14" r="1.5" fill={stroke} />
      <path
        d="M22 18 q 4 -4 10 -4 M18 22 q -4 4 -4 10"
        opacity="0.5"
      />
    </svg>
  );
}

function OrnateCard({
  children,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`dbi-ornate-card${dark ? " dbi-ornate-card--dark" : ""} ${className}`.trim()}
    >
      <CornerOrnament position="tl" dark={dark} />
      <CornerOrnament position="tr" dark={dark} />
      <CornerOrnament position="bl" dark={dark} />
      <CornerOrnament position="br" dark={dark} />
      {children}
    </div>
  );
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="dbi-section-label">
      <span>— {n} —</span>
      <span>{label}</span>
    </div>
  );
}

function CountdownBlock({
  countdown,
  ui,
  compact = false,
}: {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  ui: (typeof DARK_BLUE_UI)[DarkBlueLang];
  compact?: boolean;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const items = compact
    ? [
        { value: countdown.days, label: ui.unitDays },
        { value: countdown.hours, label: ui.unitHours },
      ]
    : [
        { value: countdown.days, label: ui.unitDays },
        { value: countdown.hours, label: ui.unitHours },
        { value: countdown.minutes, label: ui.unitMinutes },
        { value: countdown.seconds, label: ui.unitSeconds },
      ];

  return (
    <div
      className={`dbi-countdown${compact ? " dbi-countdown--compact" : ""}`}
      role="timer"
      aria-live="polite"
    >
      {items.map((item) => (
        <div className="dbi-countdown-item" key={item.label}>
          <div className="dbi-countdown-value">{pad(item.value)}</div>
          <div className="dbi-countdown-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function DarkBlueInner({ data, theme }: { data: InvitationData; theme: ThemeDefaults }) {
  const [lang, setLang] = useState<DarkBlueLang>(() =>
    toDarkBlueLang(data.defaultLocale),
  );
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const toilePattern = `${ASSETS}/toile-pattern-D8JL8C9Q.png`;
  const bowOrnament = `${ASSETS}/bow-ornament-D7kq-Hoz.png`;

  const ui = DARK_BLUE_UI[lang];
  const groomName = pickLocalized(data.groomName, lang);
  const brideName = pickLocalized(data.brideName, lang);
  const coupleNames = `${groomName} ${ui.nameJoiner} ${brideName}`;
  const calendar = useMemo(
    () => buildCalendarGrid(data.weddingDate),
    [data.weddingDate],
  );
  const calendarMonth = formatCalendarMonth(data.weddingDate, lang);
  const eventDate = formatEventDate(data.weddingDate, lang);
  const shortDate = formatShortDate(data.weddingDate);
  const dotDate = formatDotDate(data.weddingDate);
  const venueName = pickLocalized(data.venue.name, lang);
  const venueAddress = pickLocalized(data.venue.address, lang);
  const musicSrc = data.backgroundMusic || DEFAULT_MUSIC;

  const heroTagline = pickLocalized(data.intro, lang);
  const inviteBody = pickLocalized(data.greeting, lang);
  const dressCodeNote =
    pickLocalized(data.verse?.translation, lang) || ui.dressCodeDefault;
  const giftsNote = ui.giftsDefault;
  const flowersNote = ui.flowersDefault;

  const scheduleItems = data.schedule.map((item) => {
    const label = pickLocalized(item.label, lang);
    const { title, desc } = splitScheduleLabel(label);
    return { time: item.time, title, desc };
  });

  const mapUrl = `https://yandex.uz/maps/?pt=${data.venue.lng},${data.venue.lat}&z=16&l=map`;
  const ink = theme.accentColor || "#1a2f4f";
  const cream = theme.backgroundColor || "#f5f0e8";

  const weekdays = [
    ui.weekdayMon,
    ui.weekdayTue,
    ui.weekdayWed,
    ui.weekdayThu,
    ui.weekdayFri,
    ui.weekdaySat,
    ui.weekdaySun,
  ];

  const playMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = MUSIC_VOLUME;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => setMusicPlaying(true))
        .catch(() => setMusicPlaying(false));
    } else {
      setMusicPlaying(!audio.paused && !audio.ended);
    }
  }, []);

  const stopMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setMusicPlaying(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (musicPlaying) stopMusic();
    else playMusic();
  }, [musicPlaying, playMusic, stopMusic]);

  const handleLanguageChange = (next: DarkBlueLang) => {
    if (next === lang) return;
    setLang(next);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Ignore storage access issues.
    }
  };

  useEffect(() => {
    setLang(getInitialLang(data));
  }, [data]);

  useEffect(() => {
    const target = getWeddingTimestamp(data);

    const tick = () => {
      const difference = target - Date.now();
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }
      setCountdown({
        days: Math.floor(difference / ONE_DAY_MS),
        hours: Math.floor((difference % ONE_DAY_MS) / ONE_HOUR_MS),
        minutes: Math.floor((difference % ONE_HOUR_MS) / ONE_MINUTE_MS),
        seconds: Math.floor((difference % ONE_MINUTE_MS) / ONE_SECOND_MS),
      });
      return true;
    };

    tick();
    const interval = window.setInterval(() => {
      const hasTimeLeft = tick();
      if (!hasTimeLeft) window.clearInterval(interval);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [data]);

  const musicLabel = musicPlaying ? ui.musicPauseLabel : ui.musicPlayLabel;

  return (
    <div
      className="dark-blue-root"
      style={
        {
          "--dbi-ink": ink,
          "--dbi-cream": cream,
        } as React.CSSProperties
      }
    >
      <nav className="dbi-language-switcher" aria-label={ui.languageSwitcher}>
        {(["ru", "uz"] as const).map((code) => (
          <button
            key={code}
            className={`dbi-language-option${lang === code ? " is-active" : ""}`}
            type="button"
            aria-label={code === "ru" ? ui.languageRuLabel : ui.languageUzLabel}
            aria-pressed={lang === code}
            onClick={() => handleLanguageChange(code)}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </nav>

      <button
        className={`dbi-music-toggle${musicPlaying ? " is-playing" : ""}`}
        type="button"
        aria-label={musicLabel}
        aria-pressed={musicPlaying}
        title={musicLabel}
        onClick={toggleMusic}
      >
        ♪
      </button>

      <main className="dbi-main">
        <div
          className="dbi-toile-strip dbi-toile-strip--left"
          style={{ backgroundImage: `url(${toilePattern})` }}
          aria-hidden
        />
        <div
          className="dbi-toile-strip dbi-toile-strip--right"
          style={{ backgroundImage: `url(${toilePattern})` }}
          aria-hidden
        />

        <div className="dbi-container">
          <section className="dbi-hero">
            <div className="dbi-hero-mobile">
              <OrnateCard>
                <p className="dbi-hero-mobile-tag">{ui.sectionInvite}</p>
                <img
                  src={bowOrnament}
                  alt=""
                  className="dbi-farewell-bow"
                  width={64}
                  height={48}
                />
                <h1 className="dbi-hero-mobile-title">{ui.weddingDayMobile}</h1>
                <div className="dbi-hero-mobile-script">{ui.weddingDayScript}</div>
                <Divider className="mt-6" />
                {heroTagline && (
                  <p className="dbi-hero-mobile-tagline">{heroTagline}</p>
                )}
                <Divider className="mt-8" />
                <p className="dbi-hero-mobile-date">{shortDate}</p>
                <p className="dbi-farewell-couple">{coupleNames}</p>
              </OrnateCard>
            </div>

            <div className="dbi-hero-desktop">
              <div className="dbi-hero-visual">
                <div
                  className="dbi-hero-pattern"
                  style={{ backgroundImage: `url(${toilePattern})` }}
                />
                <div className="dbi-hero-pattern-frame" />
                <div className="dbi-hero-bow-wrap">
                  <img
                    src={bowOrnament}
                    alt=""
                    className="dbi-hero-bow"
                    width={120}
                    height={80}
                  />
                </div>
              </div>
              <div className="dbi-hero-copy">
                <SectionLabel n="I" label={ui.sectionInvite} />
                <h1 className="dbi-hero-title">{ui.weddingDay}</h1>
                <div className="dbi-hero-script">{ui.weddingDayScript}</div>
                <div className="dbi-hero-date-row">
                  <div className="dbi-hero-date-line" />
                  <div className="dbi-hero-date">{shortDate}</div>
                  <div className="dbi-hero-date-line" />
                </div>
                {heroTagline && <p className="dbi-hero-tagline">{heroTagline}</p>}
                <p className="dbi-hero-couple">{coupleNames}</p>
              </div>
            </div>
          </section>

          <section className="dbi-section">
            <div className="dbi-invite-grid">
              <div className="dbi-invite-copy">
                <SectionLabel n="II" label={ui.sectionDate} />
                <h2 className="dbi-invite-heading">
                  {ui.friendsPrefix}{" "}
                  <span className="dbi-script">{ui.friendsScript}</span>{" "}
                  {ui.friendsSuffix}
                </h2>
                {inviteBody ? (
                  <p className="dbi-invite-body">{inviteBody}</p>
                ) : (
                  <p className="dbi-invite-body">
                    {lang === "ru" ? (
                      <>
                        С радостью приглашаем вас на наш самый важный день — свадьбу,
                        которая состоится{" "}
                        <strong>{eventDate}</strong>. Мы будем счастливы разделить с
                        вами этот трепетный момент.
                      </>
                    ) : (
                      <>
                        Eng muhim kunimiz — to&apos;yimizga sizni samimiy taklif
                        etamiz. Tadbir <strong>{eventDate}</strong> kuni bo&apos;lib
                        o&apos;tadi. Bu hayajonli lahzani siz bilan baham ko&apos;rishni
                        xohlaymiz.
                      </>
                    )}
                  </p>
                )}
                <div className="dbi-desktop-only">
                  <CountdownBlock countdown={countdown} ui={ui} compact />
                </div>
              </div>

              <div className="dbi-invite-calendar-wrap">
                <OrnateCard>
                  <h3 className="dbi-calendar-title">{calendarMonth}</h3>
                  <Divider />
                  <div
                    className="dbi-calendar-grid"
                    role="img"
                    aria-label={ui.calendarDayLabel}
                  >
                    {weekdays.map((day) => (
                      <span className="dbi-calendar-weekday" key={day}>
                        {day}
                      </span>
                    ))}
                    {calendar.rows.flat().map((day, index) =>
                      day === null ? (
                        <span
                          className="dbi-calendar-day dbi-calendar-day--muted"
                          key={index}
                          aria-hidden
                        />
                      ) : day === calendar.weddingDay ? (
                        <div className="dbi-heart-cell" key={index}>
                          <svg className="dbi-heart-icon" viewBox="0 0 24 24" aria-hidden>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="dbi-heart-day">{day}</span>
                        </div>
                      ) : (
                        <span className="dbi-calendar-day" key={index}>
                          {day}
                        </span>
                      ),
                    )}
                  </div>
                  <Divider />
                  <CountdownBlock countdown={countdown} ui={ui} compact />
                </OrnateCard>
              </div>
            </div>
          </section>

          {scheduleItems.length > 0 && (
            <section className="dbi-section">
              <OrnateCard dark className="dbi-program-wrap">
                <div className="dbi-program-header">
                  <SectionLabel n="III" label={ui.sectionSchedule} />
                  <h2 className="dbi-section-title dbi-program-title">
                    {ui.programTitle}
                  </h2>
                  <Divider />
                </div>

                <div className="dbi-program-mobile">
                  {scheduleItems.map((item, index) => (
                    <div className="dbi-program-item" key={item.time}>
                      <div className="dbi-program-time">{item.time}</div>
                      <div className="dbi-program-label">{item.title}</div>
                      {item.desc && (
                        <p className="dbi-program-desc">{item.desc}</p>
                      )}
                      {index < scheduleItems.length - 1 && (
                        <Divider className="mt-6" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="dbi-program-desktop">
                  <div className="dbi-program-timeline">
                    {scheduleItems.map((item) => (
                      <div className="dbi-program-node" key={item.time}>
                        <div className="dbi-program-diamond" />
                        <div className="dbi-program-time">{item.time}</div>
                        <div className="dbi-program-label">{item.title}</div>
                        {item.desc && (
                          <p className="dbi-program-desc">{item.desc}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </OrnateCard>
            </section>
          )}

          <section className="dbi-section">
            <div className="dbi-venue-grid">
              <div className="dbi-venue-copy">
                <SectionLabel n="IV" label={ui.venueTitle} />
                <h2 className="dbi-palette-heading">{venueName}</h2>
                <p className="dbi-venue-address">{venueAddress}</p>
                <a
                  className="dbi-map-link"
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ui.mapLink}
                </a>
              </div>
              <div className="dbi-venue-card">
                <OrnateCard>
                  <h3 className="dbi-calendar-title">{eventDate}</h3>
                  <Divider />
                  <p className="dbi-invite-body" style={{ margin: "1.5rem auto 0" }}>
                    {data.startTime}
                  </p>
                  <Divider />
                  <CountdownBlock countdown={countdown} ui={ui} />
                </OrnateCard>
              </div>
            </div>
          </section>

          <section className="dbi-section">
            <div className="dbi-palette-grid">
              <div className="dbi-palette-copy">
                <SectionLabel n="V" label={ui.sectionPalette} />
                <h2 className="dbi-palette-heading">
                  {ui.dressCodeTitle}
                  <span className="dbi-script">{ui.dressCodeScript}</span>
                </h2>
                <p className="dbi-palette-note">{dressCodeNote}</p>
              </div>
              <div className="dbi-palette-swatches">
                <div className="dbi-swatch-grid">
                  {PALETTE_SWATCHES.map((swatch) => (
                    <div className="dbi-swatch" key={swatch.hex}>
                      <div
                        className="dbi-swatch-image"
                        style={{ backgroundImage: `url(${swatch.image})` }}
                        role="img"
                        aria-label={ui[swatch.labelKey]}
                      />
                      <span className="dbi-swatch-label">
                        {ui[swatch.labelKey]}
                      </span>
                      <span className="dbi-swatch-hex">{swatch.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="dbi-section">
            <div className="dbi-details">
              <SectionLabel n="VI" label={ui.sectionDetails} />
              <h2 className="dbi-section-title dbi-details-title">
                {ui.detailsTitle}
              </h2>
              <Divider />
              <div className="dbi-details-grid">
                <div className="dbi-details-item">
                  <h3>{ui.giftsTitle}</h3>
                  <p>{giftsNote}</p>
                </div>
                <div className="dbi-details-item">
                  <h3>{ui.flowersTitle}</h3>
                  <p>{flowersNote}</p>
                </div>
              </div>
            </div>
          </section>

          {data.rsvpEnabled !== false && (
            <section className="dbi-section">
              <div className="dbi-rsvp-grid">
                <div className="dbi-rsvp-copy dbi-desktop-only dbi-desktop-only--flex">
                  <SectionLabel n="VII" label={ui.sectionRsvp} />
                  <h2 className="dbi-rsvp-heading">
                    {ui.rsvpTitle}{" "}
                    <span className="dbi-script">{ui.rsvpGuestScript}</span>
                  </h2>
                  <p className="dbi-rsvp-note">{ui.rsvpSubtitle}</p>
                  <img
                    src={bowOrnament}
                    alt=""
                    className="dbi-farewell-bow"
                    width={64}
                    height={48}
                  />
                </div>
                <div className="dbi-rsvp-card">
                  <OrnateCard dark>
                    <div className="dbi-rsvp-inner">
                      <h2 className="dbi-section-title">{ui.rsvpTitle}</h2>
                      <Divider />
                      <p className="dbi-rsvp-note">{ui.rsvpSubtitle}</p>
                      <a className="dbi-rsvp-btn" href="#rsvp">
                        {ui.rsvpCta}
                      </a>
                    </div>
                  </OrnateCard>
                </div>
              </div>
            </section>
          )}

          <section className="dbi-farewell">
            <Divider />
            <p className="dbi-farewell-text">
              {ui.farewellPrefix}{" "}
              <span className="dbi-script">{ui.farewellScript}</span>
              {ui.farewellSuffix}
            </p>
            <p className="dbi-farewell-couple">{coupleNames}</p>
            <img
              src={bowOrnament}
              alt=""
              className="dbi-farewell-bow"
              width={56}
              height={48}
              loading="lazy"
            />
            <p className="dbi-farewell-date">{dotDate}</p>
          </section>

          <TemplateCredit />
        </div>
      </main>

      <audio ref={audioRef} src={musicSrc} preload="auto" loop />
    </div>
  );
}

export default function DarkBlueInvitationTemplate({ data, theme }: TemplateProps) {
  return <DarkBlueInner data={data} theme={theme} />;
}
