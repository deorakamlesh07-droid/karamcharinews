"use client";

import "./contact-form.css";
import { useActionState } from "react";
import { submitContact, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = {};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  return <form action={formAction} className="contact-form">
    <label>नाम<input name="name" placeholder="आपका नाम" maxLength={120} required /></label>
    <label>ईमेल<input name="email" type="email" placeholder="you@example.com" maxLength={254} required /></label>
    <label>संदेश<textarea name="message" placeholder="अपना संदेश लिखें" rows={6} maxLength={3000} required /></label>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    {state.success && <p className="form-success" role="status">{state.success}</p>}
    <button className="button primary" type="submit" disabled={isPending}>{isPending ? "भेजा जा रहा है..." : "संदेश भेजें →"}</button>
  </form>;
}
