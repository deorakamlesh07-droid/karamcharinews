import { getSql } from "@/lib/db";

export type NewsItem = { slug: string; title: string; category: string; date: string; publishedAt: string | Date; updatedAt: string | Date; summary: string; content?: string; sourceName?: string; sourceUrl?: string; imageTheme?: string };

export const THEME_IMAGES: Record<string, { label: string; url: string; description: string }> = {
  "8thcpc": {
    label: "8वां वेतन आयोग (8th CPC)",
    url: "/images/themes/8thcpc.svg",
    description: "वेतन आयोग, fitment factor व वेतन संशोधन की खबरों के लिए",
  },
  growth: {
    label: "करियर वृद्धि व DPC (Growth)",
    url: "/images/themes/growth.svg",
    description: "DPC, पदोन्नति, ACP/MACP व सेवा प्रगति की खबरों के लिए",
  },
  money: {
    label: "वेतन व DA (Salary / Money)",
    url: "/images/themes/money.svg",
    description: "महंगाई भत्ता (DA), वेतन भुगतान, Arrears व पेंशन के लिए",
  },
};

export function getThemeImageUrl(theme?: string | null): string {
  if (theme && THEME_IMAGES[theme]) {
    return THEME_IMAGES[theme].url;
  }
  return THEME_IMAGES["8thcpc"].url;
}
export const categories = [
  {
    name: "ताज़ा खबरें",
    slug: "latest-news",
    icon: "◷",
    description: "कर्मचारियों के हालिया अपडेट",
    metaTitle: "ताज़ा खबरें — राजस्थान कर्मचारी समाचार",
    metaDescription: "राजस्थान सरकारी कर्मचारियों के लिए सत्यापित ताज़ा अपडेट — DA, DPC, वेतन आयोग, पेंशन और सरकारी आदेश।",
    intro: "राजस्थान के सरकारी कर्मचारियों को प्रभावित करने वाले नवीनतम सरकारी आदेश, अधिसूचनाएं और नीति परिवर्तन यहां दर्ज किए जाते हैं। हर अपडेट आधिकारिक स्रोत से सत्यापित होता है।",
    keywords: ["राजस्थान कर्मचारी समाचार", "sarkari karmchari news", "government employee news rajasthan", "राजस्थान सरकारी कर्मचारी अपडेट"],
    faqs: [] as Array<{ q: string; a: string }>,
  },
  {
    name: "DA",
    slug: "da",
    icon: "%",
    description: "महंगाई भत्ता अपडेट — दरें, आदेश और कैलकुलेटर",
    metaTitle: "DA (महंगाई भत्ता) अपडेट — राजस्थान कर्मचारी 2024-25",
    metaDescription: "राजस्थान में DA (Dearness Allowance) की नवीनतम दर, आदेश संख्या, प्रभावी तिथि और DA arrears की जानकारी। RCS Revised Pay Rules 2017 के अनुसार अपडेट।",
    intro: "DA (Dearness Allowance / महंगाई भत्ता) राजस्थान राज्य कर्मचारियों के वेतन का अहम हिस्सा है। इस पेज पर आपको वित्त विभाग के नवीनतम DA आदेश, दरें और DA arrears से जुड़ी आधिकारिक जानकारी मिलेगी।",
    keywords: ["DA update rajasthan", "mahangai bhatta rajasthan 2025", "DA arrears rajasthan", "dearness allowance rajasthan", "राजस्थान DA दर", "DA order rajasthan", "DA kab badhega rajasthan"],
    faqs: [
      { q: "राजस्थान में अभी DA कितना प्रतिशत है?", a: "राजस्थान वित्त विभाग के आदेश सं. F.6(3)FD(Rules)/2017 (दिनांक 30 अक्टूबर 2026) के अनुसार RCS (Revised Pay) Rules, 2017 के अंतर्गत DA 1 जुलाई 2026 से 63% है।" },
      { q: "DA का पैसा कब मिलेगा?", a: "DA आदेश जारी होने के बाद ट्रेज़री से वेतन के साथ देय होता है। Arrears की स्थिति संबंधित विभाग और आदेश की शर्तों पर निर्भर करती है।" },
      { q: "DA और DR में क्या अंतर है?", a: "DA (Dearness Allowance) कार्यरत कर्मचारियों को मिलता है जबकि DR (Dearness Relief) पेंशनभोगियों को दिया जाता है।" },
    ],
  },
  {
    name: "DPC",
    slug: "dpc",
    icon: "↗",
    description: "पदोन्नति समिति अपडेट — आदेश और पात्रता गाइड",
    metaTitle: "DPC (विभागीय पदोन्नति समिति) अपडेट — राजस्थान",
    metaDescription: "राजस्थान DPC (Departmental Promotion Committee) के ताज़ा आदेश, Review DPC, पात्रता शर्तें और सेवा अभिलेख चेकलिस्ट। विभागवार पदोन्नति की स्थिति जानें।",
    intro: "DPC (Departmental Promotion Committee / विभागीय पदोन्नति समिति) राजस्थान में कर्मचारियों की पदोन्नति तय करती है। यहां DPC आदेश, Review DPC अपडेट, पात्रता और सेवा अभिलेख से जुड़ी जानकारी संकलित की जाती है।",
    keywords: ["DPC rajasthan", "departmental promotion committee rajasthan", "review DPC order rajasthan", "DPC list rajasthan", "promotion order rajasthan", "राजस्थान पदोन्नति आदेश", "DPC kab hogi"],
    faqs: [
      { q: "DPC के लिए कौन से दस्तावेज चाहिए?", a: "DPC से पहले APAR (Annual Performance Appraisal Report), सेवा अभिलेख, वरिष्ठता सूची और विभागीय जांच स्थिति की जांच करें। अंतिम सूची संबंधित विभाग तय करता है।" },
      { q: "Review DPC क्या होती है?", a: "Review DPC तब होती है जब किसी कारण नियमित DPC में कोई कर्मचारी छूट जाता है या उसकी पात्रता पर पुनर्विचार होता है।" },
    ],
  },
  {
    name: "ACP / MACP",
    slug: "acp-macp",
    icon: "↑",
    description: "ACP / MACP — पात्रता, सेवा अवधि और करियर प्रगति",
    metaTitle: "ACP / MACP — राजस्थान कर्मचारी करियर प्रगति अपडेट",
    metaDescription: "राजस्थान में ACP (Assured Career Progression) और MACP (Modified Assured Career Progression) की पात्रता, सेवा अवधि, नियम और आधिकारिक आदेश।",
    intro: "ACP/MACP (Assured Career Progression / Modified Assured Career Progression) योजना उन कर्मचारियों को वित्तीय अपग्रेड देती है जिन्हें नियमित पदोन्नति नहीं मिल पाती। यहां पात्रता, सेवा वर्ष और लागू नियमों की जानकारी दी जाती है।",
    keywords: ["MACP rajasthan", "ACP rajasthan", "assured career progression rajasthan", "MACP order rajasthan", "ACP eligibility rajasthan", "राजस्थान MACP नियम", "10 20 30 year increment rajasthan"],
    faqs: [
      { q: "MACP कितने वर्ष की सेवा पर मिलता है?", a: "MACP 10, 20 और 30 वर्ष की नियमित सेवा पूर्ण होने पर तीन वित्तीय अपग्रेड देता है, बशर्ते उस अवधि में पदोन्नति न हुई हो। अंतिम पात्रता लागू सेवा नियमों से तय होती है।" },
      { q: "ACP और MACP में क्या अंतर है?", a: "ACP पुरानी योजना थी जो दो अपग्रेड देती थी। MACP में तीन अपग्रेड हैं और यह ग्रेड-पे आधारित है।" },
    ],
  },
  {
    name: "8वां वेतन आयोग",
    slug: "8th-pay-commission",
    icon: "₹",
    description: "8th Pay Commission — fitment factor, salary calculator और आधिकारिक अपडेट",
    metaTitle: "8वां वेतन आयोग (8th Pay Commission) — ताज़ा अपडेट और वेतन कैलकुलेटर",
    metaDescription: "8वें वेतन आयोग (8th CPC) की नवीनतम खबरें, अनुशंसित fitment factor, salary calculator और केंद्र व राज्य कर्मचारियों पर असर की जानकारी।",
    intro: "8वां वेतन आयोग (8th Pay Commission / 8th CPC) केंद्र सरकार के कर्मचारियों के वेतन ढांचे की समीक्षा करेगा। इस पेज पर आयोग की स्थिति, Terms of Reference, fitment factor की चर्चा और राजस्थान कर्मचारियों पर संभावित प्रभाव की जानकारी दी जाती है। नीचे दिया गया कैलकुलेटर केवल अनुमान के लिए है।",
    keywords: ["8th pay commission", "8th CPC", "8th pay commission fitment factor", "8th pay commission salary calculator", "8th pay commission rajasthan", "8th pay commission latest news", "8वां वेतन आयोग", "8th CPC salary increase", "fitment factor 2.57 2.86 3.68", "8th pay commission implementation date"],
    faqs: [
      { q: "8वां वेतन आयोग कब लागू होगा?", a: "8वें वेतन आयोग की अधिसूचना जनवरी 2025 में हुई थी। लागू होने की तिथि और सिफारिशें अभी घोषित नहीं हुई हैं। केवल आयोग की आधिकारिक सिफारिश और सरकारी स्वीकृति आदेश ही प्रामाणिक माने जाएंगे।" },
      { q: "8th CPC में fitment factor कितना होगा?", a: "1.98 से 3.83 तक विभिन्न fitment factor की चर्चा है लेकिन कोई आधिकारिक दर घोषित नहीं हुई है। अंतिम fitment factor आयोग की सिफारिशों और सरकार के आदेश से तय होगा।" },
      { q: "8वें वेतन आयोग का राजस्थान कर्मचारियों पर क्या असर होगा?", a: "राजस्थान अपने राज्य कर्मचारियों के लिए अलग pay revision करता है। केंद्रीय आयोग की सिफारिशों को राज्य सरकार अपने नियमानुसार लागू करती है। अंतिम निर्णय राज्य सरकार का होगा।" },
    ],
  },
  {
    name: "वेतन आयोग",
    slug: "pay-commission",
    icon: "▦",
    description: "वेतन आयोग — Pay Matrix, Revised Pay Rules और fitment",
    metaTitle: "वेतन आयोग अपडेट — राजस्थान Pay Matrix और Revised Pay Rules",
    metaDescription: "राजस्थान Civil Services Revised Pay Rules 2017, Pay Matrix, fitment factor और वेतन निर्धारण की सम्पूर्ण जानकारी। 7वें और 8वें वेतन आयोग की तुलना।",
    intro: "वेतन आयोग केंद्र और राज्य सरकारी कर्मचारियों के वेतन, भत्ते और सेवा शर्तों की समीक्षा करता है। राजस्थान में Rajasthan Civil Services (Revised Pay) Rules, 2017 लागू हैं। यहां pay matrix, वेतन निर्धारण, fitment और वेतन संशोधन से जुड़ी खबरें मिलती हैं।",
    keywords: ["pay commission rajasthan", "7th pay commission rajasthan", "pay matrix rajasthan", "revised pay rules rajasthan 2017", "fitment factor rajasthan", "salary revision rajasthan", "राजस्थान वेतन आयोग", "pay fixation rajasthan"],
    faqs: [
      { q: "राजस्थान में अभी कौन से Pay Rules लागू हैं?", a: "राजस्थान Civil Services (Revised Pay) Rules, 2017 (RCS Rules) लागू हैं जो 7वें वेतन आयोग की सिफारिशों के आधार पर बनाए गए थे।" },
      { q: "Pay Matrix क्या होता है?", a: "Pay Matrix एक तालिका है जो Level और Cell के आधार पर बेसिक पे तय करती है। पदोन्नति या DA revision पर अगले उच्च Cell में वेतन निर्धारण होता है।" },
    ],
  },
  {
    name: "पेंशन और सेवानिवृत्ति",
    slug: "pension-retirement",
    icon: "◉",
    description: "पेंशन, Gratuity, Family Pension और सेवानिवृत्ति लाभ",
    metaTitle: "पेंशन और सेवानिवृत्ति — राजस्थान कर्मचारी अपडेट",
    metaDescription: "राजस्थान में OPS, NPS, family pension, gratuity, commutation और सेवानिवृत्ति लाभ से जुड़ी नवीनतम जानकारी और आधिकारिक आदेश।",
    intro: "सेवानिवृत्ति के बाद पेंशन, पारिवारिक पेंशन, ग्रेच्युटी और GPF/NPS से जुड़ी जानकारी यहां संकलित की जाती है। OPS (पुरानी पेंशन योजना) और NPS (नई पेंशन योजना) से जुड़े सभी अपडेट और आदेश यहां उपलब्ध हैं।",
    keywords: ["pension rajasthan", "OPS NPS rajasthan", "old pension scheme rajasthan", "family pension rajasthan", "gratuity rajasthan", "GPF rajasthan", "retirement benefits rajasthan", "राजस्थान पेंशन"],
    faqs: [
      { q: "राजस्थान में OPS किसे मिलती है?", a: "राजस्थान सरकार ने 1 जनवरी 2004 से पहले नियुक्त कर्मचारियों को OPS दी हुई है। 2022 में राज्य सरकार ने NPS कर्मचारियों के लिए भी OPS बहाली की घोषणा की थी — इसकी नवीनतम स्थिति विभागीय आदेश से जांचें।" },
      { q: "GPF पर ब्याज दर कितनी है?", a: "GPF (General Provident Fund) ब्याज दर केंद्र सरकार तय करती है; राजस्थान राज्य इसे लागू करता है। नवीनतम दर वित्त विभाग की अधिसूचना से देखें।" },
    ],
  },
  {
    name: "योजनाएं और लाभ",
    slug: "schemes-benefits",
    icon: "✦",
    description: "कल्याणकारी योजनाएं — LTC, HBA, मेडिकल और अन्य लाभ",
    metaTitle: "कर्मचारी योजनाएं और लाभ — राजस्थान सरकारी सुविधाएं",
    metaDescription: "राजस्थान सरकारी कर्मचारियों के लिए LTC, HBA (House Building Advance), मेडिकल सुविधा, स्थानांतरण भत्ता और अन्य कल्याणकारी योजनाओं की जानकारी।",
    intro: "राजस्थान सरकार अपने कर्मचारियों के लिए विभिन्न कल्याणकारी योजनाएं चलाती है — LTC (Leave Travel Concession), HBA (House Building Advance), मेडिकल रिइंबर्समेंट, चिल्ड्रन एजुकेशन अलाउंस और अन्य लाभ। इस पेज पर नवीनतम आदेश और पात्रता की जानकारी मिलती है।",
    keywords: ["LTC rajasthan", "HBA rajasthan", "house building advance rajasthan", "medical allowance rajasthan", "government employee benefits rajasthan", "राजस्थान कर्मचारी योजनाएं", "CEA rajasthan"],
    faqs: [
      { q: "LTC किसे मिलता है?", a: "LTC (Leave Travel Concession) राजस्थान के नियमित सरकारी कर्मचारियों को मिलता है। पात्रता और ब्लॉक वर्ष लागू सेवा नियमों से तय होते हैं।" },
    ],
  },
];

type ArticleRow = { slug: string; title: string; excerpt: string; content?: string; category: string | null; source_name?: string | null; source_url?: string | null; image_theme?: string | null; published_at: string | Date; updated_at: string | Date };
const formatDate = (value: string | Date) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)).toUpperCase();
const toNewsItem = (row: ArticleRow): NewsItem => ({ slug: row.slug, title: row.title, summary: row.excerpt, content: row.content, category: row.category || "Latest News", sourceName: row.source_name || undefined, sourceUrl: row.source_url || undefined, imageTheme: row.image_theme || "8thcpc", date: formatDate(row.published_at), publishedAt: row.published_at, updatedAt: row.updated_at });

export async function getLatestNews(): Promise<NewsItem[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    const rows = await sql`SELECT a.slug, a.title, a.excerpt, c.name AS category, a.published_at, a.updated_at, a.image_theme FROM articles a LEFT JOIN categories c ON c.id = a.category_id WHERE a.status = 'published' ORDER BY a.published_at DESC LIMIT 20` as ArticleRow[];
    return rows.map(toNewsItem);
  } catch (error) { console.error("Unable to load published news:", error); return []; }
}

export async function getArticle(slug: string): Promise<NewsItem | undefined> {
  const sql = getSql();
  if (!sql) return undefined;
  try {
    const rows = await sql`SELECT a.slug, a.title, a.excerpt, a.content, a.source_name, a.source_url, c.name AS category, a.published_at, a.updated_at, a.image_theme FROM articles a LEFT JOIN categories c ON c.id = a.category_id WHERE a.status = 'published' AND a.slug = ${slug} LIMIT 1` as ArticleRow[];
    return rows[0] ? toNewsItem(rows[0]) : undefined;
  } catch (error) { console.error("Unable to load article:", error); return undefined; }
}
