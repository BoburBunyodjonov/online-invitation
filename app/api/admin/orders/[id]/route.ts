import { NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/lib/server/orders";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";
import { orderUpdateSchema } from "@/lib/validation/order";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const order = await getOrderById(id);
    return NextResponse.json(order);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const input = orderUpdateSchema.parse(body);
    const order = await updateOrder(id, input);
    return NextResponse.json(order);
  } catch (error) {
    return handleApiError(error);
  }
}
