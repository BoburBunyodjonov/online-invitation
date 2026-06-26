export type GoldEleganceLang = "ru" | "uz";

export const GOLD_ELEGANCE_UI: Record<
  GoldEleganceLang,
  Record<string, string>
> = {
  ru: {
    weddingSubtitle: "Үйлену тойы",
    hostsTitle: "Той иелері",
    countdownTitle: "Тойға дейін",
    unitDays: "Күн",
    unitHours: "Сағат",
    unitMinutes: "Минут",
    unitSeconds: "Секунд",
    calendarDayLabel: "Той күні",
    eventTitle: "Қуанышымызға ортақ болыңыздар!",
    mapLink: "Картаға өту",
    rsvpTitle: "Сіздерді күтеміз!",
    rsvpSubtitle: "Тойға қатысуыңызды алдын ала растауыңызды сұраймыз",
    rsvpCta: "Жауап беру",
    footerWithLove: "Махаббатпен",
    weekdayMon: "Жек",
    weekdayTue: "Дс",
    weekdayWed: "Сс",
    weekdayThu: "Ср",
    weekdayFri: "Бс",
    weekdaySat: "Жм",
    weekdaySun: "Сн",
    languageSwitcher: "Выбор языка",
    languageRuLabel: "Русский",
    languageUzLabel: "O'zbekcha",
    musicPlayLabel: "Включить музыку",
    musicPauseLabel: "Остановить музыку",
    nameJoiner: "и",
    yearSuffix: "жыл",
  },
  uz: {
    weddingSubtitle: "To'y marosimi",
    hostsTitle: "To'y egalari",
    countdownTitle: "To'yga qadar",
    unitDays: "Kun",
    unitHours: "Soat",
    unitMinutes: "Daqiqa",
    unitSeconds: "Soniya",
    calendarDayLabel: "To'y kuni",
    eventTitle: "Quvonchimizga sherik bo'ling!",
    mapLink: "Xaritaga o'tish",
    rsvpTitle: "Sizlarni kutamiz!",
    rsvpSubtitle: "To'yda ishtirok etishingizni oldindan tasdiqlashingizni so'raymiz",
    rsvpCta: "Javob berish",
    footerWithLove: "Muhabbat bilan",
    weekdayMon: "Du",
    weekdayTue: "Se",
    weekdayWed: "Chor",
    weekdayThu: "Pay",
    weekdayFri: "Ju",
    weekdaySat: "Sha",
    weekdaySun: "Ya",
    languageSwitcher: "Tilni tanlash",
    languageRuLabel: "Русский",
    languageUzLabel: "O'zbekcha",
    musicPlayLabel: "Musiqani yoqish",
    musicPauseLabel: "Musiqani to'xtatish",
    nameJoiner: "va",
    yearSuffix: "yil",
  },
};

export function toGoldEleganceLang(locale: string): GoldEleganceLang {
  if (locale === "ru" || locale === "uz-Cyrl") return "ru";
  return "uz";
}

export function formatEventDate(weddingDate: string, lang: GoldEleganceLang): string {
  const [year, month, day] = weddingDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (lang === "ru") {
    const monthLabel = date.toLocaleDateString("kk-KZ", { month: "long" });
    const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
    return `${day} ${capitalized}, ${year} жыл`;
  }
  const locale = "uz-UZ";
  const monthLabel = date.toLocaleDateString(locale, { month: "long" });
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  return `${day} ${capitalized}, ${year} yil`;
}

export function formatCalendarMonth(
  weddingDate: string,
  lang: GoldEleganceLang,
): string {
  const [year, month] = weddingDate.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const locale = lang === "ru" ? "kk-KZ" : "uz-UZ";
  const monthLabel = date.toLocaleDateString(locale, { month: "long" });
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  return `${capitalized} ${year}`;
}
