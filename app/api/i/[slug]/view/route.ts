import { NextResponse } from "next/server";
import { recordInvitationView } from "@/lib/server/invitations";
import { handleApiError } from "@/lib/server/api-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    await recordInvitationView(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
