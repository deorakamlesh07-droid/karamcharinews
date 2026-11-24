import { NewsCard } from "@/components/news-card";
import { getLatestNews } from "@/lib/news";

export default async function NewsPage() { const latestNews = await getLatestNews(); return <section className="container page-section"><p className="eyebrow">न्यूज़ डेस्क</p><h1 className="page-title">कर्मचारियों की ताज़ा खबरें</h1><p className="page-intro">वेतन, आदेश, पदोन्नति, लाभ और राज्य कर्मचारियों को प्रभावित करने वाली नीतियों के सत्यापित अपडेट।</p><div className="filter-row"><button className="active">सभी अपडेट</button><button>नवीनतम</button><button>लोकप्रिय</button></div><div className="listing">{latestNews.map((news) => <NewsCard key={news.slug} news={news} />)}</div></section> }
