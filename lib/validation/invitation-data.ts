import { z } from "zod";
import { LOCALES } from "@/config/locales";

/**
 * Canonical shape of an invitation's `data` JSON. Every template component
 * consumes this typed object. Localized fields are objects keyed by locale so
 * the in-page language switcher can swap content without refetching.
 */

export const localizedStringSchema = z.record(
  z.enum(LOCALES),
  z.string(),
);

export const scheduleItemSchema = z.object({
  time: z.string(), // "16:00"
  label: localizedStringSchema,
  icon: z.string(), // iconKey, see templates/shared/icon-map.ts
});

export const venueSchema = z.object({
  name: localizedStringSchema,
  address: localizedStringSchema,
  lat: z.number(),
  lng: z.number(),
});

export const verseSchema = z.object({
  arabic: z.string().optional(),
  translation: localizedStringSchema.optional(),
  source: localizedStringSchema.optional(),
});

export const invitationDataSchema = z.object({
  locales: z.array(z.enum(LOCALES)).min(1),
  defaultLocale: z.enum(LOCALES),
  groomName: localizedStringSchema,
  brideName: localizedStringSchema,
  weddingDate: z.string(), // ISO date "2026-09-12"
  startTime: z.string(), // "16:00"
  heroPhoto: z.string().optional(),
  intro: localizedStringSchema.optional(),
  greeting: localizedStringSchema.optional(),
  verse: verseSchema.optional(),
  schedule: z.array(scheduleItemSchema).default([]),
  venue: venueSchema,
  gallery: z.array(z.string()).default([]),
  backgroundMusic: z.string().optional(),
  unlockGate: z.boolean().default(true),
  rsvpEnabled: z.boolean().default(true),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;
export type Venue = z.infer<typeof venueSchema>;
export type Verse = z.infer<typeof verseSchema>;
export type InvitationData = z.infer<typeof invitationDataSchema>;
