import { NextResponse } from "next/server";
import { signSessionToken } from "@/lib/auth/jwt";
import { sanitizeRedirectPath } from "@/lib/auth/redirect";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { getSessionCookieOptions } from "@/lib/auth/session";

type LoginRequestBody = {
  email?: string;
  password?: string;
  redirectTo?: string | null;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginRequestBody | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const isPasswordValid = await verifyPassword(password, user.salt, user.passwordHash);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await signSessionToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const redirectTo = sanitizeRedirectPath(body?.redirectTo);
  const response = NextResponse.json({ redirectTo });

  response.cookies.set("mfe-dashboard-session", token, getSessionCookieOptions());

  return response;
}