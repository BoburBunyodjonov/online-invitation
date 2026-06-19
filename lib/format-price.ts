import { z } from "zod";

export const CURRENCIES = ["UZS", "USD", "EUR"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const currencySchema = z.enum(CURRENCIES);

export const PAYMENT_STATUSES = ["UNPAID", "PAID", "WAIVED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);

/**
 * Formats a template price for display. Amount is in major currency units.
 */
export function formatTemplatePrice(
  amount: number,
  currency: CurrencyCode,
  locale = "uz",
): string {
  if (amount <= 0) return "";

  switch (currency) {
    case "UZS": {
      const loc = locale.startsWith("ru") ? "ru-RU" : "uz-UZ";
      return `${amount.toLocaleString(loc)} soʻm`;
    }
    case "USD":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount);
    case "EUR":
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(amount);
    default:
      return `${amount} ${currency}`;
  }
}

export function formatPriceFrom(
  amount: number,
  currency: CurrencyCode,
  fromLabel: string,
  locale = "uz",
): string {
  const price = formatTemplatePrice(amount, currency, locale);
  if (!price) return fromLabel;
  return `${fromLabel} ${price}`;
}
