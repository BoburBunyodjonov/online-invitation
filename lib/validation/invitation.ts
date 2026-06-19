import { z } from "zod";
import { invitationDataSchema } from "./invitation-data";

export const invitationCreateSchema = z.object({
  orderId: z.string().min(1),
  templateId: z.string().min(1),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  data: invitationDataSchema,
  isPublished: z.boolean().default(false),
});

export type InvitationCreate = z.infer<typeof invitationCreateSchema>;

export const invitationUpdateSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  data: invitationDataSchema.optional(),
  isPublished: z.boolean().optional(),
});

export type InvitationUpdate = z.infer<typeof invitationUpdateSchema>;
