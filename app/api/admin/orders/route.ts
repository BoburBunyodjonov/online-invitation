import { NextResponse } from "next/server";
import { listOrders, createOrderFromAdmin } from "@/lib/server/orders";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";
import { ORDER_STATUSES, orderCreateSchema } from "@/lib/validation/order";
import type { OrderStatus } from "@/lib/generated/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");
    const status =
      statusParam && (ORDER_STATUSES as readonly string[]).includes(statusParam)
        ? (statusParam as OrderStatus)
        : undefined;
    const orders = await listOrders(status);
    return NextResponse.json(orders);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const input = orderCreateSchema.parse(body);
    const order = await createOrderFromAdmin(input);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
