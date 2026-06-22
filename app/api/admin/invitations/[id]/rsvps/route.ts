import { NextResponse } from "next/server";
import { getRsvpResponsesByInvitationId } from "@/lib/server/rsvp";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const result = await getRsvpResponsesByInvitationId(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
