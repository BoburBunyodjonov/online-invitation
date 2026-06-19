import type { Locale } from "@/config/locales";

/**
 * Static UI strings used by template chrome (countdown labels, route buttons,
 * calendar weekdays, unlock gate). Invitation *content* lives in the data;
 * these are the fixed labels, localized for all 4 locales.
 */
export const TEMPLATE_STRINGS: Record<
  Locale,
  {
    countdown: { days: string; hours: string; minutes: string; seconds: string };
    weekdays: string[]; // Monday-first
    startAt: string;
    route: { google: string; yandex: string };
    scrollDown: string;
    gate: { title: string; subtitle: string; button: string };
    invite: string; // "We are delighted to invite you"
  }
> = {
  ru: {
    countdown: { days: "дней", hours: "часов", minutes: "минут", seconds: "секунд" },
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    startAt: "Начало в",
    route: { google: "Google маршрут", yandex: "Яндекс маршрут" },
    scrollDown: "Листайте вниз",
    gate: {
      title: "Вы получили приглашение",
      subtitle: "Нажмите, чтобы открыть приглашение",
      button: "Открыть",
    },
    invite: "Мы рады пригласить вас",
  },
  en: {
    countdown: { days: "days", hours: "hours", minutes: "minutes", seconds: "seconds" },
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    startAt: "Starts at",
    route: { google: "Google route", yandex: "Yandex route" },
    scrollDown: "Scroll down",
    gate: {
      title: "You have received an invitation",
      subtitle: "Tap to open your invitation",
      button: "Unlock",
    },
    invite: "We are delighted to invite you",
  },
  uz: {
    countdown: { days: "kun", hours: "soat", minutes: "daqiqa", seconds: "soniya" },
    weekdays: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
    startAt: "Boshlanishi",
    route: { google: "Google yo‘nalish", yandex: "Yandex yo‘nalish" },
    scrollDown: "Pastga suring",
    gate: {
      title: "Sizga taklifnoma keldi",
      subtitle: "Taklifnomani ochish uchun bosing",
      button: "Ochish",
    },
    invite: "Sizni taklif qilishdan mamnunmiz",
  },
  "uz-Cyrl": {
    countdown: { days: "кун", hours: "соат", minutes: "дақиқа", seconds: "сония" },
    weekdays: ["Ду", "Се", "Ча", "Па", "Жу", "Ша", "Як"],
    startAt: "Бошланиши",
    route: { google: "Google йўналиш", yandex: "Yandex йўналиш" },
    scrollDown: "Пастга суринг",
    gate: {
      title: "Сизга таклифнома келди",
      subtitle: "Таклифномани очиш учун босинг",
      button: "Очиш",
    },
    invite: "Сизни таклиф қилишдан мамнунмиз",
  },
};
