export type DarkBlueLang = "ru" | "uz";

export const DARK_BLUE_UI: Record<DarkBlueLang, Record<string, string>> = {
  ru: {
    sectionInvite: "Приглашение на торжество",
    sectionDate: "Дата торжества",
    sectionSchedule: "Расписание дня",
    sectionPalette: "Палитра вечера",
    sectionDetails: "Несколько слов",
    sectionRsvp: "Ответьте, пожалуйста",
    programTitle: "Программа",
    dressCodeTitle: "Дресс-",
    dressCodeScript: "код",
    detailsTitle: "Детали",
    giftsTitle: "Подарки",
    flowersTitle: "Цветы",
    rsvpTitle: "Анкета",
    rsvpGuestScript: "гостя",
    friendsPrefix: "Дорогие",
    friendsScript: "друзья",
    friendsSuffix: "и близкие",
    weddingDay: "Wedding",
    weddingDayScript: "Day",
    weddingDayMobile: "WEDDING",
    farewellPrefix: "До скорой",
    farewellScript: "встречи",
    farewellSuffix: "!",
    countdownTitle: "До торжества",
    unitDays: "дней",
    unitHours: "часов",
    unitMinutes: "минут",
    unitSeconds: "секунд",
    calendarDayLabel: "День торжества",
    venueTitle: "Место проведения",
    mapLink: "Открыть карту",
    dressCodeDefault:
      "Будем признательны, если вы поддержите нас и придёте, подобрав образ в одном из наших оттенков — пудровый, кремовый и индиго.",
    giftsDefault:
      "Лучшим подарком станет ваше присутствие. Если захотите дополнить — будем рады вашему вниманию в любой форме.",
    flowersDefault:
      "Пожалуйста, не дарите нам цветы — мы будем благодарны за тёплые объятия и добрые пожелания.",
    rsvpSubtitle:
      "Будем благодарны за ответ. Это поможет нам подготовить идеальный вечер для каждого гостя.",
    rsvpCta: "Ответить",
    paletteCream: "Cream",
    palettePowder: "Powder",
    paletteIndigo: "Indigo",
    weekdayMon: "пн",
    weekdayTue: "вт",
    weekdayWed: "ср",
    weekdayThu: "чт",
    weekdayFri: "пт",
    weekdaySat: "сб",
    weekdaySun: "вс",
    languageSwitcher: "Выбор языка",
    languageRuLabel: "Русский",
    languageUzLabel: "O'zbekcha",
    musicPlayLabel: "Включить музыку",
    musicPauseLabel: "Остановить музыку",
    nameJoiner: "и",
  },
  uz: {
    sectionInvite: "Tantanaga taklif",
    sectionDate: "Tantana sanasi",
    sectionSchedule: "Kun tartibi",
    sectionPalette: "Kecha palitrasi",
    sectionDetails: "Bir necha so'z",
    sectionRsvp: "Iltimos, javob bering",
    programTitle: "Dastur",
    dressCodeTitle: "Kiyim",
    dressCodeScript: "kodi",
    detailsTitle: "Tafsilotlar",
    giftsTitle: "Sovg'alar",
    flowersTitle: "Gullar",
    rsvpTitle: "Anketa",
    rsvpGuestScript: "mehmon",
    friendsPrefix: "Aziz",
    friendsScript: "do'stlar",
    friendsSuffix: "va yaqinlaringiz",
    weddingDay: "Wedding",
    weddingDayScript: "Day",
    weddingDayMobile: "WEDDING",
    farewellPrefix: "Tez orada",
    farewellScript: "ko'rishguncha",
    farewellSuffix: "!",
    countdownTitle: "Tantanaga qadar",
    unitDays: "kun",
    unitHours: "soat",
    unitMinutes: "daqiqa",
    unitSeconds: "soniya",
    calendarDayLabel: "Tantana kuni",
    venueTitle: "Tadbir joyi",
    mapLink: "Xaritani ochish",
    dressCodeDefault:
      "Bizni qo'llab-quvvatlab, pudra, krem va indigo ranglaridan birida kelsangiz, minnatdor bo'lamiz.",
    giftsDefault:
      "Eng yaxshi sovg'a — sizning ishtirokingiz. Qo'shimcha xohlasangiz, har qanday e'tiboringizdan xursandmiz.",
    flowersDefault:
      "Iltimos, bizga gul bermang — iliq quchoq va yaxshi tilaklaringiz biz uchun yetarli.",
    rsvpSubtitle:
      "Javobingiz bizga har bir mehmon uchun mukammal kechani tayyorlashga yordam beradi.",
    rsvpCta: "Javob berish",
    paletteCream: "Cream",
    palettePowder: "Powder",
    paletteIndigo: "Indigo",
    weekdayMon: "du",
    weekdayTue: "se",
    weekdayWed: "chor",
    weekdayThu: "pay",
    weekdayFri: "ju",
    weekdaySat: "sha",
    weekdaySun: "ya",
    languageSwitcher: "Tilni tanlash",
    languageRuLabel: "Русский",
    languageUzLabel: "O'zbekcha",
    musicPlayLabel: "Musiqani yoqish",
    musicPauseLabel: "Musiqani to'xtatish",
    nameJoiner: "va",
  },
};

export function toDarkBlueLang(locale: string): DarkBlueLang {
  if (locale === "ru" || locale === "uz-Cyrl") return "ru";
  return "uz";
}

export function formatEventDate(weddingDate: string, lang: DarkBlueLang): string {
  const [year, month, day] = weddingDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const locale = lang === "ru" ? "ru-RU" : "uz-UZ";
  const monthLabel = date.toLocaleDateString(locale, { month: "long" });
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  if (lang === "ru") return `${day} ${capitalized} ${year}`;
  return `${day} ${capitalized}, ${year}`;
}

export function formatShortDate(weddingDate: string): string {
  const [year, month, day] = weddingDate.split("-").map(Number);
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  return `${dd}.${mm}.${year}`;
}

export function formatDotDate(weddingDate: string): string {
  const [year, month, day] = weddingDate.split("-").map(Number);
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  return `${dd} · ${mm} · ${year}`;
}

export function formatCalendarMonth(
  weddingDate: string,
  lang: DarkBlueLang,
): string {
  const [year, month] = weddingDate.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const locale = lang === "ru" ? "ru-RU" : "uz-UZ";
  const monthLabel = date.toLocaleDateString(locale, { month: "long" });
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  return `${capitalized} ${year}`;
}
