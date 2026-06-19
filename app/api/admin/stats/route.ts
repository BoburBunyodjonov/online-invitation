import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/server/stats";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
