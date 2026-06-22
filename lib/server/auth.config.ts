import type { NextAuthConfig } from "next-auth";

/** Edge-safe Auth.js config (no Prisma / bcrypt). Used by middleware. */
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        return !!auth;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "admin";
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) ?? "admin";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
