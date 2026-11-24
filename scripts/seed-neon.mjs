import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Add it to .env.local first.");
}

const sql = neon(process.env.DATABASE_URL);
const schema = readFileSync(new URL("../database/schema.sql", import.meta.url), "utf8").replace(/^--.*$/gm, "");
const statements = schema
  .split(/;\s*(?:\r?\n|$)/)
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

const [{ article_count: articleCount }] = await sql.query(
  "SELECT COUNT(*)::int AS article_count FROM articles WHERE status = 'published'",
);
console.log(`Neon schema applied. Published articles: ${articleCount}`);
