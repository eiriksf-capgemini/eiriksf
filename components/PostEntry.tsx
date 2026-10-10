import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { isoDate } from "@/lib/format";
import { Tags } from "./Tag";

/** Fyldig oppføring – brukes i innleggslisten */
export default function PostEntry({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/innlegg/${post.slug}/`}
      className="group grid md:grid-cols-[150px_1fr] gap-2 md:gap-7 py-8 border-t border-line"
    >
      <div className="font-mono text-[12.5px] text-accent-text leading-[1.8]">
        {isoDate(post.date)}
        <br />
        <span className="text-mute">{post.minutes} min</span> · {post.category}
      </div>
      <div>
        <h2 className="text-[26px] mb-2 group-hover:text-accent-text">{post.title}</h2>
        <p className="text-ink-2 text-[15.5px] max-w-[62ch] mb-3">{post.excerpt}</p>
        <Tags items={post.tags} />
      </div>
    </Link>
  );
}
