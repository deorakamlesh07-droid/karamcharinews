import type { Metadata } from "next";
import "./globals.css";
import "./hindi.css";
import "./news-theme.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Karamchari News | Rajasthan Employee News",
  description: "Independent news and scheme updates for state government employees.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
