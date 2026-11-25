"use client";

import { FormEvent, useState } from "react";

type Category = { id: number; name: string };
export function ArticleForm({ categories }: { categories: Category[] }) {
  const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget); const payload = Object.fromEntries(form); const response = await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json(); setMessage(response.ok ? "Saved successfully." : result.error); if (response.ok) event.currentTarget.reset(); setSaving(false); }
  return <form className="article-form" onSubmit={submit}><label>Headline<input required name="title" maxLength={300} /></label><label>Slug<input required name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="da-increase-2026" /></label><label>Category<select required name="categoryId" defaultValue=""> <option value="" disabled>Select a category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Short summary<textarea required name="excerpt" rows={3} /></label><label>Article content<textarea required name="content" rows={12} /></label><div className="admin-two-col"><label>Official source name<input name="sourceName" /></label><label>Official source URL<input name="sourceUrl" type="url" placeholder="https://…" /></label></div><label>Publishing status<select name="status" defaultValue="draft"><option value="draft">Save as draft</option><option value="published">Publish now</option></select></label><button disabled={saving}>{saving ? "Saving…" : "Save article"}</button><p className="admin-message" role="status">{message}</p></form>;
}
