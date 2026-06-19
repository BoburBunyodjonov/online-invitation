import { NextResponse } from "next/server";
import { updateInvitation } from "@/lib/server/invitations";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";
import { invitationUpdateSchema } from "@/lib/validation/invitation";

export const runtime = "nodejs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const input = invitationUpdateSchema.parse(body);
    const invitation = await updateInvitation(id, input);
    return NextResponse.json(invitation);
  } catch (error) {
    return handleApiError(error);
  }
}
