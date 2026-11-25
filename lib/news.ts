import { getSql } from "@/lib/db";

export type NewsItem = { slug: string; title: string; category: string; date: string; summary: string; content?: string; sourceName?: string; sourceUrl?: string };
export const categories = [
  { name: "ताज़ा खबरें", slug: "latest-news", icon: "◷", description: "कर्मचारियों के हालिया अपडेट" },
  { name: "DA", slug: "da", icon: "%", description: "महंगाई भत्ता अपडेट" },
  { name: "DPC", slug: "dpc", icon: "↗", description: "पदोन्नति समिति अपडेट" },
  { name: "ACP / MACP", slug: "acp-macp", icon: "↑", description: "करियर प्रगति समाचार" },
  { name: "8वां वेतन आयोग", slug: "8th-pay-commission", icon: "₹", description: "वेतन आयोग की ताज़ा खबरें" },
  { name: "वेतन आयोग", slug: "pay-commission", icon: "▦", description: "वेतन संशोधन और fitment" },
  { name: "पेंशन और सेवानिवृत्ति", slug: "pension-retirement", icon: "◉", description: "पेंशन से जुड़े विषय" },
  { name: "योजनाएं और लाभ", slug: "schemes-benefits", icon: "✦", description: "कल्याणकारी योजनाएं" },
];

type ArticleRow = { slug: string; title: string; excerpt: string; content?: string; category: string | null; source_name?: string | null; source_url?: string | null; published_at: string | Date };
const formatDate = (value: string | Date) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)).toUpperCase();
const toNewsItem = (row: ArticleRow): NewsItem => ({ slug: row.slug, title: row.title, summary: row.excerpt, content: row.content, category: row.category || "Latest News", sourceName: row.source_name || undefined, sourceUrl: row.source_url || undefined, date: formatDate(row.published_at) });

export async function getLatestNews(): Promise<NewsItem[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    const rows = await sql`SELECT a.slug, a.title, a.excerpt, c.name AS category, a.published_at FROM articles a LEFT JOIN categories c ON c.id = a.category_id WHERE a.status = 'published' ORDER BY a.published_at DESC LIMIT 20` as ArticleRow[];
    return rows.map(toNewsItem);
  } catch (error) { console.error("Unable to load published news:", error); return []; }
}

export async function getArticle(slug: string): Promise<NewsItem | undefined> {
  const sql = getSql();
  if (!sql) return undefined;
  try {
    const rows = await sql`SELECT a.slug, a.title, a.excerpt, a.content, a.source_name, a.source_url, c.name AS category, a.published_at FROM articles a LEFT JOIN categories c ON c.id = a.category_id WHERE a.status = 'published' AND a.slug = ${slug} LIMIT 1` as ArticleRow[];
    return rows[0] ? toNewsItem(rows[0]) : undefined;
  } catch (error) { console.error("Unable to load article:", error); return undefined; }
}
