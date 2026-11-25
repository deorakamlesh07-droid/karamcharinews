import { NextResponse } from "next/server";
import { createSession, normaliseAdminEmail, sameOtp, sessionCookieOptions } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json() as { email?: string; code?: string };
    const adminEmail = normaliseAdminEmail(email ?? "");
    const sql = getSql();
    if (!adminEmail || !sql || !/^\d{6}$/.test(code ?? "")) return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    const rows = await sql`SELECT id, code_hash FROM admin_otp_challenges WHERE email = ${adminEmail} AND used_at IS NULL AND expires_at > NOW() AND attempts < 5 ORDER BY created_at DESC LIMIT 1` as { id: string; code_hash: string }[];
    const challenge = rows[0];
    if (!challenge) return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    await sql`UPDATE admin_otp_challenges SET attempts = attempts + 1 WHERE id = ${challenge.id} AND used_at IS NULL`;
    if (!sameOtp(code!, challenge.code_hash)) return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    const used = await sql`UPDATE admin_otp_challenges SET used_at = NOW() WHERE id = ${challenge.id} AND used_at IS NULL RETURNING id`;
    if (!used.length) return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set("kn_admin_session", createSession(adminEmail), sessionCookieOptions);
    return response;
  } catch { return NextResponse.json({ error: "Unable to verify code." }, { status: 500 }); }
}
