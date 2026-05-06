import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, verifySessionToken } from "@/lib/auth/jwt";
import { createLoginRedirectUrl } from "@/lib/auth/redirect";
import type { AuthSnapshot, SessionUser } from "@/lib/auth/types";

export const getOptionalSession = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
});

export const getRequiredSession = cache(async (): Promise<SessionUser> => {
  const session = await getOptionalSession();

  if (!session) {
    redirect("/login");
  }

  return session;
});

export const toAuthSnapshot = (session: SessionUser): AuthSnapshot => {
  return {
    isAuthenticated: true,
    user: {
      email: session.email,
      role: session.role,
    },
    loginUrl: "/login",
    logoutUrl: "/api/auth/logout",
  };
};

export const getSessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
});

export const clearSessionCookieOptions = () => ({
  ...getSessionCookieOptions(),
  maxAge: 0,
});

export const getLoginRedirectForPath = (pathname: string): string => {
  return createLoginRedirectUrl(pathname);
};