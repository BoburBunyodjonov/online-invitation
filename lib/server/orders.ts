import { prisma } from "./db";
import { notFound } from "./api-error";
import type { OrderUpdate } from "@/lib/validation/order";
import type { OrderStatus } from "@/lib/generated/prisma";

export async function listOrders(status?: OrderStatus) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { template: true, invitation: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { template: true, invitation: true },
  });
  if (!order) throw notFound("Order not found");
  return order;
}

export async function createOrder(params: {
  templateId: string;
  telegramChatId: string;
  telegramUsername?: string;
  contactPhone?: string;
  priceAmount?: number;
  currency?: string;
}) {
  return prisma.order.create({
    data: {
      templateId: params.templateId,
      telegramChatId: params.telegramChatId,
      telegramUsername: params.telegramUsername,
      contactPhone: params.contactPhone,
      priceAmount: params.priceAmount,
      currency: params.currency,
    },
    include: { template: true, invitation: true },
  });
}

/** Admin panel: mijoz shablon tanlab murojaat qilganda buyurtma yaratish. */
export async function createOrderFromAdmin(input: {
  templateId: string;
  customerName: string;
  telegramUsername?: string;
  telegramChatId?: string;
  contactPhone?: string;
}) {
  const chatId =
    input.telegramChatId?.trim() ||
    `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const username =
    input.telegramUsername?.replace(/^@/, "").trim() ||
    input.customerName.trim();

  const template = await prisma.template.findUnique({
    where: { id: input.templateId },
  });
  if (!template) throw notFound("Template not found");

  return createOrder({
    templateId: input.templateId,
    telegramChatId: chatId,
    telegramUsername: username,
    contactPhone: input.contactPhone?.trim() || undefined,
    priceAmount: template.priceAmount,
    currency: template.currency,
  });
}

export async function updateOrder(id: string, input: OrderUpdate) {
  await getOrderById(id);
  return prisma.order.update({
    where: { id },
    data: input,
    include: { template: true, invitation: true },
  });
}
