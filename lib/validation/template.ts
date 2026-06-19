import { z } from "zod";
import { fieldsSchemaSchema } from "./field-schema";
import { currencySchema } from "@/lib/format-price";

export const themeDefaultsSchema = z.object({
  backgroundColor: z.string(),
  accentColor: z.string(),
  fontPair: z.string(),
  mode: z.enum(["light", "dark"]),
});

export type ThemeDefaults = z.infer<typeof themeDefaultsSchema>;

export const templateInputSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and dashes"),
  name: z.string().min(1),
  category: z.string().min(1),
  thumbnail: z.string().url().or(z.string().min(1)),
  previewImages: z.array(z.string()).default([]),
  componentKey: z.string().min(1),
  fieldsSchema: fieldsSchemaSchema,
  themeDefaults: themeDefaultsSchema,
  priceAmount: z.number().int().min(0).default(0),
  currency: currencySchema.default("UZS"),
  isPublished: z.boolean().default(false),
  badgeNew: z.boolean().default(false),
  badgePopular: z.boolean().default(false),
});

export type TemplateInput = z.infer<typeof templateInputSchema>;

export const templateUpdateSchema = templateInputSchema.partial();
export type TemplateUpdate = z.infer<typeof templateUpdateSchema>;
