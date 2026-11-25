import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { DaChart } from "@/components/da-chart";
import { PayCommissionFeature } from "@/components/pay-commission-feature";
import { PayCommissionCalculator } from "@/components/pay-commission-calculator";
import { categories, getLatestNews } from "@/lib/news";
import { siteUrl, siteName } from "@/lib/site";

/** Re-generate category pages at most once a day */
export const revalidate = 86400;

export default async function Category({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find(item => item.slug === slug);
  if (!category) notFound();
  const latestNews = await getLatestNews();
  const items = latestNews.filter(item => item.category === category.name);

  const pageUrl = `${siteUrl}/categories/${slug}`;

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "होम", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "श्रेणियां", item: `${siteUrl}/categories` },
      { "@type": "ListItem", position: 3, name: category.name, item: pageUrl },
    ],
  };

  // FAQPage schema — only if the category has FAQs
  const faqSchema = category.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faqs.map(faq => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  } : null;

  return (
    <section className="container page-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <p className="eyebrow">श्रेणी</p>
      <h1 className="page-title">{category.name}</h1>
      <p className="page-intro">{category.intro || category.description}</p>

      {slug === "da" && <DaChart />}
      {slug === "pay-commission" && <PayCommissionFeature />}
      {slug === "8th-pay-commission" && <PayCommissionCalculator />}

      {items.length ? (
        <div className="listing">{items.map(item => <NewsCard key={item.slug} news={item} />)}</div>
      ) : (
        <p className="empty-state">इस श्रेणी में अभी कोई प्रकाशित लेख उपलब्ध नहीं है।</p>
      )}

      {/* FAQ section rendered for users + crawlers */}
      {category.faqs.length > 0 && (
        <section className="faq-section" aria-labelledby={`faq-${slug}`}>
          <h2 id={`faq-${slug}`}>अक्सर पूछे जाने वाले सवाल</h2>
          <dl>
            {category.faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <dt>{faq.q}</dt>
                <dd>{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </section>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find(item => item.slug === slug);
  if (!category) return {};
  const title = category.metaTitle ?? `${category.name}: राजस्थान कर्मचारी अपडेट`;
  const description = category.metaDescription ?? `${category.description} — ${siteName}`;
  const url = `/categories/${slug}`;
  return {
    title,
    description,
    keywords: category.keywords?.join(", "),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName,
      locale: "hi_IN",
    },
  };
}
