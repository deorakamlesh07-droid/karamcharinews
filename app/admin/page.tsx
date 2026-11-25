import { ArticleForm } from "./article-form";
import "./admin.css";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const sql = getSql();
  if (!sql) return <main className="admin-shell"><section className="admin-card"><h1>Database setup required</h1><p>Add DATABASE_URL in Vercel, then run database/schema.sql against your Neon database.</p></section></main>;
  const categories = await sql`SELECT id, name FROM categories ORDER BY name` as { id: number; name: string }[];
  const recent = await sql`SELECT title, slug, status, updated_at FROM articles ORDER BY updated_at DESC LIMIT 8` as { title: string; slug: string; status: string; updated_at: string | Date }[];
  return <main className="admin-shell"><section className="admin-panel"><div className="admin-top"><div><p className="admin-kicker">PRIVATE ADMINISTRATION</p><h1>Publish news</h1><p>Draft first, then publish only after checking the official source.</p></div><form action="/api/admin/logout" method="post"><button className="admin-secondary">Sign out</button></form></div><ArticleForm categories={categories} /><section className="admin-recent"><h2>Recent articles</h2>{recent.map(article => <div key={article.slug}><span>{article.title}</span><small>{article.status} · {new Date(article.updated_at).toLocaleDateString("en-GB")}</small></div>)}</section></section></main>;
}
