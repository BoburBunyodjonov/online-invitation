import { NextResponse } from "next/server";
import { recordInvitationView } from "@/lib/server/invitations";
import { handleApiError } from "@/lib/server/api-error";
import {
  attachViewDedupCookie,
} from "@/lib/server/view-tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ slug: string }> };

async function countView(req: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  return recordInvitationView(slug, req);
}

export async function GET(req: Request, ctx: RouteCtx) {
  try {
    const { counted } = await countView(req, ctx);
    const res = new NextResponse(null, { status: 204 });
    if (counted) {
      const { slug } = await ctx.params;
      attachViewDedupCookie(res, "invitation", slug);
    }
    return res;
  } catch (error) {
    if (error instanceof Response) return error;
    return handleApiError(error);
  }
}

export async function POST(req: Request, ctx: RouteCtx) {
  try {
    const { counted } = await countView(req, ctx);
    const res = NextResponse.json({ ok: true, counted });
    if (counted) {
      const { slug } = await ctx.params;
      attachViewDedupCookie(res, "invitation", slug);
    }
    return res;
  } catch (error) {
    if (error instanceof Response) return error;
    return handleApiError(error);
  }
}
