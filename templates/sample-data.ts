import type { InvitationData } from "@/lib/validation/invitation-data";
import type { FieldsSchema } from "@/lib/validation/field-schema";
import type { ThemeDefaults } from "@/lib/validation/template";

/**
 * Realistic placeholder data so previews look like a real, finished invitation.
 * Shared by /templates/[slug]/preview and the seed script.
 */
export const SAMPLE_DATA: InvitationData = {
  locales: ["ru", "en", "uz", "uz-Cyrl"],
  defaultLocale: "uz",
  groomName: { ru: "Улугбек", en: "Ulugbek", uz: "Ulug‘bek", "uz-Cyrl": "Улуғбек" },
  brideName: { ru: "Малика", en: "Malika", uz: "Malika", "uz-Cyrl": "Малика" },
  weddingDate: "2026-09-12",
  startTime: "16:00",
  heroPhoto:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
  intro: {
    ru: "С большой радостью приглашаем вас разделить с нами самый счастливый день нашей жизни.",
    en: "With great joy we invite you to share the happiest day of our lives.",
    uz: "Hayotimizdagi eng baxtli kunni biz bilan birga nishonlashga taklif qilamiz.",
    "uz-Cyrl": "Ҳаётимиздаги энг бахтли кунни биз билан бирга нишонлашга таклиф қиламиз.",
  },
  greeting: {
    ru: "Вы получили приглашение",
    en: "You have received an invitation",
    uz: "Sizga taklifnoma keldi",
    "uz-Cyrl": "Сизга таклифнома келди",
  },
  verse: {
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا",
    translation: {
      ru: "И из Его знамений — что Он создал для вас из вас самих пары.",
      en: "And of His signs is that He created for you mates from among yourselves.",
      uz: "Uning oyatlaridan biri — sizlar uchun o‘zingizdan juftlar yaratganidir.",
      "uz-Cyrl": "Унинг оятларидан бири — сизлар учун ўзингиздан жуфтлар яратганидир.",
    },
    source: { ru: "Сура Ар-Рум, 21", en: "Surah Ar-Rum, 21", uz: "Rum surasi, 21", "uz-Cyrl": "Рум сураси, 21" },
  },
  schedule: [
    {
      time: "16:00",
      icon: "rings",
      label: { ru: "Регистрация", en: "Ceremony", uz: "Nikoh marosimi", "uz-Cyrl": "Никоҳ маросими" },
    },
    {
      time: "17:00",
      icon: "cocktail",
      label: { ru: "Велком-коктейль", en: "Welcome drinks", uz: "Velkom kokteyl", "uz-Cyrl": "Велком коктейл" },
    },
    {
      time: "18:00",
      icon: "dinner",
      label: { ru: "Банкет", en: "Dinner", uz: "Ziyofat", "uz-Cyrl": "Зиёфат" },
    },
    {
      time: "22:00",
      icon: "fireworks",
      label: { ru: "Фейерверк", en: "Fireworks", uz: "Otashin", "uz-Cyrl": "Оташин" },
    },
  ],
  venue: {
    name: { ru: "Ресторан «Sezar»", en: "Sezar Restaurant", uz: "«Sezar» restorani", "uz-Cyrl": "«Sezar» ресторани" },
    address: {
      ru: "г. Ташкент, ул. Амира Темура, 15",
      en: "Tashkent, Amir Temur St. 15",
      uz: "Toshkent sh., Amir Temur ko‘chasi, 15",
      "uz-Cyrl": "Тошкент ш., Амир Темур кўчаси, 15",
    },
    lat: 41.311081,
    lng: 69.279737,
  },
  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80",
  ],
  backgroundMusic: undefined,
  unlockGate: true,
  rsvpEnabled: true,
};

/** Canonical editable-fields schema shared by the bundled templates. */
export const DEFAULT_FIELDS_SCHEMA: FieldsSchema = {
  groomName: {
    type: "text",
    label: "Groom name",
    required: true,
    localized: true,
    section: "couple",
  },
  brideName: {
    type: "text",
    label: "Bride name",
    required: true,
    localized: true,
    section: "couple",
  },
  weddingDate: {
    type: "date",
    label: "Wedding date",
    required: true,
    section: "event",
  },
  startTime: {
    type: "time",
    label: "Start time",
    required: true,
    section: "event",
  },
  heroPhoto: { type: "image", label: "Hero photo", section: "media" },
  intro: { type: "textarea", label: "Intro text", localized: true, section: "text" },
  greeting: {
    type: "text",
    label: "Gate greeting",
    localized: true,
    section: "text",
  },
  verse: {
    type: "object",
    label: "Verse (optional)",
    section: "verse",
    fields: {
      arabic: { type: "textarea", label: "Arabic" },
      translation: { type: "textarea", label: "Translation", localized: true },
      source: { type: "text", label: "Source", localized: true },
    },
  },
  schedule: {
    type: "list",
    label: "Schedule",
    section: "schedule",
    itemFields: {
      time: { type: "time", label: "Time" },
      label: { type: "text", label: "Label", localized: true },
      icon: { type: "iconKey", label: "Icon" },
    },
  },
  venue: {
    type: "object",
    label: "Venue",
    section: "venue",
    fields: {
      name: { type: "text", label: "Name", localized: true },
      address: { type: "text", label: "Address", localized: true },
      lat: { type: "number", label: "Latitude" },
      lng: { type: "number", label: "Longitude" },
    },
  },
  gallery: { type: "image[]", label: "Gallery", section: "media" },
  backgroundMusic: {
    type: "audio",
    label: "Background music",
    section: "media",
  },
  unlockGate: {
    type: "boolean",
    label: "Show unlock gate",
    section: "settings",
  },
  rsvpEnabled: {
    type: "boolean",
    label: "Enable RSVP",
    section: "settings",
  },
};

/** Beach / Islamic — full invitation with hero, schedule, gallery. */
export const STANDARD_FIELDS_SCHEMA: FieldsSchema = DEFAULT_FIELDS_SCHEMA;

/** Blue Envelope — no hero, schedule, or gallery; greeting drives the hero block. */
export const BLUE_ENVELOPE_FIELDS_SCHEMA: FieldsSchema = {
  groomName: DEFAULT_FIELDS_SCHEMA.groomName,
  brideName: DEFAULT_FIELDS_SCHEMA.brideName,
  weddingDate: DEFAULT_FIELDS_SCHEMA.weddingDate,
  startTime: DEFAULT_FIELDS_SCHEMA.startTime,
  intro: DEFAULT_FIELDS_SCHEMA.intro,
  greeting: DEFAULT_FIELDS_SCHEMA.greeting,
  verse: DEFAULT_FIELDS_SCHEMA.verse,
  venue: DEFAULT_FIELDS_SCHEMA.venue,
  backgroundMusic: DEFAULT_FIELDS_SCHEMA.backgroundMusic,
  unlockGate: DEFAULT_FIELDS_SCHEMA.unlockGate,
  rsvpEnabled: DEFAULT_FIELDS_SCHEMA.rsvpEnabled,
};

/** Gold elegance — hero, hosts, countdown, calendar, schedule, venue. */
export const GOLD_ELEGANCE_FIELDS_SCHEMA: FieldsSchema = {
  groomName: DEFAULT_FIELDS_SCHEMA.groomName,
  brideName: DEFAULT_FIELDS_SCHEMA.brideName,
  weddingDate: DEFAULT_FIELDS_SCHEMA.weddingDate,
  startTime: DEFAULT_FIELDS_SCHEMA.startTime,
  heroPhoto: DEFAULT_FIELDS_SCHEMA.heroPhoto,
  intro: DEFAULT_FIELDS_SCHEMA.intro,
  greeting: DEFAULT_FIELDS_SCHEMA.greeting,
  verse: DEFAULT_FIELDS_SCHEMA.verse,
  schedule: DEFAULT_FIELDS_SCHEMA.schedule,
  venue: DEFAULT_FIELDS_SCHEMA.venue,
  backgroundMusic: DEFAULT_FIELDS_SCHEMA.backgroundMusic,
  unlockGate: DEFAULT_FIELDS_SCHEMA.unlockGate,
  rsvpEnabled: DEFAULT_FIELDS_SCHEMA.rsvpEnabled,
};

/** Uzbek heritage style — envelope, heritage hero, calendar, venue, countdown. */
export const UZB_STYLE_FIELDS_SCHEMA: FieldsSchema = {
  groomName: DEFAULT_FIELDS_SCHEMA.groomName,
  brideName: DEFAULT_FIELDS_SCHEMA.brideName,
  weddingDate: DEFAULT_FIELDS_SCHEMA.weddingDate,
  startTime: DEFAULT_FIELDS_SCHEMA.startTime,
  intro: DEFAULT_FIELDS_SCHEMA.intro,
  greeting: DEFAULT_FIELDS_SCHEMA.greeting,
  venue: DEFAULT_FIELDS_SCHEMA.venue,
  backgroundMusic: DEFAULT_FIELDS_SCHEMA.backgroundMusic,
  unlockGate: DEFAULT_FIELDS_SCHEMA.unlockGate,
  rsvpEnabled: DEFAULT_FIELDS_SCHEMA.rsvpEnabled,
};

export const FIELDS_SCHEMA_BY_COMPONENT: Record<string, FieldsSchema> = {
  "beach-romantic": STANDARD_FIELDS_SCHEMA,
  "islamic-elegant": STANDARD_FIELDS_SCHEMA,
  "blue-envelope": BLUE_ENVELOPE_FIELDS_SCHEMA,
  "uzb-style": UZB_STYLE_FIELDS_SCHEMA,
  "gold-elegance": GOLD_ELEGANCE_FIELDS_SCHEMA,
};

export const BEACH_THEME: ThemeDefaults = {
  backgroundColor: "#fbf7f2",
  accentColor: "#c79a6b",
  fontPair: "playfair-vibes",
  mode: "light",
};

export const ISLAMIC_THEME: ThemeDefaults = {
  backgroundColor: "#0f2a26",
  accentColor: "#d4af7a",
  fontPair: "playfair-vibes",
  mode: "dark",
};

/** Sample data tailored to the blue-envelope template (original design). */
export const BLUE_ENVELOPE_SAMPLE: InvitationData = {
  locales: ["ru", "uz"],
  defaultLocale: "uz",
  groomName: {
    ru: "Жавлонбек",
    en: "Javlonbek",
    uz: "Javlonbek",
    "uz-Cyrl": "Жавлонбек",
  },
  brideName: {
    ru: "Мубина",
    en: "Mubina",
    uz: "Mubina",
    "uz-Cyrl": "Мубина",
  },
  weddingDate: "2026-07-22",
  startTime: "18:00",
  intro: {
    ru: "В этот прекрасный день мы соединяем наши сердца и начинаем новую историю — историю нашей любви.\n\nБудем счастливы разделить радость этого особенного момента вместе с вами.\n\nС любовью приглашаем вас на нашу свадьбу.",
    en: "",
    uz: "Hayotimizdagi eng baxtli kunlardan biri — nikoh to'yimizni siz bilan birga nishonlashni niyat qildik.\n\nSizni ushbu kechamizga samimiy taklif etamiz.\n\nQuvonchli kunimizda aziz mehmonimiz bo'lishingizni intizorlik bilan kutamiz.",
    "uz-Cyrl": "",
  },
  greeting: {
    ru: "Дорогие наши родные и близкие!",
    en: "",
    uz: "Aziz va qadrdon insonimiz!",
    "uz-Cyrl": "",
  },
  verse: {
    translation: {
      ru: "Аллах объединил их сердца любовью",
      en: "",
      uz: "Alloh ularni qalbini sevgi ila birlashtirdi",
      "uz-Cyrl": "",
    },
    source: {
      ru: "сура «Аль-Анфаль», аят 63",
      en: "",
      uz: "Anfol surasi, 63-oyat",
      "uz-Cyrl": "",
    },
  },
  schedule: [],
  venue: {
    name: {
      ru: "Дворец торжеств «Паризод»",
      en: "Parizod Palace",
      uz: "\"Parizod\" tantanalar saroyi",
      "uz-Cyrl": "\"Паризод\" тантаналар саройи",
    },
    address: {
      ru: "Адрес: Чуст район, улица Боғи Ерам",
      en: "Chust district, Bog'i Eram street",
      uz: "Manzil: Chust tumani, Bogʻi Eram ko'chasi",
      "uz-Cyrl": "Манзил: Чуст тумани, Боғи Ерам кўчаси",
    },
    lat: 41.009248,
    lng: 71.22514,
  },
  gallery: [],
  backgroundMusic: "/templates/blue-envelope/assets/skripka%20music.mp3",
  unlockGate: true,
  rsvpEnabled: true,
};

export const BLUE_ENVELOPE_THEME: ThemeDefaults = {
  backgroundColor: "#fdf8f0",
  accentColor: "#1c315e",
  fontPair: "playfair-vibes",
  mode: "light",
};

/** Sample data for the uzb-style heritage template. */
export const UZB_STYLE_SAMPLE: InvitationData = {
  locales: ["ru", "uz"],
  defaultLocale: "uz",
  groomName: {
    ru: "Темурбек",
    en: "Temurbek",
    uz: "Temurbek",
    "uz-Cyrl": "Темурбек",
  },
  brideName: {
    ru: "Нодирабегим",
    en: "Nodirabegim",
    uz: "Nodirabegim",
    "uz-Cyrl": "Нодирабегим",
  },
  weddingDate: "2027-04-05",
  startTime: "18:00",
  intro: {
    ru: "В этот прекрасный день мы соединяем наши сердца и начинаем новую историю — историю нашей любви.\n\nБудем счастливы разделить радость этого особенного момента вместе с вами.\n\nС любовью приглашаем вас на нашу свадьбу.",
    en: "",
    uz: "Hayotimizdagi eng baxtli kunlardan biri — nikoh to'yimizni siz bilan birga nishonlashni niyat qildik.\n\nSizni ushbu kechamizga samimiy taklif etamiz.\n\nQuvonchli kunimizda aziz mehmonimiz bo'lishingizni intizorlik bilan kutamiz.",
    "uz-Cyrl": "",
  },
  greeting: {
    ru: "Дорогие наши родные и близкие!",
    en: "",
    uz: "Aziz va qadrdon insonimiz!",
    "uz-Cyrl": "",
  },
  schedule: [],
  venue: {
    name: {
      ru: "ресторан ЯККА САРОЙ",
      en: "Yakka Saroy Restaurant",
      uz: "Yakka Saroy restorani",
      "uz-Cyrl": "Yakka Saroy restorani",
    },
    address: {
      ru: "город Карши\nОриентир: дорога Карши-Бешкент, Каршинский филиал ТАТУ.",
      en: "Qarshi city",
      uz: "Qarshi shaxri\nMo'ljal: Qarshi-Beshkent yo'li, TATU Qarshi filiali.",
      "uz-Cyrl": "",
    },
    lat: 38.824851,
    lng: 65.715197,
  },
  gallery: [],
  backgroundMusic: "/templates/uzb-style/assets/uzbek%20music.mp3",
  unlockGate: true,
  rsvpEnabled: true,
};

export const UZB_STYLE_THEME: ThemeDefaults = {
  backgroundColor: "#fffdf6",
  accentColor: "#c21612",
  fontPair: "playfair-vibes",
  mode: "light",
};

/** Sample data inspired by the Berdibek & Sabina gold wedding design. */
export const GOLD_ELEGANCE_SAMPLE: InvitationData = {
  locales: ["ru", "uz", "uz-Cyrl"],
  defaultLocale: "ru",
  groomName: {
    ru: "Бердібек",
    uz: "Berdibek",
    "uz-Cyrl": "Бердібек",
    en: "Berdibek",
  },
  brideName: {
    ru: "Сабина",
    uz: "Sabina",
    "uz-Cyrl": "Сабина",
    en: "Sabina",
  },
  weddingDate: "2026-06-12",
  startTime: "15:00",
  heroPhoto: "/templates/gold-elegance/assets/wedding-hero.jpg",
  greeting: {
    ru: "Құрметті қонақтар!",
    uz: "Hurmatli mehmonlar!",
    "uz-Cyrl": "Құрметті қонақтар!",
    en: "Dear guests!",
  },
  intro: {
    ru: "Балаларымыздың үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!",
    uz: "Farzandlarimizning to'yiga bag'ishlangan tantanali dasturxonga qadrli mehmon bo'lishingizni taklif qilamiz!",
    "uz-Cyrl":
      "Балаларымыздың үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!",
    en: "We invite you to be honored guests at the festive table for our children's wedding!",
  },
  verse: {
    translation: {
      ru: "Бақытбек & Айша",
      uz: "Baxytbek va Aysha",
      "uz-Cyrl": "Бақытбек & Айша",
      en: "Bakytbek & Aisha",
    },
    source: {
      ru: "Той иелері",
      uz: "To'y egalari",
      "uz-Cyrl": "Той иелері",
      en: "Wedding hosts",
    },
  },
  schedule: [
    {
      time: "15:00",
      icon: "rings",
      label: {
        ru: "Беташар",
        uz: "Betashar",
        "uz-Cyrl": "Беташар",
        en: "Betashar",
      },
    },
    {
      time: "17:00",
      icon: "dinner",
      label: {
        ru: "Той",
        uz: "To'y",
        "uz-Cyrl": "Той",
        en: "Wedding",
      },
    },
  ],
  venue: {
    name: {
      ru: "Grand Hall мейрамханасы",
      uz: "Grand Hall restorani",
      "uz-Cyrl": "Grand Hall мейрамханасы",
      en: "Grand Hall Restaurant",
    },
    address: {
      ru: "Теміртау қаласы\nПроспект Металлургов, 65/1",
      uz: "Temirtau shahri\nMetallurgov prospekti, 65/1",
      "uz-Cyrl": "Теміртау қаласы\nПроспект Металлургов, 65/1",
      en: "Temirtau\n65/1 Metallurgov Ave.",
    },
    lat: 50.038853,
    lng: 72.964122,
  },
  gallery: [],
  backgroundMusic: "/templates/gold-elegance/assets/music.mp3",
  unlockGate: false,
  rsvpEnabled: true,
};

export const GOLD_ELEGANCE_THEME: ThemeDefaults = {
  backgroundColor: "#fafafa",
  accentColor: "#c9a227",
  fontPair: "playfair-vibes",
  mode: "light",
};

export const SAMPLE_DATA_BY_COMPONENT: Record<string, InvitationData> = {
  "beach-romantic": SAMPLE_DATA,
  "islamic-elegant": SAMPLE_DATA,
  "blue-envelope": BLUE_ENVELOPE_SAMPLE,
  "uzb-style": UZB_STYLE_SAMPLE,
  "gold-elegance": GOLD_ELEGANCE_SAMPLE,
};

export const THEME_BY_COMPONENT: Record<string, ThemeDefaults> = {
  "beach-romantic": BEACH_THEME,
  "islamic-elegant": ISLAMIC_THEME,
  "blue-envelope": BLUE_ENVELOPE_THEME,
  "uzb-style": UZB_STYLE_THEME,
  "gold-elegance": GOLD_ELEGANCE_THEME,
};

export const THEME_PRESETS: Record<string, ThemeDefaults> = {
  beach: BEACH_THEME,
  islamic: ISLAMIC_THEME,
  "blue-envelope": BLUE_ENVELOPE_THEME,
  "uzb-style": UZB_STYLE_THEME,
  "gold-elegance": GOLD_ELEGANCE_THEME,
};

export function getFieldsSchemaForComponent(componentKey: string): FieldsSchema {
  return FIELDS_SCHEMA_BY_COMPONENT[componentKey] ?? DEFAULT_FIELDS_SCHEMA;
}

export function getThemeForComponent(componentKey: string): ThemeDefaults {
  return { ...(THEME_BY_COMPONENT[componentKey] ?? BEACH_THEME) };
}

export const TEMPLATE_CATALOG_DEFAULTS: Record<
  string,
  { thumbnail: string; previewImages: string[] }
> = {
  "beach-romantic": {
    thumbnail:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85",
    previewImages: SAMPLE_DATA.gallery,
  },
  "islamic-elegant": {
    thumbnail:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85",
    previewImages: SAMPLE_DATA.gallery,
  },
  "blue-envelope": {
    thumbnail: "/templates/blue-envelope/assets/blue%20ornament%20.png",
    previewImages: [
      "/templates/blue-envelope/assets/blue%20ornament%20.png",
      "/templates/blue-envelope/assets/rings%20blue.png",
    ],
  },
  "uzb-style": {
    thumbnail: "/templates/uzb-style/assets/couple.png",
    previewImages: [
      "/templates/uzb-style/assets/couple.png",
      "/templates/uzb-style/assets/border%20ornament.png",
    ],
  },
  "gold-elegance": {
    thumbnail: "/templates/gold-elegance/assets/wedding-hero.jpg",
    previewImages: [
      "/templates/gold-elegance/assets/wedding-hero.jpg",
      "/templates/gold-elegance/assets/hands.png",
    ],
  },
};

export function getCatalogDefaultsForComponent(componentKey: string) {
  return TEMPLATE_CATALOG_DEFAULTS[componentKey];
}

export function getSampleDataForComponent(componentKey: string): InvitationData {
  const source = SAMPLE_DATA_BY_COMPONENT[componentKey] ?? SAMPLE_DATA;
  return JSON.parse(JSON.stringify(source)) as InvitationData;
}
