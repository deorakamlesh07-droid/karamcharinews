import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const sql = getSql();
  if (!sql) return NextResponse.json([]);
  const { slug } = await params;
  const rows = await sql`SELECT m.url, m.media_type, m.alt_text FROM article_media m JOIN articles a ON a.id = m.article_id WHERE a.slug = ${slug} AND a.status = 'published' ORDER BY m.position ASC`;
  return NextResponse.json(rows);
}
