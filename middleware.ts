import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const LOCALELESS_PREFIXES = [
  "/admin",
  "/api",
  "/i/",
  "/templates/",
  "/_next",
  "/favicon",
  "/manifest",
  "/robots",
  "/sitemap",
];

function isLocalelessPath(pathname: string) {
  if (LOCALELESS_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (pathname.includes(".") && !pathname.endsWith("/")) return true;
  return false;
}

function invitationSlugFromPath(pathname: string): string | null {
  if (!pathname.startsWith("/i/")) return null;
  const segments = pathname.slice(3).split("/").filter(Boolean);
  if (segments.length !== 1) return null;
  const slug = segments[0];
  if (!slug || slug.includes(".")) return null;
  return slug;
}

function shouldSkipViewCount(request: NextRequest): boolean {
  if (request.method !== "GET") return true;
  if (request.headers.get("purpose") === "prefetch") return true;
  if (request.headers.get("x-middleware-prefetch")) return true;
  return false;
}

function recordInvitationView(request: NextRequest, slug: string) {
  const url = new URL(`/api/i/${encodeURIComponent(slug)}/view`, request.url);
  return fetch(url, { method: "POST" }).catch((error) => {
    console.error("[middleware] view increment failed", error);
  });
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (!shouldSkipViewCount(request)) {
    const slug = invitationSlugFromPath(pathname);
    if (slug) {
      event.waitUntil(recordInvitationView(request, slug));
    }
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasSession =
      request.cookies.has("authjs.session-token") ||
      request.cookies.has("__Secure-authjs.session-token");

    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isLocalelessPath(pathname)) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // uz-cyrl must come before uz so `/uz-cyrl` is not parsed as locale `uz`
  matcher: ["/", "/(ru|en|uz-cyrl|uz)/:path*", "/admin/:path*", "/i/:path*"],
};
