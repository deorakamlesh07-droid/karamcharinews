import Link from "next/link";
import { CategoryGrid } from "@/components/category-grid";
import { NewsCard } from "@/components/news-card";
import { getLatestNews } from "@/lib/news";

export default async function Home() {
  const [lead, ...rest] = await getLatestNews();
  return (
    <>
      <section className="breaking"><div className="container breaking-inner"><span className="pulse">ताज़ा</span><Link href={`/news/${lead.slug}`}>{lead.title}</Link><span className="arrow">→</span></div></section>
      <section className="hero"><div className="container hero-grid">
        <div><p className="eyebrow">स्वतंत्र कर्मचारी सूचना मंच</p><h1>हर कर्मचारी के लिए<br /><em>स्पष्ट और भरोसेमंद अपडेट।</em></h1><p className="hero-copy">वेतन आयोग, DA, DPC, ACP/MACP नियम, लाभ और कर्मचारी योजनाओं की जरूरी जानकारी—एक ही जगह।</p><div className="hero-actions"><Link className="button primary" href="/news">ताज़ा खबरें देखें <span>→</span></Link><Link className="button ghost" href="/categories/da">DA अपडेट देखें</Link></div></div>
        <aside className="hero-panel"><span className="panel-kicker">आज का फोकस</span><div className="panel-icon">₹</div><p className="panel-type">वेतन आयोग</p><h2>8वां वेतन आयोग कर्मचारियों के लिए क्या मायने रखता है</h2><Link href={`/news/${lead.slug}`}>पूरा अपडेट पढ़ें <span>→</span></Link></aside>
      </div></section>
      <section className="section container"><div className="section-heading"><div><p className="eyebrow">विषय के अनुसार खोजें</p><h2>ज़रूरी अपडेट तुरंत पाएं।</h2></div><Link href="/categories" className="text-link">सभी श्रेणियां →</Link></div><CategoryGrid /></section>
      <section className="news-band"><div className="container"><div className="section-heading"><div><p className="eyebrow">सत्यापित, उपयोगी, ताज़ा</p><h2>कर्मचारियों की ताज़ा खबरें</h2></div><Link href="/news" className="text-link">सभी खबरें →</Link></div><div className="news-grid"><article className="lead-card"><div className="lead-visual"><span>कर्मचारी<br />अपडेट</span></div><div className="lead-content"><p className="meta"><span className="tag">{lead.category}</span> {lead.date}</p><h3>{lead.title}</h3><p>{lead.summary}</p><Link href={`/news/${lead.slug}`} className="read-link">पूरा अपडेट पढ़ें →</Link></div></article><div className="side-list">{rest.slice(0, 3).map((news) => <NewsCard key={news.slug} news={news} compact />)}</div></div></div></section>
    </>
  );
}
