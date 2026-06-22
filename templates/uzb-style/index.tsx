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
import {
  buildCalendarGrid,
  formatCalendarMonth,
} from "../blue-envelope/calendar";
import {
  UZB_STYLE_UI,
  toUzbStyleLang,
  type UzbStyleLang,
} from "./locales";
import "./styles.css";

const ASSETS = "/templates/uzb-style/assets";
const DEFAULT_MUSIC = `${ASSETS}/uzbek%20music.mp3`;
const MUSIC_VOLUME = 0.16;
const OPENING_DURATION_MS = 1000;
const LANGUAGE_STORAGE_KEY = "uzbStyleLanguage";

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
  lang: UzbStyleLang,
  fallback = "",
) {
  if (!field) return fallback;
  return field[lang] ?? field.ru ?? field.uz ?? Object.values(field)[0] ?? fallback;
}

function textToHtml(text: string) {
  return text.replace(/\n/g, "<br />");
}

function splitVenueAddress(address: string): [string, string | null] {
  const parts = address
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (parts.length <= 1) return [address.trim(), null];
  return [parts[0], parts.slice(1).join("\n")];
}

function getInitialLang(data: InvitationData): UzbStyleLang {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "ru" || saved === "uz") return saved;
    } catch {
      // Ignore storage access issues.
    }
  }
  return toUzbStyleLang(data.defaultLocale);
}

function getWeddingTimestamp(data: InvitationData) {
  return new Date(
    `${data.weddingDate}T${data.startTime || "18:00"}:00+05:00`,
  ).getTime();
}

function UzbStyleInner({ data }: { data: InvitationData }) {
  const [lang, setLang] = useState<UzbStyleLang>(() =>
    toUzbStyleLang(data.defaultLocale),
  );
  const [invitationVisible, setInvitationVisible] = useState(!data.unlockGate);
  const [introOpened, setIntroOpened] = useState(false);
  const [introHidden, setIntroHidden] = useState(!data.unlockGate);
  const [introFadeOut, setIntroFadeOut] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const heritageNamesRef = useRef<HTMLParagraphElement>(null);
  const letterHeroRef = useRef<HTMLElement>(null);
  const letterCardRef = useRef<HTMLElement>(null);
  const fitFrameRef = useRef<number | null>(null);

  const ui = UZB_STYLE_UI[lang];
  const groomName = pickLocalized(data.groomName, lang);
  const brideName = pickLocalized(data.brideName, lang);
  const signatureNames = `${groomName}\u00a0${ui.nameJoiner}\u00a0${brideName}`;
  const calendar = useMemo(
    () => buildCalendarGrid(data.weddingDate),
    [data.weddingDate],
  );
  const calendarMonth = formatCalendarMonth(data.weddingDate, lang);
  const venueName = pickLocalized(data.venue.name, lang);
  const venueAddressRaw = pickLocalized(data.venue.address, lang);
  const [venueAddress, venueLandmark] = splitVenueAddress(venueAddressRaw);
  const musicSrc = data.backgroundMusic || DEFAULT_MUSIC;

  const heroHtml =
    data.greeting?.[lang] || data.greeting?.ru
      ? textToHtml(pickLocalized(data.greeting, lang, ui.heroNames))
      : ui.heroNames;

  const leadHtml =
    data.intro?.[lang] || data.intro?.ru
      ? textToHtml(pickLocalized(data.intro, lang, ui.lead))
      : ui.lead;

  const yandexMapUrl = `https://yandex.uz/maps/?pt=${data.venue.lng},${data.venue.lat}&z=16&l=map`;
  const googleMapUrl = `https://www.google.com/maps?q=${data.venue.lat},${data.venue.lng}`;

  const fitHeritageNames = useCallback(() => {
    const namesBlock = heritageNamesRef.current;
    if (!namesBlock) return;

    const nameLines = Array.from(
      namesBlock.querySelectorAll(".ornament-name-line"),
    );
    if (!nameLines.length) return;

    namesBlock.style.setProperty("--ornament-name-fit-scale", "1");
    nameLines.forEach((line) => {
      (line as HTMLElement).style.setProperty("--line-fit-scale", "1");
    });

    const availableWidth = namesBlock.clientWidth;
    if (!availableWidth) return;

    const sideSafePadding = Math.max(8, availableWidth * 0.045);
    const safeWidth = Math.max(0, availableWidth - sideSafePadding * 2);
    if (!safeWidth) return;

    nameLines.forEach((line) => {
      const el = line as HTMLElement;
      const lineWidth = el.scrollWidth;
      if (!lineWidth) return;
      const fitScale = Math.max(
        0.68,
        Math.min(1, (safeWidth / lineWidth) * 0.985),
      );
      el.style.setProperty("--line-fit-scale", fitScale.toFixed(3));
    });
  }, []);

  const scheduleHeritageNameFit = useCallback(() => {
    if (fitFrameRef.current !== null) {
      window.cancelAnimationFrame(fitFrameRef.current);
    }
    fitFrameRef.current = window.requestAnimationFrame(() => {
      fitHeritageNames();
      fitFrameRef.current = null;
    });
  }, [fitHeritageNames]);

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
    const reveals = document.querySelectorAll(".uzb-style-root .reveal");
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
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    reveals.forEach((node, index) => {
      (node as HTMLElement).style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
      observer.observe(node);
    });
  }, []);

  const openInvitation = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);
    setIntroOpened(true);
    playMusic();

    window.setTimeout(() => {
      setInvitationVisible(true);
      setIntroFadeOut(true);
      window.scrollTo(0, 0);
      revealVisibleSections();
      scheduleHeritageNameFit();

      window.setTimeout(() => {
        setIntroHidden(true);
      }, 900);
    }, OPENING_DURATION_MS);
  }, [isOpening, playMusic, revealVisibleSections, scheduleHeritageNameFit]);

  const handleLanguageChange = (next: UzbStyleLang) => {
    if (next === lang) return;
    setLang(next);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Ignore storage access issues.
    }
    scheduleHeritageNameFit();
  };

  const scrollToLetterCard = (event: React.MouseEvent) => {
    event.preventDefault();
    letterCardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setLang(getInitialLang(data));
  }, [data]);

  useEffect(() => {
    if (!data.unlockGate) {
      revealVisibleSections();
      scheduleHeritageNameFit();
    }
  }, [data.unlockGate, revealVisibleSections, scheduleHeritageNameFit]);

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

  useEffect(() => {
    scheduleHeritageNameFit();
    window.addEventListener("resize", scheduleHeritageNameFit);
    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleHeritageNameFit);
    }
    return () => {
      window.removeEventListener("resize", scheduleHeritageNameFit);
      if (fitFrameRef.current !== null) {
        window.cancelAnimationFrame(fitFrameRef.current);
      }
    };
  }, [lang, invitationVisible, scheduleHeritageNameFit]);

  useEffect(() => {
    const hero = letterHeroRef.current;
    if (!hero || !invitationVisible) return;

    if (!("IntersectionObserver" in window)) {
      setHeroInView(true);
      return;
    }

    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setHeroInView(entry.isIntersecting);
        });
      },
      { threshold: 0.22 },
    );

    heroObserver.observe(hero);
    return () => heroObserver.disconnect();
  }, [invitationVisible]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const musicLabel = musicPlaying ? ui.musicPauseLabel : ui.musicPlayLabel;
  const countdownMessage = countdown.isPast
    ? ui.countdownToday
    : ui.countdownWaiting;

  const showIntro = data.unlockGate && !introHidden;
  const rootClass = [
    "uzb-style-root",
    invitationVisible ? "invitation-visible" : "",
    showIntro ? "intro-active" : "",
    heroInView ? "hero-in-view" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <nav className="language-switcher" aria-label={ui.languageSwitcher}>
        {(["ru", "uz"] as const).map((code) => (
          <button
            key={code}
            className={`language-option${lang === code ? " is-active" : ""}`}
            type="button"
            aria-label={code === "ru" ? ui.languageRuLabel : ui.languageUzLabel}
            aria-pressed={lang === code}
            title={code === "ru" ? ui.languageRuLabel : ui.languageUzLabel}
            onClick={() => handleLanguageChange(code)}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </nav>

      <button
        className={`music-toggle${musicPlaying ? " is-playing" : ""}`}
        type="button"
        aria-label={musicLabel}
        aria-pressed={musicPlaying}
        title={musicLabel}
        onClick={toggleMusic}
      >
        <img
          className="music-icon-image"
          src={`${ASSETS}/musicIcon.png`}
          alt=""
          aria-hidden
        />
      </button>

      {showIntro && (
        <section
          className={`intro${introOpened ? " opened" : ""}${introFadeOut ? " fade-out" : ""}`}
          aria-label={ui.ariaIntro}
        >
          <div className="envelope-stage" role="img" aria-label={ui.ariaEnvelope}>
            <div className="flap flap-top">
              <p
                className="flap-note"
                dangerouslySetInnerHTML={{ __html: ui.envelopeTopNote }}
              />
            </div>
            <div className="flap flap-left" />
            <div className="flap flap-right" />
            <div className="flap flap-bottom">
              <p className="flap-signature">
                <span>{ui.withLove}</span>
                <br />
                <strong>{signatureNames}</strong>
              </p>
            </div>

            <button
              className="seal-button"
              type="button"
              aria-expanded={introOpened}
              onClick={openInvitation}
            >
              <span dangerouslySetInnerHTML={{ __html: ui.openHere }} />
            </button>
          </div>
        </section>
      )}

      <main className="invitation" aria-hidden={!invitationVisible}>
        <section className="letter-hero reveal" ref={letterHeroRef}>
          <article
            className="heritage-hero"
            role="img"
            aria-label={ui.ariaOrnamentHero}
          >
            <img
              className="heritage-border"
              src={`${ASSETS}/border%20ornament.png`}
              alt=""
              aria-hidden
            />
            <div className="heritage-horns" aria-hidden>
              <img
                className="heritage-horn heritage-horn--left"
                src={`${ASSETS}/musicInstrument.png`}
                alt=""
              />
              <img
                className="heritage-horn heritage-horn--right"
                src={`${ASSETS}/musicInstrument.png`}
                alt=""
              />
            </div>
            <p className="ornament-names heritage-names" ref={heritageNamesRef}>
              <span className="ornament-name-line">{groomName}</span>
              <span className="ornament-name-amp">{ui.nameJoiner}</span>
              <span className="ornament-name-line">{brideName}</span>
            </p>
            <img
              className="heritage-couple"
              src={`${ASSETS}/couple.png`}
              alt=""
              aria-hidden
            />
          </article>

          <a
            className="scroll-indicator scroll-indicator--hero"
            href="#letterCard"
            onClick={scrollToLetterCard}
          >
            <span className="scroll-indicator__text">{ui.scrollHint}</span>
            <span className="scroll-indicator__arrow" aria-hidden>
              ↓
            </span>
          </a>
        </section>

        <section className="letter-card reveal" id="letterCard" ref={letterCardRef}>
          <h1
            className="hero-title"
            dangerouslySetInnerHTML={{ __html: heroHtml }}
          />
          <p className="lead" dangerouslySetInnerHTML={{ __html: leadHtml }} />
        </section>

        <div className="details-sections has-sprigs">
          <div className="section-sprigs" aria-hidden>
            <img
              className="section-sprig section-sprig--top-left"
              src={`${ASSETS}/pomegranate.png`}
              alt=""
            />
            <img
              className="section-sprig section-sprig--mid-right"
              src={`${ASSETS}/pomegranate.png`}
              alt=""
            />
            <img
              className="section-sprig section-sprig--bottom-left"
              src={`${ASSETS}/flowerUzb.png`}
              alt=""
            />
          </div>

          <section className="calendar-section reveal" aria-label={ui.ariaWeddingDate}>
            <div className="calendar" role="img" aria-label={ui.ariaCalendar}>
              <div className="calendar-head">
                <span>{calendarMonth}</span>
              </div>

              <div className="calendar-grid week-days">
                <span>{ui.weekdayMon}</span>
                <span>{ui.weekdayTue}</span>
                <span>{ui.weekdayWed}</span>
                <span>{ui.weekdayThu}</span>
                <span>{ui.weekdayFri}</span>
                <span>{ui.weekdaySat}</span>
                <span>{ui.weekdaySun}</span>
              </div>

              {calendar.rows.map((row, rowIndex) => (
                <div className="calendar-grid days" key={rowIndex}>
                  {row.map((day, cellIndex) =>
                    day === null ? (
                      <span key={cellIndex} aria-hidden />
                    ) : day === calendar.weddingDay ? (
                      <div
                        className="heart-cell"
                        key={cellIndex}
                        aria-label={ui.ariaWeddingDay}
                      >
                        <span className="heart-day">
                          <span>{day}</span>
                        </span>
                      </div>
                    ) : (
                      <span key={cellIndex}>{day}</span>
                    ),
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="location-section reveal" aria-label={ui.ariaVenueDetails}>
            <h2 className="location-title">{ui.locationTitle}</h2>
            <p className="venue-name">{venueName}</p>
            <p className="venue-address">{venueAddress}</p>
            {venueLandmark && (
              <p className="venue-address">{venueLandmark}</p>
            )}
            <div className="map-links">
              <a
                className="map-link"
                href={yandexMapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{ui.mapLinkYandex}</span>
              </a>
              <a
                className="map-link"
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{ui.mapLinkGoogle}</span>
              </a>
            </div>
          </section>

          <section className="countdown-section reveal" aria-label={ui.ariaCountdown}>
            <h2>{ui.countdownTitle}</h2>

            <div className="countdown" role="timer" aria-live="polite">
              <div className="time-unit">
                <span>{pad(countdown.days)}</span>
                <small>{ui.unitDays}</small>
              </div>
              <div className="time-unit">
                <span>{pad(countdown.hours)}</span>
                <small>{ui.unitHours}</small>
              </div>
              <div className="time-unit">
                <span>{pad(countdown.minutes)}</span>
                <small>{ui.unitMinutes}</small>
              </div>
              <div className="time-unit">
                <span>{pad(countdown.seconds)}</span>
                <small>{ui.unitSeconds}</small>
              </div>
            </div>

            <p className="countdown-message">{countdownMessage}</p>
          </section>
        </div>

        <footer className="invite-credit">
          by
          <a
            className="invite-credit-link"
            href="https://t.me/+uIKM6GREFTozNjdi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="InviteStudio bot"
          >
            InviteStudio
          </a>
        </footer>
      </main>

      <audio ref={audioRef} src={musicSrc} preload="auto" loop />
    </div>
  );
}

export default function UzbStyleTemplate({ data }: TemplateProps) {
  return <UzbStyleInner data={data} />;
}
