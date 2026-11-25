import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ArticleShare } from "@/components/article-share";
import { ArticleMedia } from "@/components/article-media";
import "./globals.css";
import "./hindi.css";
import "./news-theme.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Karamchari News | राजस्थान कर्मचारी समाचार — DA, DPC, 8वां वेतन आयोग",
    template: "%s | Karamchari News",
  },
  description:
    "राजस्थान सरकारी कर्मचारियों के लिए DA, DPC, ACP/MACP, 8वां वेतन आयोग (8th CPC), वेतन आयोग, GPF और पेंशन की स्रोत-आधारित जानकारी। Dearness Allowance, Pay Commission और Fitment Factor के सत्यापित अपडेट।",
  keywords:
    "राजस्थान कर्मचारी समाचार, DA update rajasthan, 8th pay commission, 8th CPC, DPC rajasthan, MACP rajasthan, pay commission rajasthan, fitment factor, dearness allowance rajasthan, sarkari karmchari news, karamchari news",
  alternates: { canonical: "/" },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: siteUrl,
    siteName,
    title: "Karamchari News | राजस्थान कर्मचारी — DA, DPC, 8th Pay Commission",
    description:
      "राजस्थान कर्मचारियों के लिए DA, DPC, ACP/MACP, 8वां वेतन आयोग और पेंशन की स्रोत-आधारित जानकारी।",
    images: [{ url: `${siteUrl}/karamchari-news-logo.png`, width: 400, height: 400, alt: "Karamchari News Logo" }],
  },
  twitter: {
    card: "summary",
    title: "Karamchari News | राजस्थान कर्मचारी समाचार",
    description: "DA, DPC, 8वां वेतन आयोग और पेंशन — स्रोत-आधारित अपडेट।",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: {
    "google-adsense-account": "ca-pub-2060188522674524",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  inLanguage: "hi-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/news?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: siteName,
  url: siteUrl,
  logo: { "@type": "ImageObject", url: `${siteUrl}/karamchari-news-logo.png` },
  sameAs: [],
  contactPoint: { "@type": "ContactPoint", email: "contact@karamcharinews.in", contactType: "editorial" },
  description:
    "राजस्थान सरकारी कर्मचारियों के लिए DA, DPC, वेतन आयोग और पेंशन की स्रोत-आधारित जानकारी।",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }} />
        <Header />
        <main>{children}</main>
        <ArticleMedia />
        <ArticleShare />
        <Footer />
        <Analytics />
        <SpeedInsights />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2060188522674524"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
