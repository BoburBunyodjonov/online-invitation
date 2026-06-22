import { z } from "zod";

export const RSVP_STATUSES = ["ATTENDING", "NOT_ATTENDING", "MAYBE"] as const;

export const rsvpCreateSchema = z.object({
  guestName: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  status: z.enum(RSVP_STATUSES),
  guestCount: z.number().int().min(0).max(20).default(1),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

export type RsvpCreate = z.infer<typeof rsvpCreateSchema>;

export type RsvpSummary = {
  total: number;
  attending: number;
  notAttending: number;
  maybe: number;
  totalGuests: number;
};
