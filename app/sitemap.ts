import type { MetadataRoute } from "next";
import { categories } from "@/lib/news";
import { getSql } from "@/lib/db";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = ["", "/news", "/about", "/contact", "/editorial-policy", ...categories.map(category => `/categories/${category.slug}`)].map(path => ({ url: `${siteUrl}${path}`, lastModified: new Date(), changeFrequency: path === "" || path === "/news" ? "daily" : "weekly", priority: path === "" ? 1 : 0.7 }));
  const sql = getSql();
  if (!sql) return staticPages;
  try {
    const articles = await sql`SELECT slug, updated_at FROM articles WHERE status = 'published' ORDER BY published_at DESC` as { slug: string; updated_at: string | Date }[];
    return [...staticPages, ...articles.map(article => ({ url: `${siteUrl}/news/${article.slug}`, lastModified: new Date(article.updated_at), changeFrequency: "weekly" as const, priority: 0.8 }))];
  } catch { return staticPages; }
}
