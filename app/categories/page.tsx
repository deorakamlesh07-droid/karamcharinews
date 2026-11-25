import type { Metadata } from "next";
import { CategoryGrid } from "@/components/category-grid";
import { siteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "समाचार श्रेणियां — DA, DPC, 8वां वेतन आयोग, पेंशन",
  description:
    "राजस्थान कर्मचारी समाचार की सभी श्रेणियां — DA, DPC, ACP/MACP, 8वां वेतन आयोग, वेतन आयोग, पेंशन और योजनाएं। विषय के अनुसार अपडेट खोजें।",
  keywords:
    "DA categories, DPC news, 8th pay commission, pay commission rajasthan, MACP, pension rajasthan, राजस्थान कर्मचारी श्रेणियां",
  alternates: { canonical: "/categories" },
  openGraph: {
    type: "website",
    url: "/categories",
    title: "समाचार श्रेणियां — Karamchari News",
    description: "DA, DPC, 8वां वेतन आयोग, ACP/MACP, पेंशन — विषय के अनुसार अपडेट खोजें।",
    locale: "hi_IN",
    siteName,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "होम", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "श्रेणियां", item: `${siteUrl}/categories` },
  ],
};

export default function CategoriesPage() {
  return (
    <section className="container page-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <p className="eyebrow">अपडेट खोजें</p>
      <h1 className="page-title">समाचार श्रेणियां</h1>
      <p className="page-intro">
        DA, DPC, ACP/MACP, 8वां वेतन आयोग, वेतन आयोग, पेंशन और योजनाओं के आधिकारिक अपडेट पाने के लिए एक विषय चुनें।
      </p>
      <CategoryGrid />
    </section>
  );
}
