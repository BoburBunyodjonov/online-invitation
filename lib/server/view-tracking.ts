import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const VIEW_COOKIE_PREFIX = "vt_";
const VIEW_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 h

const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|preview|headless/i;

export function isBotUserAgent(ua: string | null): boolean {
  if (!ua) return false;
  return BOT_UA.test(ua);
}

export function hasAdminSessionCookie(
  cookieHeader: string | null,
): boolean {
  if (!cookieHeader) return false;
  return (
    cookieHeader.includes("authjs.session-token=") ||
    cookieHeader.includes("__Secure-authjs.session-token=")
  );
}

function viewCookieName(kind: "invitation" | "template", slug: string): string {
  return `${VIEW_COOKIE_PREFIX}${kind}_${slug.replace(/[^a-z0-9-]/gi, "_")}`;
}

export function hasRecentViewCookie(
  cookieHeader: string | null,
  kind: "invitation" | "template",
  slug: string,
): boolean {
  if (!cookieHeader) return false;
  const name = viewCookieName(kind, slug);
  return cookieHeader.includes(`${name}=1`);
}

export type ViewRequestContext = {
  userAgent: string | null;
  cookieHeader: string | null;
  referer: string | null;
};

export function getViewRequestContext(req: Request): ViewRequestContext {
  return {
    userAgent: req.headers.get("user-agent"),
    cookieHeader: req.headers.get("cookie"),
    referer: req.headers.get("referer"),
  };
}

/** Returns false when the view should NOT be counted. */
export function shouldCountView(
  ctx: ViewRequestContext,
  kind: "invitation" | "template",
  slug: string,
): boolean {
  if (hasAdminSessionCookie(ctx.cookieHeader)) return false;
  if (isBotUserAgent(ctx.userAgent)) return false;
  if (ctx.referer?.includes("/admin")) return false;
  if (hasRecentViewCookie(ctx.cookieHeader, kind, slug)) return false;
  return true;
}

export function attachViewDedupCookie(
  response: NextResponse,
  kind: "invitation" | "template",
  slug: string,
): void {
  response.cookies.set(viewCookieName(kind, slug), "1", {
    maxAge: VIEW_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

/** Server-component helper: skip beacon when admin is previewing. */
export async function shouldRenderViewBeacon(): Promise<boolean> {
  const jar = await cookies();
  return !(
    jar.has("authjs.session-token") ||
    jar.has("__Secure-authjs.session-token")
  );
}
