import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticle } from "@/lib/news";
import { siteName, siteUrl } from "@/lib/site";

function ArticleContent({ content }: { content?: string }) {
  const blocks = (content || "").trim().split(/\n\s*\n/).filter(Boolean);
  return <div className="article-body">{blocks.map((block, index) => {
    if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
    const lines = block.split("\n").filter(Boolean);
    if (lines.every(line => line.startsWith("- "))) return <ul key={index}>{lines.map(line => <li key={line}>{line.slice(2)}</li>)}</ul>;
    return <p key={index}>{block}</p>;
  })}</div>;
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const news = await getArticle(slug); if (!news) notFound();
  const url = `${siteUrl}/news/${news.slug}`;
  const articleSchema = { "@context": "https://schema.org", "@type": "NewsArticle", headline: news.title, description: news.summary, datePublished: new Date(news.publishedAt).toISOString(), dateModified: new Date(news.updatedAt).toISOString(), mainEntityOfPage: url, inLanguage: "hi-IN", isAccessibleForFree: true, author: { "@type": "Organization", name: `${siteName} Desk`, url: `${siteUrl}/about` }, publisher: { "@type": "Organization", name: siteName, url: siteUrl } };
  return <article className="container article"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} /><div className="crumb">होम / समाचार / {news.category}</div><p className="meta"><span className="tag">{news.category}</span> {news.date} · 4 मिनट में पढ़ें</p><h1>{news.title}</h1><p className="article-deck">{news.summary}</p><p className="article-byline">Karamchari News Desk · अंतिम सत्यापन: {new Intl.DateTimeFormat("hi-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(news.updatedAt))}</p><div className="article-rule" /><ArticleContent content={news.content} />{news.sourceUrl && <div className="source-box"><strong>आधिकारिक स्रोत: {news.sourceName}</strong><p>किसी भी सेवा, वेतन या वित्तीय निर्णय से पहले संबंधित विभाग के मूल आदेश से जानकारी सत्यापित करें।</p><a href={news.sourceUrl} target="_blank" rel="noreferrer">आधिकारिक स्रोत खोलें →</a></div>}<Link className="text-link" href="/news">← ताज़ा खबरों पर वापस जाएं</Link></article>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const news = await getArticle(slug); if (!news) return {};
  const url = `/news/${news.slug}`;
  return { title: news.title, description: news.summary, alternates: { canonical: url }, openGraph: { type: "article", url, title: news.title, description: news.summary, publishedTime: new Date(news.publishedAt).toISOString(), modifiedTime: new Date(news.updatedAt).toISOString(), authors: [`${siteName} Desk`] } };
}
