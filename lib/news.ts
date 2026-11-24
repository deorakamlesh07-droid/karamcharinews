import { getSql } from "@/lib/db";

export type NewsItem={slug:string;title:string;category:string;date:string;summary:string;content?:string;sourceName?:string;sourceUrl?:string};
export const categories=[
  {name:'ताज़ा खबरें',slug:'latest-news',icon:'◷',description:'कर्मचारियों के हालिया अपडेट'},
  {name:'DA',slug:'da',icon:'%',description:'महंगाई भत्ता अपडेट'},
  {name:'DPC',slug:'dpc',icon:'↗',description:'पदोन्नति समिति अपडेट'},
  {name:'ACP / MACP',slug:'acp-macp',icon:'↑',description:'करियर प्रगति समाचार'},
  {name:'8वां वेतन आयोग',slug:'8th-pay-commission',icon:'₹',description:'वेतन आयोग की ताज़ा खबरें'},
  {name:'वेतन आयोग',slug:'pay-commission',icon:'▦',description:'वेतन संशोधन और fitment'},
  {name:'पेंशन और सेवानिवृत्ति',slug:'pension-retirement',icon:'◉',description:'पेंशन से जुड़े विषय'},
  {name:'योजनाएं और लाभ',slug:'schemes-benefits',icon:'✦',description:'कल्याणकारी योजनाएं'}
];
export const latestNews:NewsItem[]=[
  {slug:'rajasthan-racs-review-dpc-aao-junior-scale-2025-26',title:'राजस्थान: RAcS अधिकारियों के लिए Review DPC आदेश जारी, AAO-I से Junior Scale (2025-26)',category:'DPC',date:'14 SEP 2026',summary:'राजस्थान वित्त विभाग की नवीनतम सूची में RAcS अधिकारियों के AAO-I से Junior Scale के लिए Review DPC Order (2025-26) दर्ज है। यह अपडेट संबंधित RAcS कैडर तक सीमित है।',sourceName:'राजस्थान वित्त विभाग',sourceUrl:'https://finance.rajasthan.gov.in/website/Default.aspx/Menu_JS_CSS/Script_Style/scroll/Menu_JS_CSS/ImageSlider/SearchOrders.aspx'},
  {slug:'8th-pay-commission-fitment-factor-range',title:'8वां वेतन आयोग: 1.98 से 3.83 तक Fitment Factor की चर्चा को समझें',category:'8वां वेतन आयोग',date:'24 NOV 2026',summary:'Fitment Factor वेतन संशोधन का एक गुणक है। 1.98 से 3.83 के संभावित दायरे की चर्चा को आधिकारिक घोषणा नहीं समझना चाहिए। अंतिम दर केवल आयोग और सरकार के निर्णय से तय होगी।'},
  {slug:'8th-pay-commission-latest-update',title:'8वें वेतन आयोग पर नई खबर: कर्मचारियों को किन आधिकारिक अपडेट पर नजर रखनी चाहिए',category:'8वां वेतन आयोग',date:'24 NOV 2026',summary:'आयोग की अधिसूचना, Terms of Reference, सिफारिशें और सरकार के स्वीकृति आदेश ही विश्वसनीय आधार हैं।'},
  {slug:'rajasthan-da-63-percent-july-2026',title:'राजस्थान DA 63%: 1 जुलाई 2026 से लागू, 60% से 3% की बढ़ोतरी',category:'DA',date:'30 OCT 2026',summary:'राजस्थान वित्त विभाग के आदेश सं. F.6(3)FD(Rules)/2017 के अनुसार RCS (Revised Pay) Rules, 2017 के कर्मचारियों का DA 60% से बढ़ाकर 63% किया गया है।'},
  {slug:'department-promotion-committee-guidance',title:'DPC प्रक्रिया: कर्मचारियों को कौन-से दस्तावेज तैयार रखने चाहिए',category:'DPC',date:'22 NOV 2026',summary:'DPC से पहले सेवा अभिलेख, पात्रता और विभागीय सत्यापन से जुड़ी व्यावहारिक जानकारी।'},
  {slug:'macp-progression-guidance',title:'ACP / MACP प्रगति: पात्रता और सेवा अवधि को समझें',category:'ACP / MACP',date:'21 NOV 2026',summary:'लागू नियमों और अपने विभागीय सेवा रिकॉर्ड में किन बातों की जांच करें।'},
  {slug:'rajasthan-revised-pay-rules-guide',title:'राजस्थान Revised Pay Rules: Pay Matrix और वेतन निर्धारण को समझें',category:'वेतन आयोग',date:'19 NOV 2026',summary:'Rajasthan Civil Services (Revised Pay) Rules, 2017 के अंतर्गत वेतन निर्धारण, Pay Matrix और विभागीय सत्यापन से संबंधित जरूरी बातें।'},
];

type ArticleRow = { slug: string; title: string; excerpt: string; content?: string; category: string | null; source_name?: string | null; source_url?: string | null; published_at: string | Date };
const formatDate = (value: string | Date) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)).toUpperCase();
const toNewsItem = (row: ArticleRow): NewsItem => ({ slug: row.slug, title: row.title, summary: row.excerpt, content: row.content, category: row.category || "Latest News", sourceName: row.source_name || undefined, sourceUrl: row.source_url || undefined, date: formatDate(row.published_at) });

/** Reads published content from Neon when DATABASE_URL is set; samples keep the site useful before launch. */
export async function getLatestNews(): Promise<NewsItem[]> {
  const sql = getSql();
  if (!sql) return latestNews;
  try {
    const rows = await sql`SELECT a.slug, a.title, a.excerpt, c.name AS category, a.published_at FROM articles a LEFT JOIN categories c ON c.id = a.category_id WHERE a.status = 'published' ORDER BY a.published_at DESC LIMIT 20` as ArticleRow[];
    return rows.length ? rows.map(toNewsItem) : latestNews;
  } catch { return latestNews; }
}

export async function getArticle(slug: string): Promise<NewsItem | undefined> {
  const sql = getSql();
  if (!sql) return latestNews.find((item) => item.slug === slug);
  try {
    const rows = await sql`SELECT a.slug, a.title, a.excerpt, a.content, a.source_name, a.source_url, c.name AS category, a.published_at FROM articles a LEFT JOIN categories c ON c.id = a.category_id WHERE a.status = 'published' AND a.slug = ${slug} LIMIT 1` as ArticleRow[];
    return rows[0] ? toNewsItem(rows[0]) : latestNews.find((item) => item.slug === slug);
  } catch { return latestNews.find((item) => item.slug === slug); }
}
