"use client";

import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const [email, setEmail] = useState(""); const [code, setCode] = useState(""); const [sent, setSent] = useState(false); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function requestCode(event: FormEvent) { event.preventDefault(); setLoading(true); const response = await fetch("/api/admin/request-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); const result = await response.json(); setMessage(result.message || result.error); setSent(response.ok); setLoading(false); }
  async function verify(event: FormEvent) { event.preventDefault(); setLoading(true); const response = await fetch("/api/admin/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code }) }); const result = await response.json(); if (response.ok) window.location.assign("/admin"); else setMessage(result.error); setLoading(false); }
  return <>{!sent ? <form onSubmit={requestCode}><label>Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label><button disabled={loading}>{loading ? "Sending…" : "Send one-time code"}</button></form> : <form onSubmit={verify}><label>Six-digit code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} /></label><button disabled={loading}>{loading ? "Checking…" : "Verify and sign in"}</button><button type="button" className="admin-secondary" onClick={() => setSent(false)}>Use a different email</button></form>}<p className="admin-message" role="status">{message}</p></>;
}
