"use client";

import { upload } from "@vercel/blob/client";
import { FormEvent, useState } from "react";
import "./media.css";

type Category = { id: number; name: string };
type UploadedMedia = { url: string; type: "image" | "video"; alt: string };
const mediaTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"];

export function ArticleForm({ categories }: { categories: Category[] }) {
  const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false); const [media, setMedia] = useState<UploadedMedia[]>([]); const [uploading, setUploading] = useState(false);
  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return; setUploading(true); setMessage("");
    try {
      const uploaded = await Promise.all(Array.from(files).map(async file => {
        if (!mediaTypes.includes(file.type)) throw new Error(`${file.name} is not a supported image or video.`);
        const kind = file.type.startsWith("video/") ? "video" : "image";
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const blob = await upload(`articles/${Date.now()}-${safeName}`, file, { access: "public", handleUploadUrl: "/api/admin/media", multipart: file.size > 100 * 1024 * 1024 });
        return { url: blob.url, type: kind, alt: "" } as UploadedMedia;
      }));
      setMedia(current => [...current, ...uploaded]);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); } finally { setUploading(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget); const payload = { ...Object.fromEntries(form), media }; const response = await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json(); setMessage(response.ok ? "Saved successfully." : result.error); if (response.ok) { event.currentTarget.reset(); setMedia([]); } setSaving(false); }
  return <form className="article-form" onSubmit={submit}><label>Headline<input required name="title" maxLength={300} /></label><label>Slug<input required name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="da-increase-2026" /></label><label>Category<select required name="categoryId" defaultValue=""><option value="" disabled>Select a category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Short summary<textarea required name="excerpt" rows={3} /></label><label>Article content<textarea required name="content" rows={12} /></label><div className="admin-two-col"><label>Official source name<input name="sourceName" /></label><label>Official source URL<input name="sourceUrl" type="url" placeholder="https://example.gov.in/order" /></label></div><label>Photos and videos<input type="file" accept={mediaTypes.join(",")} multiple onChange={event => uploadFiles(event.target.files)} disabled={uploading} /></label><p className="admin-help">Add any number of JPG, PNG, WebP, GIF, MP4, WebM, or MOV files. Each file can be up to 500 MB.</p>{media.length > 0 && <div className="media-list">{media.map((item, index) => <div key={item.url}><span>{item.type === "video" ? "Video" : "Image"} {index + 1}</span><input aria-label={`Description for media ${index + 1}`} value={item.alt} placeholder="Optional image description" onChange={event => setMedia(current => current.map((mediaItem, mediaIndex) => mediaIndex === index ? { ...mediaItem, alt: event.target.value } : mediaItem))} /><button type="button" className="admin-secondary" onClick={() => setMedia(current => current.filter((_, mediaIndex) => mediaIndex !== index))}>Remove</button></div>)}</div>}<label>Publishing status<select name="status" defaultValue="draft"><option value="draft">Save as draft</option><option value="published">Publish now</option></select></label><button disabled={saving || uploading}>{uploading ? "Uploading media…" : saving ? "Saving…" : "Save article"}</button><p className="admin-message" role="status">{message}</p></form>;
}
