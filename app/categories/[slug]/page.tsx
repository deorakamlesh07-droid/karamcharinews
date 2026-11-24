import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { DaChart } from "@/components/da-chart";
import { PayCommissionFeature } from "@/components/pay-commission-feature";
import { categories, getLatestNews } from "@/lib/news";
export default async function Category({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const category=categories.find(c=>c.slug===slug);if(!category)notFound();const latestNews=await getLatestNews();const items=latestNews.filter(n=>n.category===category.name);return <section className="container page-section"><p className="eyebrow">श्रेणी</p><h1 className="page-title">{category.name}</h1><p className="page-intro">{category.description}</p>{slug==='da'&&<DaChart/>}{slug==='pay-commission'&&<PayCommissionFeature/>}<div className="listing">{(items.length?items:latestNews.slice(0,3)).map(n=><NewsCard key={n.slug} news={n}/>)}</div></section>}
