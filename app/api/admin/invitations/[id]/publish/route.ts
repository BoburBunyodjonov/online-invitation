import { NextResponse } from "next/server";
import { publishInvitation } from "@/lib/server/invitations";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";
import { prisma } from "@/lib/server/db";
import { notifyCustomerPublished } from "@/lib/server/telegram";
import type { InvitationData } from "@/lib/validation/invitation-data";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const invitation = await publishInvitation(id);

    // Best-effort Telegram notification to the customer with their final link.
    try {
      const order = await prisma.order.findUnique({
        where: { id: invitation.orderId },
      });
      if (order?.telegramChatId) {
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        const data = invitation.data as unknown as InvitationData;
        const names = `${data.groomName?.uz ?? ""} & ${data.brideName?.uz ?? ""}`;
        await notifyCustomerPublished(
          order.telegramChatId,
          `${siteUrl}/i/${invitation.slug}`,
          names,
        );
      }
    } catch (e) {
      console.error("[publish] telegram notify failed", e);
    }

    return NextResponse.json(invitation);
  } catch (error) {
    return handleApiError(error);
  }
}
