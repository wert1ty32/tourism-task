import type { NextAuthConfig } from "next-auth";

const PUBLIC_PATHS = ["/login", "/forgot-password"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isPublicPath = PUBLIC_PATHS.some((path) =>
        request.nextUrl.pathname.startsWith(path),
      );

      if (isPublicPath) {
        if (isLoggedIn && request.nextUrl.pathname.startsWith("/login")) {
          return Response.redirect(new URL("/", request.nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "employee";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
