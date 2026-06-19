import type { InvitationData } from "@/lib/validation/invitation-data";
import type { FieldsSchema } from "@/lib/validation/field-schema";
import type { ThemeDefaults } from "@/lib/validation/template";
import type { OrderStatus } from "@/lib/generated/prisma";

/**
 * JSON-serializable DTOs returned by the API (Dates as ISO strings, typed JSON).
 * Used by client components + TanStack Query hooks.
 */

export interface TemplateDTO {
  id: string;
  slug: string;
  name: string;
  category: string;
  thumbnail: string;
  previewImages: string[];
  componentKey: string;
  fieldsSchema: FieldsSchema;
  themeDefaults: ThemeDefaults;
  priceAmount: number;
  currency: string;
  isPublished: boolean;
  badgeNew: boolean;
  badgePopular: boolean;
  createdAt: string;
}

export interface InvitationDTO {
  id: string;
  slug: string;
  orderId: string;
  templateId: string;
  data: InvitationData;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDTO {
  id: string;
  templateId: string;
  template?: TemplateDTO;
  telegramChatId: string;
  telegramUsername: string | null;
  contactPhone: string | null;
  priceAmount: number | null;
  currency: string | null;
  paymentStatus: "UNPAID" | "PAID" | "WAIVED";
  status: OrderStatus;
  invitation?: InvitationDTO | null;
  createdAt: string;
}
