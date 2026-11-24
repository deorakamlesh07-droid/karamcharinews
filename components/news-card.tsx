import Link from "next/link";
import type { NewsItem } from "@/lib/news";
export function NewsCard({news,compact=false}:{news:NewsItem;compact?:boolean}){return <article className={`news-card ${compact?'compact':''}`}><div><p className="meta"><span className="tag">{news.category}</span> {news.date}</p><h3><Link href={`/news/${news.slug}`}>{news.title}</Link></h3>{!compact&&<p>{news.summary}</p>}<Link className="read-link" href={`/news/${news.slug}`}>पूरा अपडेट पढ़ें →</Link></div></article>}
