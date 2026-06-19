import { NextResponse } from "next/server";
import {
  getPublishedInvitationBySlug,
  incrementViews,
} from "@/lib/server/invitations";
import { handleApiError } from "@/lib/server/api-error";

export const runtime = "nodejs";
/** Always run — view counts must not be served from cache. */
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { invitation } = await getPublishedInvitationBySlug(slug);
    incrementViews(invitation.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
