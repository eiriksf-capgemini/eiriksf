import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { readingTime } from "./format";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  category: string;
  tags: string[];
  draft?: boolean;
  minutes: number;
};

export type Post = PostMeta & { content: string };

const POSTS_DIR = path.join(process.cwd(), "content", "innlegg");

function read(slug: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title),
    date: new Date(data.date).toISOString(),
    excerpt: String(data.excerpt ?? ""),
    category: String(data.category ?? "notat"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    minutes: readingTime(content),
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => read(f.replace(/\.mdx$/, "")))
    .filter((p) => !p.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  try {
    return read(slug);
  } catch {
    return null;
  }
}

export function getCategories(): string[] {
  return [...new Set(getAllPosts().map((p) => p.category))].sort();
}
