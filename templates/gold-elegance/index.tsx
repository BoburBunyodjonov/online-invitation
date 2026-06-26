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
  GOLD_ELEGANCE_UI,
  formatCalendarMonth,
  formatEventDate,
  toGoldEleganceLang,
  type GoldEleganceLang,
} from "./locales";
import { TemplateCredit } from "../shared/TemplateCredit";
import "./styles.css";

const ASSETS = "/templates/gold-elegance/assets";
const DEFAULT_MUSIC = `${ASSETS}/music.mp3`;
const MUSIC_VOLUME = 0.2;
const LANGUAGE_STORAGE_KEY = "goldEleganceLanguage";

const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
const ONE_HOUR_MS = ONE_MINUTE_MS * 60;
const ONE_DAY_MS = ONE_HOUR_MS * 24;

export interface TemplateProps {
  data: InvitationData;
  theme: ThemeDefaults;
}

function pickLocalized(
  field: Partial<Record<string, string>> | undefined,
  lang: GoldEleganceLang,
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

function textToHtml(text: string) {
  return text.replace(/\n/g, "<br />");
}

function splitVenueAddress(address: string): string[] {
  return address
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getInitialLang(data: InvitationData): GoldEleganceLang {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "ru" || saved === "uz") return saved;
    } catch {
      // Ignore storage access issues.
    }
  }
  return toGoldEleganceLang(data.defaultLocale);
}

function getWeddingTimestamp(data: InvitationData) {
  return new Date(
    `${data.weddingDate}T${data.startTime || "18:00"}:00+05:00`,
  ).getTime();
}

function Divider() {
  return (
    <div className="ge-divider" aria-hidden>
      <span className="ge-divider-dot" />
    </div>
  );
}

function HeartIcon() {
  return (
    <svg className="ge-heart-icon" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="ge-event-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="ge-event-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="ge-event-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function GoldEleganceInner({ data, theme }: { data: InvitationData; theme: ThemeDefaults }) {
  const [lang, setLang] = useState<GoldEleganceLang>(() =>
    toGoldEleganceLang(data.defaultLocale),
  );
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const ui = GOLD_ELEGANCE_UI[lang];
  const groomName = pickLocalized(data.groomName, lang);
  const brideName = pickLocalized(data.brideName, lang);
  const signatureNames = `${groomName} & ${brideName}`;
  const calendar = useMemo(
    () => buildCalendarGrid(data.weddingDate),
    [data.weddingDate],
  );
  const calendarMonth = formatCalendarMonth(data.weddingDate, lang);
  const eventDate = formatEventDate(data.weddingDate, lang);
  const venueName = pickLocalized(data.venue.name, lang);
  const venueAddressLines = splitVenueAddress(
    pickLocalized(data.venue.address, lang),
  );
  const musicSrc = data.backgroundMusic || DEFAULT_MUSIC;
  const heroPhoto = data.heroPhoto || `${ASSETS}/wedding-hero.jpg`;

  const greetingHtml = data.greeting?.[lang] || data.greeting?.ru
    ? textToHtml(pickLocalized(data.greeting, lang))
    : "";

  const introHtml = data.intro?.[lang] || data.intro?.ru
    ? textToHtml(pickLocalized(data.intro, lang))
    : "";

  const hostsTitle = pickLocalized(data.verse?.source, lang);
  const hostsNames = pickLocalized(data.verse?.translation, lang);

  const yandexMapUrl = `https://yandex.uz/maps/?pt=${data.venue.lng},${data.venue.lat}&z=16&l=map`;
  const mapUrl = yandexMapUrl;

  const accent = theme.accentColor || "#c9a227";

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

  const revealVisibleSections = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const reveals = root.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((node) => node.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );

    reveals.forEach((node, index) => {
      (node as HTMLElement).style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
      observer.observe(node);
    });
  }, []);

  const handleLanguageChange = (next: GoldEleganceLang) => {
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
    revealVisibleSections();
  }, [revealVisibleSections, lang]);

  useEffect(() => {
    const target = getWeddingTimestamp(data);

    const tick = () => {
      const difference = target - Date.now();
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return false;
      }
      setCountdown({
        days: Math.floor(difference / ONE_DAY_MS),
        hours: Math.floor((difference % ONE_DAY_MS) / ONE_HOUR_MS),
        minutes: Math.floor((difference % ONE_HOUR_MS) / ONE_MINUTE_MS),
        seconds: Math.floor((difference % ONE_MINUTE_MS) / ONE_SECOND_MS),
        isPast: false,
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

  const pad = (n: number) => String(n).padStart(2, "0");
  const musicLabel = musicPlaying ? ui.musicPauseLabel : ui.musicPlayLabel;
  const weekdays = [
    ui.weekdayMon,
    ui.weekdayTue,
    ui.weekdayWed,
    ui.weekdayThu,
    ui.weekdayFri,
    ui.weekdaySat,
    ui.weekdaySun,
  ];

  return (
    <div
      className="gold-elegance-root"
      ref={rootRef}
      style={
        {
          "--ge-gold": accent,
          "--ge-bg": theme.backgroundColor || "#fafafa",
        } as React.CSSProperties
      }
    >
      <nav className="ge-language-switcher" aria-label={ui.languageSwitcher}>
        {(["ru", "uz"] as const).map((code) => (
          <button
            key={code}
            className={`ge-language-option${lang === code ? " is-active" : ""}`}
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
        className={`ge-music-toggle${musicPlaying ? " is-playing" : ""}`}
        type="button"
        aria-label={musicLabel}
        aria-pressed={musicPlaying}
        title={musicLabel}
        onClick={toggleMusic}
      >
        ♪
      </button>

      <section className="ge-hero">
        <div className="ge-hero-bg">
          <img src={heroPhoto} alt="" />
        </div>
        <div className="ge-hero-content">
          <Divider />
          <div className="ge-hero-names">
            <h1 className="ge-hero-name ge-hero-name--left gold-gradient-text">
              {groomName}
            </h1>
            <span className="ge-hero-amp">&</span>
            <h1 className="ge-hero-name ge-hero-name--right gold-gradient-text">
              {brideName}
            </h1>
          </div>
          <div className="ge-hero-hands">
            <img src={`${ASSETS}/hands.png`} alt="" />
          </div>
          <p className="ge-hero-subtitle">{ui.weddingSubtitle}</p>
        </div>
      </section>

      <section className="wedding-section reveal">
        <div className="section-inner">
          <Divider />
          {greetingHtml && (
            <p
              className="ge-greeting"
              dangerouslySetInnerHTML={{ __html: greetingHtml }}
            />
          )}
          {introHtml && (
            <p
              className="ge-intro"
              dangerouslySetInnerHTML={{ __html: introHtml }}
            />
          )}
          {hostsTitle && (
            <>
              <h2 className="ge-hosts-title">{hostsTitle}</h2>
              {hostsNames && <p className="ge-hosts-names">{hostsNames}</p>}
            </>
          )}
          <Divider />
        </div>
      </section>

      <section className="wedding-section reveal">
        <div className="section-inner">
          <Divider />
          <h2 className="ge-countdown-title">{ui.countdownTitle}</h2>
          <div className="ge-countdown-grid" role="timer" aria-live="polite">
            {[
              { value: countdown.days, label: ui.unitDays },
              { value: countdown.hours, label: ui.unitHours },
              { value: countdown.minutes, label: ui.unitMinutes },
              { value: countdown.seconds, label: ui.unitSeconds },
            ].map((item) => (
              <div className="ge-countdown-item" key={item.label}>
                <span className="ge-countdown-number">{pad(item.value)}</span>
                <span className="ge-countdown-label">{item.label}</span>
              </div>
            ))}
          </div>
          <Divider />
        </div>
      </section>

      <section className="wedding-section ge-event-section reveal">
        <div className="ge-calendar-wrap">
          <div className="ge-calendar" role="img" aria-label={ui.calendarDayLabel}>
            <div className="ge-calendar-head">
              <p className="ge-calendar-month">{calendarMonth}</p>
              <p className="ge-calendar-sub">{ui.calendarDayLabel}</p>
            </div>
            <div className="ge-calendar-grid">
              {weekdays.map((day) => (
                <span className="ge-calendar-weekday" key={day}>
                  {day}
                </span>
              ))}
              {calendar.rows.flat().map((day, index) =>
                day === null ? (
                  <span className="ge-calendar-day ge-calendar-day--muted" key={index} aria-hidden />
                ) : day === calendar.weddingDay ? (
                  <div className="ge-heart-cell" key={index} aria-label={ui.calendarDayLabel}>
                    <HeartIcon />
                    <span className="ge-heart-day">{day}</span>
                  </div>
                ) : (
                  <span className="ge-calendar-day" key={index}>
                    {day}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="section-inner">
          <Divider />
          <h2 className="ge-event-title">{ui.eventTitle}</h2>

          <div className="ge-event-block">
            <CalendarIcon />
            <p className="ge-event-date">{eventDate}</p>
          </div>

          {data.schedule.length > 0 && (
            <div className="ge-event-block">
              <ClockIcon />
              {data.schedule.map((item, index) => (
                <p className="ge-schedule-item" key={index}>
                  {item.time}
                  <span className="ge-schedule-label">
                    {pickLocalized(item.label, lang)}
                  </span>
                </p>
              ))}
            </div>
          )}

          <div className="ge-event-block">
            <MapPinIcon />
            <p className="ge-venue-name">{venueName}</p>
            {venueAddressLines.map((line, index) => (
              <p className="ge-venue-address" key={index}>
                {line}
              </p>
            ))}
            <a
              className="ge-map-link"
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ui.mapLink}
            </a>
          </div>
          <Divider />
        </div>
      </section>

      {data.rsvpEnabled !== false && (
        <section className="wedding-section reveal" id="rsvp-teaser">
          <div className="section-inner">
            <h2 className="ge-rsvp-title">{ui.rsvpTitle}</h2>
            <p className="ge-rsvp-subtitle">{ui.rsvpSubtitle}</p>
            <a className="ge-rsvp-btn" href="#rsvp">
              {ui.rsvpCta}
            </a>
          </div>
        </section>
      )}

      <section className="wedding-section reveal">
        <div className="section-inner">
          <p className="ge-footer-names gold-gradient-text">{signatureNames}</p>
          <p className="ge-footer-love">
            {ui.footerWithLove}{" "}
            <span className="ge-footer-heart" aria-hidden>
              ♥
            </span>
          </p>
        </div>
      </section>

      <TemplateCredit />
      <audio ref={audioRef} src={musicSrc} preload="auto" loop />
    </div>
  );
}

export default function GoldEleganceTemplate({ data, theme }: TemplateProps) {
  return <GoldEleganceInner data={data} theme={theme} />;
}
