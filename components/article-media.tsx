"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./article-media.css";

type Media = { url: string; media_type: "image" | "video"; alt_text: string | null };
export function ArticleMedia() {
  const pathname = usePathname(); const [media, setMedia] = useState<Media[]>([]);
  useEffect(() => { if (!pathname.startsWith("/news/")) return; const slug = pathname.split("/").pop(); fetch(`/api/news/${slug}/media`).then(response => response.ok ? response.json() : []).then(setMedia).catch(() => setMedia([])); }, [pathname]);
  if (!pathname.startsWith("/news/") || !media.length) return null;
  return <section className="container article-media" aria-label="Article media">{media.map((item, index) => item.media_type === "video" ? <video key={item.url} controls preload="metadata"><source src={item.url} />Your browser does not support video.</video> : <img key={item.url} src={item.url} alt={item.alt_text || `Article image ${index + 1}`} />)}</section>;
}
