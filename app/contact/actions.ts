"use server";

import { getSql } from "@/lib/db";

export type ContactFormState = { error?: string; success?: string };

export async function submitContact(_: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) return { error: "कृपया सभी फ़ील्ड भरें।" };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "कृपया सही ईमेल पता दर्ज करें।" };
  if (name.length > 120 || email.length > 254 || message.length > 3000) return { error: "संदेश बहुत लंबा है। कृपया छोटा संदेश भेजें।" };

  const sql = getSql();
  if (!sql) return { error: "संदेश सेवा अभी उपलब्ध नहीं है। कृपया बाद में प्रयास करें।" };

  try {
    await sql`INSERT INTO contact_messages (name, email, message) VALUES (${name}, ${email}, ${message})`;
    return { success: "आपका संदेश भेज दिया गया है। धन्यवाद!" };
  } catch {
    return { error: "संदेश भेजा नहीं जा सका। कृपया बाद में प्रयास करें।" };
  }
}
