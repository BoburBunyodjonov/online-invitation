import { z } from "zod";

const localeTextsSchema = z.object({
  orderCtaTitle: z.string().min(1),
  orderCtaSubtitle: z.string().min(1),
  orderCtaTelegram: z.string().min(1),
  contactTitle: z.string().min(1),
  contactSubtitle: z.string().min(1),
  heroBadge: z.string().min(1),
  heroHeadline: z.string().min(1),
  heroHeadlineAccent: z.string().min(1),
  heroDescription: z.string().min(1),
  heroCtaPrimary: z.string().min(1),
  heroCtaSecondary: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  seoKeywords: z.string().min(1),
  seoOgTitle: z.string().min(1),
  seoOgDescription: z.string().min(1),
});

const textsSchema = z.object({
  uz: localeTextsSchema,
  ru: localeTextsSchema,
  en: localeTextsSchema,
  "uz-Cyrl": localeTextsSchema,
});

export const siteSettingsInputSchema = z.object({
  contactPhone: z.string().min(5),
  telegramUsername: z
    .string()
    .min(1)
    .transform((v) => v.replace(/^@/, "")),
  texts: textsSchema,
});

export type SiteSettingsInput = z.infer<typeof siteSettingsInputSchema>;
