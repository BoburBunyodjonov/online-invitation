import { NextResponse } from "next/server";
import { recordInvitationView } from "@/lib/server/invitations";
import { handleApiError } from "@/lib/server/api-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ slug: string }> };

async function countView(ctx: RouteCtx) {
  const { slug } = await ctx.params;
  await recordInvitationView(slug);
}

export async function GET(_req: Request, ctx: RouteCtx) {
  try {
    await countView(ctx);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(_req: Request, ctx: RouteCtx) {
  try {
    await countView(ctx);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
