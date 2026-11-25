import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createOtp, hashOtp, hasAdminGate, normaliseAdminEmail } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await hasAdminGate())) return new NextResponse(null, { status: 404 });
  try {
    if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL_FROM) {
      console.error("Admin OTP email is not configured: RESEND_API_KEY or ADMIN_EMAIL_FROM is missing.");
      return NextResponse.json({ error: "Admin email delivery is not configured." }, { status: 503 });
    }
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
  } catch (error) {
    console.error("Admin OTP email delivery failed:", error);
    return NextResponse.json({ error: "We could not send a code. Check the server configuration." }, { status: 500 });
  }
}
