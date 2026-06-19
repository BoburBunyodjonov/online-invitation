import { NextResponse } from "next/server";
import { createInvitation } from "@/lib/server/invitations";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";
import { invitationCreateSchema } from "@/lib/validation/invitation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const input = invitationCreateSchema.parse(body);
    const invitation = await createInvitation(input);
    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
