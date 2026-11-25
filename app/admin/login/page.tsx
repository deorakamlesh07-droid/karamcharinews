import { notFound } from "next/navigation";
import { hasAdminGate } from "@/lib/admin-auth";
import { AdminLoginForm } from "./login-form";
import "../admin.css";

export default async function AdminLoginPage() {
  if (!(await hasAdminGate())) notFound();
  return <main className="admin-shell"><section className="admin-card"><p className="admin-kicker">PRIVATE ADMINISTRATION</p><h1>Secure sign in</h1><p>Only the configured administrator email can receive a one-time code.</p><AdminLoginForm /></section></main>;
}
