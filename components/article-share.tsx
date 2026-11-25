"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import "./article-share.css";

export function ArticleShare() {
  const pathname = usePathname();
  const [status, setStatus] = useState("");

  if (!pathname.startsWith("/news/")) return null;

  async function share() {
    const url = window.location.href;
    const title = document.querySelector("article h1")?.textContent ?? document.title;

    try {
      if (navigator.share) {
        await navigator.share({ title, text: title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("Link copied");
      window.setTimeout(() => setStatus(""), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("Unable to copy link");
    }
  }

  return <div className="article-share container"><button type="button" className="share-button" onClick={share}><span aria-hidden="true">↗</span> Share this news</button><span className="share-status" role="status" aria-live="polite">{status}</span></div>;
}
