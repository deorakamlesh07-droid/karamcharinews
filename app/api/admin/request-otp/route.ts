import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createOtp, hashOtp, normaliseAdminEmail } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email } = await request.json() as { email?: string };
    const adminEmail = normaliseAdminEmail(email ?? "");
    const sql = getSql();
    if (!adminEmail || !sql) return NextResponse.json({ message: "If this email is authorised, a code will be sent." });
    const recent = await sql`SELECT id FROM admin_otp_challenges WHERE email = ${adminEmail} AND created_at > NOW() - INTERVAL '60 seconds' LIMIT 1`;
    if (recent.length) return NextResponse.json({ message: "If this email is authorised, a code will be sent." });
    const code = createOtp();
    await sql`INSERT INTO admin_otp_challenges (email, code_hash, expires_at) VALUES (${adminEmail}, ${hashOtp(code)}, NOW() + INTERVAL '10 minutes')`;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({ from: process.env.ADMIN_EMAIL_FROM!, to: [adminEmail], subject: "Your Karamchari News admin code", text: `Your one-time admin code is ${code}. It expires in 10 minutes. Do not share it.` });
    if (error) throw new Error(error.message);
    return NextResponse.json({ message: "If this email is authorised, a code will be sent." });
  } catch {
    return NextResponse.json({ error: "We could not send a code. Check the server configuration." }, { status: 500 });
  }
}
