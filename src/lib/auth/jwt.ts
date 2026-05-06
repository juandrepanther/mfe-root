import { SignJWT, jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/auth/env";
import type { SessionUser } from "@/lib/auth/types";

export const SESSION_COOKIE_NAME = "mfe-dashboard-session";
export const SESSION_MAX_AGE_SECONDS = 60 * 10;

const getJwtSecretBytes = (): Uint8Array => {
  return new TextEncoder().encode(getJwtSecret());
};

export const signSessionToken = async (user: SessionUser): Promise<string> => {
  return new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecretBytes());
};

export const verifySessionToken = async (token: string): Promise<SessionUser | null> => {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretBytes(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
};