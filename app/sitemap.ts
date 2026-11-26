
import type { MetadataRoute } from "next";
import { categories } from "@/lib/news";
import { getSql } from "@/lib/db";
import { siteUrl } from "@/lib/site";

/** Category slugs that are high-value SEO targets — boosted priority in sitemap */
const highPriorityCategorySlugs = new Set(["da", "8th-pay-commission", "dpc", "acp-macp", "pay-commission"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/news`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/editorial-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    ...categories.map(category => ({
      url: `${siteUrl}/categories/${category.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: highPriorityCategorySlugs.has(category.slug) ? 0.95 : 0.75,
    })),
  ];

  const sql = getSql();
  if (!sql) return staticPages;
  try {
    const articles = await sql`SELECT slug, updated_at, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC` as { slug: string; updated_at: string | Date; published_at: string | Date }[];
    const now30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return [
      ...staticPages,
      ...articles.map(article => ({
        url: `${siteUrl}/news/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: new Date(article.published_at).getTime() > now30 ? ("daily" as const) : ("weekly" as const),
        priority: 0.85,
      })),
    ];
  } catch { return staticPages; }
}
