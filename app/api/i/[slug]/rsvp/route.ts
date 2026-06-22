import { NextResponse } from "next/server";
import { createRsvpResponse } from "@/lib/server/rsvp";
import { handleApiError } from "@/lib/server/api-error";
import { rsvpCreateSchema } from "@/lib/validation/rsvp";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/server/rate-limit";
import type { InvitationData } from "@/lib/validation/invitation-data";
import { getPublishedInvitationBySlug } from "@/lib/server/invitations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ slug: string }> };

export async function POST(req: Request, ctx: RouteCtx) {
  try {
    const { slug } = await ctx.params;
    const ip = clientIp(req);
    const rl = rateLimit(`rsvp:${slug}:${ip}`, 5, 60 * 60_000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfterSec);

    const { invitation } = await getPublishedInvitationBySlug(slug);
    const data = invitation.data as unknown as InvitationData;
    if (data.rsvpEnabled === false) {
      return NextResponse.json({ error: "RSVP is disabled" }, { status: 403 });
    }

    const body = await req.json();
    const input = rsvpCreateSchema.parse(body);
    const response = await createRsvpResponse(slug, input);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return handleApiError(error);
  }
}
