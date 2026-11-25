import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "kn_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

function required(name: "ADMIN_EMAIL" | "ADMIN_SESSION_SECRET" | "ADMIN_OTP_SECRET") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function signature(value: string) {
  return createHmac("sha256", required("ADMIN_SESSION_SECRET")).update(value).digest("base64url");
}

export function normaliseAdminEmail(email: string) {
  const adminEmail = required("ADMIN_EMAIL").trim().toLowerCase();
  return email.trim().toLowerCase() === adminEmail ? adminEmail : null;
}

export function createOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(code: string) {
  return createHmac("sha256", required("ADMIN_OTP_SECRET")).update(code).digest("hex");
}

export function sameOtp(code: string, codeHash: string) {
  const candidate = Buffer.from(hashOtp(code));
  const stored = Buffer.from(codeHash);
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}

export function createSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + SESSION_MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function validSession(token?: string) {
  if (!token) return false;
  const [payload, receivedSignature] = token.split(".");
  if (!payload || !receivedSignature) return false;
  const expectedSignature = signature(payload);
  if (receivedSignature.length !== expectedSignature.length || !timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as { email?: string; exp?: number };
    return session.email === required("ADMIN_EMAIL").trim().toLowerCase() && typeof session.exp === "number" && session.exp > Date.now();
  } catch { return false; }
}

export async function isAdmin() {
  return validSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export const sessionCookieOptions = { httpOnly: true, sameSite: "strict" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE };
