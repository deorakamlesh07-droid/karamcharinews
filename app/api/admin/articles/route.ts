import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
type MediaInput = { url: string; type: "image" | "video"; alt?: string };

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    const data = await request.json() as Record<string, unknown>;
    const title = String(data.title ?? "").trim();
    const slug = String(data.slug ?? "").trim().toLowerCase();
    const excerpt = String(data.excerpt ?? "").trim();
    const content = String(data.content ?? "").trim();
    const categoryId = Number(data.categoryId);
    const sourceName = String(data.sourceName ?? "").trim() || null;
    const sourceUrl = String(data.sourceUrl ?? "").trim() || null;
    const status = data.status === "published" ? "published" : "draft";
    const validThemes = ["8thcpc", "growth", "money"];
    const imageTheme = validThemes.includes(String(data.imageTheme ?? "")) ? String(data.imageTheme) : "8thcpc";
    const media = Array.isArray(data.media) ? data.media as MediaInput[] : [];
    if (!title || title.length > 300 || !slugPattern.test(slug) || !excerpt || !content || !Number.isInteger(categoryId)) return NextResponse.json({ error: "Please complete all required fields with a valid lowercase slug." }, { status: 400 });
    if (sourceUrl) new URL(sourceUrl);
    if (media.some(item => !/^https:\/\/.+\.blob\.vercel-storage\.com\//.test(item.url) || !["image", "video"].includes(item.type) || (item.alt?.length ?? 0) > 300)) return NextResponse.json({ error: "Invalid uploaded media." }, { status: 400 });
    const sql = getSql();
    if (!sql) return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
    const articles = await sql`INSERT INTO articles (title, slug, excerpt, content, category_id, source_name, source_url, status, image_theme, published_at) VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${categoryId}, ${sourceName}, ${sourceUrl}, ${status}, ${imageTheme}, NOW()) RETURNING id` as { id: string }[];
    for (const [position, item] of media.entries()) await sql`INSERT INTO article_media (article_id, url, media_type, alt_text, position) VALUES (${articles[0].id}, ${item.url}, ${item.type}, ${item.alt?.trim() || null}, ${position})`;
    revalidatePath("/"); revalidatePath("/news"); revalidatePath(`/news/${slug}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("unique") ? "This slug already exists." : "Unable to save the article.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
