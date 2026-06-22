import { NextResponse } from "next/server";
import {
  getRsvpResponsesByInvitationId,
  rsvpResponsesToCsv,
} from "@/lib/server/rsvp";
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
    const { responses } = await getRsvpResponsesByInvitationId(id);
    const csv = rsvpResponsesToCsv(responses);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rsvp-${id.slice(0, 8)}.csv"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
