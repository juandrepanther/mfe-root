import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/jwt";
import { clearSessionCookieOptions } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE_NAME, "", clearSessionCookieOptions());

  return response;
}