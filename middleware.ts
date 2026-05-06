import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createLoginRedirectUrl } from "@/lib/auth/redirect";
import { getRequestSession } from "@/lib/auth/request-session";

export async function middleware(request: NextRequest) {
  const session = await getRequestSession(request);

  if (session) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  const pathnameWithSearch = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  redirectUrl.pathname = "/login";
  redirectUrl.search = `?redirect=${encodeURIComponent(pathnameWithSearch)}`;

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/", "/about/:path*", "/products/:path*", "/prices/:path*"],
};