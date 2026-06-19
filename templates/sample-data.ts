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
};

/** Canonical editable-fields schema shared by the bundled templates. */
export const DEFAULT_FIELDS_SCHEMA: FieldsSchema = {
  groomName: { type: "text", label: "Groom name", required: true, localized: true },
  brideName: { type: "text", label: "Bride name", required: true, localized: true },
  weddingDate: { type: "date", label: "Wedding date", required: true },
  startTime: { type: "time", label: "Start time", required: true },
  heroPhoto: { type: "image", label: "Hero photo" },
  intro: { type: "textarea", label: "Intro text", localized: true },
  greeting: { type: "text", label: "Gate greeting", localized: true },
  verse: {
    type: "object",
    label: "Verse (optional)",
    fields: {
      arabic: { type: "textarea", label: "Arabic" },
      translation: { type: "textarea", label: "Translation", localized: true },
      source: { type: "text", label: "Source", localized: true },
    },
  },
  schedule: {
    type: "list",
    label: "Schedule",
    itemFields: {
      time: { type: "time", label: "Time" },
      label: { type: "text", label: "Label", localized: true },
      icon: { type: "iconKey", label: "Icon" },
    },
  },
  venue: {
    type: "object",
    label: "Venue",
    fields: {
      name: { type: "text", label: "Name", localized: true },
      address: { type: "text", label: "Address", localized: true },
      lat: { type: "number", label: "Latitude" },
      lng: { type: "number", label: "Longitude" },
    },
  },
  gallery: { type: "image[]", label: "Gallery" },
  backgroundMusic: { type: "audio", label: "Background music" },
  unlockGate: { type: "boolean", label: "Show unlock gate" },
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
};

export const BLUE_ENVELOPE_THEME: ThemeDefaults = {
  backgroundColor: "#fdf8f0",
  accentColor: "#1c315e",
  fontPair: "playfair-vibes",
  mode: "light",
};
