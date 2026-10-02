import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { isoDate } from "@/lib/format";

/** Kompakt rad – brukes på forsiden */
export default function PostRow({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/innlegg/${post.slug}/`}
      className="group grid grid-cols-[110px_1fr_auto] gap-6 items-baseline py-4 border-t border-line last:border-b"
    >
      <span className="font-mono text-[12.5px] text-accent-text">{isoDate(post.date)}</span>
      <h3 className="text-[20px] font-medium group-hover:text-accent-text">{post.title}</h3>
      <span className="font-mono text-accent-text opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition">
        →
      </span>
    </Link>
  );
}
