import { NextResponse } from "next/server";
import { getPublishedInvitationBySlug } from "@/lib/server/invitations";
import { handleApiError } from "@/lib/server/api-error";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const result = await getPublishedInvitationBySlug(slug);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
