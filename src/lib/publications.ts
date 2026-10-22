import path from "node:path";
import fs from "node:fs";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content/publications");

export type Publication = {
  slug: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  status?: string;
  summary: string;
  image?: string;
  links?: { label: string; href: string }[];
  body: string;
}

export function getPublication(slug: string): Publication | null {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { ...(data as Omit<Publication, "slug" | "body">), slug, body: content };
}

export function getPublications(): Publication[] {
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => getPublication(f.replace(/\.md$/, ""))!)
    .sort((a, b) => b.year - a.year);
}
