import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/cv/", "/innlegg/", "/ki/"].map((p) => ({ url: site.url + p }));
  const posts = getAllPosts().map((p) => ({
    url: `${site.url}/innlegg/${p.slug}/`,
    lastModified: p.date,
  }));
  return [...pages, ...posts];
}
