import NextAuth from "next-auth";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/server/auth.config";
import { routing } from "./i18n/routing";

const { auth } = NextAuth(authConfig);
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

/** Validates JWT session (not just cookie presence) for admin routes. */
export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!request.auth) {
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
});

export const config = {
  // uz-cyrl must come before uz so `/uz-cyrl` is not parsed as locale `uz`
  matcher: ["/", "/(ru|en|uz-cyrl|uz)/:path*", "/admin/:path*"],
};
