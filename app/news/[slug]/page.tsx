import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/news";

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
  return <article className="container article"><div className="crumb">होम / समाचार / {news.category}</div><p className="meta"><span className="tag">{news.category}</span> {news.date} · 4 मिनट में पढ़ें</p><h1>{news.title}</h1><p className="article-deck">{news.summary}</p><div className="article-rule" /><ArticleContent content={news.content} />{news.sourceUrl && <div className="source-box"><strong>आधिकारिक स्रोत: {news.sourceName}</strong><p>किसी भी सेवा, वेतन या वित्तीय निर्णय से पहले संबंधित विभाग के मूल आदेश से जानकारी सत्यापित करें।</p><a href={news.sourceUrl} target="_blank" rel="noreferrer">आधिकारिक स्रोत खोलें →</a></div>}<Link className="text-link" href="/news">← ताज़ा खबरों पर वापस जाएं</Link></article>;
}
