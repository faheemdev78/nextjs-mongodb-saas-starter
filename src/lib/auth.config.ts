import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { NextResponse } from "next/server";

import type { UserRole } from "@/lib/roles";

export function githubProvider() {
  const clientId = process.env.AUTH_GITHUB_ID;
  const clientSecret = process.env.AUTH_GITHUB_SECRET;
  if (!clientId || !clientSecret) return null;
  return GitHub({ clientId, clientSecret });
}

export function isGithubEnabled(): boolean {
  return githubProvider() !== null;
}

/**
 * Edge-safe Auth.js config used by `src/proxy.ts`.
 * The Node.js config in `auth.ts` replaces the credentials `authorize` function.
 */
const github = githubProvider();

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    ...(github ? [github] : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: () => null,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);
      const onAuthPage = pathname === "/login" || pathname === "/register";

      if (pathname.startsWith("/dashboard/admin")) {
        if (!isLoggedIn) return false;
        if (auth?.user?.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
        }
        return true;
      }

      if (pathname.startsWith("/dashboard")) return isLoggedIn;

      if (onAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
      }

      return true;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        const role: UserRole = token.role === "admin" ? "admin" : "user";
        session.user.role = role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
