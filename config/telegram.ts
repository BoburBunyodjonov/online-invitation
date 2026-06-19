import type { Locale } from "@/config/locales";
import type { CurrencyCode } from "@/lib/format-price";
import { formatTemplatePrice } from "@/lib/format-price";

/** Admin Telegram username (NOT a bot). Visitors DM this account to order. */
export const TELEGRAM_ADMIN_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_USERNAME ?? "online_invitation_admin";

function priceLine(
  locale: Locale,
  amount: number,
  currency: CurrencyCode,
): string {
  const formatted = formatTemplatePrice(amount, currency, locale);
  if (!formatted) return "";

  const labels: Record<Locale, string> = {
    uz: `Narx: ${formatted}`,
    ru: `Цена: ${formatted}`,
    en: `Price: ${formatted}`,
    "uz-Cyrl": `Нарх: ${formatted}`,
  };
  return labels[locale] ?? labels.uz;
}

const ORDER_MESSAGES: Record<
  Locale,
  (name: string, slug: string, amount: number, currency: CurrencyCode) => string
> = {
  uz: (name, slug, amount, currency) => {
    const price = priceLine("uz", amount, currency);
    return `Salom! Men "${name}" shablonini buyurtma qilmoqchiman.\nShablon: ${slug}${price ? `\n${price}` : ""}`;
  },
  ru: (name, slug, amount, currency) => {
    const price = priceLine("ru", amount, currency);
    return `Здравствуйте! Хочу заказать шаблон «${name}».\nШаблон: ${slug}${price ? `\n${price}` : ""}`;
  },
  en: (name, slug, amount, currency) => {
    const price = priceLine("en", amount, currency);
    return `Hello! I'd like to order the "${name}" template.\nTemplate: ${slug}${price ? `\n${price}` : ""}`;
  },
  "uz-Cyrl": (name, slug, amount, currency) => {
    const price = priceLine("uz-Cyrl", amount, currency);
    return `Салом! Мен "${name}" шаблонини буюртма қилмоқчиман.\nШаблон: ${slug}${price ? `\n${price}` : ""}`;
  },
};

const GENERAL_ORDER_MESSAGES: Record<Locale, string> = {
  uz: "Salom! To'y taklifnomasini buyurtma qilmoqchiman.",
  ru: "Здравствуйте! Хочу заказать свадебное приглашение.",
  en: "Hello! I'd like to order a wedding invitation.",
  "uz-Cyrl": "Салом! Тўй таклифномасини буюртма қилмоқчиман.",
};

/** Deep link to message the admin without a specific template selected. */
export function getTelegramContactUrl(
  locale: Locale,
  telegramUsername = TELEGRAM_ADMIN_USERNAME,
): string {
  const username = telegramUsername.replace(/^@/, "");
  const text = GENERAL_ORDER_MESSAGES[locale] ?? GENERAL_ORDER_MESSAGES.uz;
  return `https://t.me/${username}?text=${encodeURIComponent(text)}`;
}

/** Deep link to message the admin on Telegram with a pre-filled order text. */
export function getTelegramOrderUrl(
  slug: string,
  name: string,
  locale: Locale,
  priceAmount = 0,
  currency: CurrencyCode = "UZS",
  telegramUsername = TELEGRAM_ADMIN_USERNAME,
): string {
  const username = telegramUsername.replace(/^@/, "");
  const text = (ORDER_MESSAGES[locale] ?? ORDER_MESSAGES.uz)(
    name,
    slug,
    priceAmount,
    currency,
  );
  return `https://t.me/${username}?text=${encodeURIComponent(text)}`;
}
