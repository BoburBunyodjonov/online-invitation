import { z } from "zod";
import { paymentStatusSchema } from "@/lib/format-price";

export const ORDER_STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
] as const;

export const orderCreateSchema = z.object({
  templateId: z.string().min(1, "Shablonni tanlang"),
  customerName: z.string().min(1, "Mijoz ismi kerak"),
  telegramUsername: z.string().optional(),
  telegramChatId: z.string().optional(),
  contactPhone: z.string().optional(),
});

export type OrderCreate = z.infer<typeof orderCreateSchema>;

export const orderUpdateSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  contactPhone: z.string().optional(),
  telegramUsername: z.string().optional(),
  paymentStatus: paymentStatusSchema.optional(),
});

export type OrderUpdate = z.infer<typeof orderUpdateSchema>;
