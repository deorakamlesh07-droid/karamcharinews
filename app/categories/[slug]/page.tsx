import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { DaChart } from "@/components/da-chart";
import { PayCommissionFeature } from "@/components/pay-commission-feature";
import { PayCommissionCalculator } from "@/components/pay-commission-calculator";
import { categories, getLatestNews } from "@/lib/news";

export default async function Category({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const category = categories.find(item => item.slug === slug); if (!category) notFound();
  const latestNews = await getLatestNews(); const items = latestNews.filter(item => item.category === category.name);
  return <section className="container page-section"><p className="eyebrow">श्रेणी</p><h1 className="page-title">{category.name}</h1><p className="page-intro">{category.description}</p>{slug === "da" && <DaChart />}{slug === "pay-commission" && <PayCommissionFeature />}{slug === "8th-pay-commission" && <PayCommissionCalculator />}{items.length ? <div className="listing">{items.map(item => <NewsCard key={item.slug} news={item} />)}</div> : <p className="empty-state">इस श्रेणी में अभी कोई प्रकाशित लेख उपलब्ध नहीं है।</p>}</section>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const category = categories.find(item => item.slug === slug); if (!category) return {};
  const title = `${category.name}: राजस्थान कर्मचारी अपडेट`;
  return { title, description: `${category.description} — Rajasthan कर्मचारी समाचार, गाइड और आधिकारिक स्रोत।`, alternates: { canonical: `/categories/${category.slug}` }, openGraph: { title, description: category.description, url: `/categories/${category.slug}` } };
}
