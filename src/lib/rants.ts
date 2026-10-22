import path from "node:path";
import fs from "node:fs";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content/rants");

export type Rant = {
  slug: string;
  title: string;
  date: string;
  length: number;
  summary: string;
  image?: string;
  body: string;
}

export function getRant(slug: string): Rant | null {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { ...(data as Omit<Rant, "slug" | "body">), slug, body: content };
}

export function getRants(): Rant[] {
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => getRant(f.replace(/\.md$/, ""))!)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-us", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
}
