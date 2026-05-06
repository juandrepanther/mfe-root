import { NextResponse } from "next/server";
import { getOptionalSession, toAuthSnapshot } from "@/lib/auth/session";

export async function GET() {
  const session = await getOptionalSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json(toAuthSnapshot(session));
}