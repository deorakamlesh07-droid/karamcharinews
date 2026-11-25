import type { Metadata } from "next";
import { NewsCard } from "@/components/news-card";
import { getLatestNews } from "@/lib/news";
import { siteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "ताज़ा खबरें — राजस्थान कर्मचारी समाचार",
  description:
    "राजस्थान सरकारी कर्मचारियों के लिए DA, DPC, ACP/MACP, 8वां वेतन आयोग, पेंशन और सरकारी आदेशों के सत्यापित अपडेट। Karamchari News पर पढ़ें।",
  keywords:
    "राजस्थान कर्मचारी समाचार, DA update, DPC order, 8th pay commission news, pay commission rajasthan, karamchari news",
  alternates: { canonical: "/news" },
  openGraph: {
    type: "website",
    url: "/news",
    title: "ताज़ा खबरें — राजस्थान कर्मचारी समाचार",
    description: "DA, DPC, 8वां वेतन आयोग और पेंशन — स्रोत-आधारित अपडेट।",
    locale: "hi_IN",
    siteName,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "होम", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "ताज़ा खबरें", item: `${siteUrl}/news` },
  ],
};

export default async function NewsPage() {
  const latestNews = await getLatestNews();
  return (
    <section className="container page-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <p className="eyebrow">न्यूज़ डेस्क</p>
      <h1 className="page-title">कर्मचारियों की ताज़ा खबरें</h1>
      <p className="page-intro">
        वेतन, आदेश, पदोन्नति, लाभ और राज्य कर्मचारियों को प्रभावित करने वाली नीतियों के सत्यापित अपडेट — DA, DPC, ACP/MACP, 8वां वेतन आयोग और पेंशन।
      </p>
      <div className="listing">{latestNews.map((news) => <NewsCard key={news.slug} news={news} />)}</div>
    </section>
  );
}
