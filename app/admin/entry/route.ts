import { NextRequest, NextResponse } from "next/server";
import { ADMIN_GATE_COOKIE, createGateSession, sessionCookieOptions, validAccessKey } from "@/lib/admin-auth";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key") ?? undefined;
  if (!validAccessKey(key)) return new NextResponse(null, { status: 404 });
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set(ADMIN_GATE_COOKIE, createGateSession(), sessionCookieOptions);
  return response;
}
