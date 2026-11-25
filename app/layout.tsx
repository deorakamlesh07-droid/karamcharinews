import type { Metadata } from "next";
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
  title: { default: "Karamchari News | राजस्थान कर्मचारी समाचार", template: "%s | Karamchari News" },
  description: "राजस्थान कर्मचारियों के लिए DA, DPC, ACP/MACP, वेतन आयोग, GPF और पेंशन की स्रोत-आधारित जानकारी।",
  alternates: { canonical: "/" },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: { type: "website", locale: "hi_IN", url: siteUrl, siteName, title: "Karamchari News | राजस्थान कर्मचारी समाचार", description: "राजस्थान कर्मचारियों के लिए स्रोत-आधारित समाचार और उपयोगी गाइड।" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi">
      <body>
        <Header />
        <main>{children}</main>
        <ArticleMedia />
        <ArticleShare />
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
