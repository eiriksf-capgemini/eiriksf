import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Label from "@/components/Label";
import { Tags } from "@/components/Tag";
import { getAllPosts, getPost } from "@/lib/posts";
import { isoDate } from "@/lib/format";
import { site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

/**
 * Kodeblokker i innlegg ruller vannrett på smale skjermer. Et felt som
 * ruller må kunne få tastaturfokus, ellers kan det ikke rulles uten mus
 * (axe: scrollable-region-focusable).
 */
const mdxComponents = {
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => <pre tabIndex={0} {...props} />,
};

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const postUrl = new URL(`/innlegg/${post.slug}/`, site.url).toString();
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
    url: postUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    keywords: post.tags.length > 0 ? post.tags.join(", ") : undefined,
  };

  return (
    <article className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <Label idx="02">
        <Link href="/innlegg/" className="hover:underline">
          Innlegg
        </Link>
        <span className="text-mute">/ {post.category}</span>
      </Label>

      <header className="max-w-[26ch]">
        <h1 className="text-[clamp(34px,5vw,52px)]">{post.title}</h1>
      </header>
      <div className="font-mono text-[12.5px] text-mute mt-5 mb-10 flex flex-wrap gap-x-4 gap-y-2 items-center">
        <span className="text-accent-text">{isoDate(post.date)}</span>
        <span>{post.minutes} min lesetid</span>
        <Tags items={post.tags} />
      </div>

      <div className="prose-post">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
        />
      </div>

      <hr className="hairline" />
      <Link href="/innlegg/" className="btn">
        ← Alle innlegg
      </Link>
    </article>
  );
}
