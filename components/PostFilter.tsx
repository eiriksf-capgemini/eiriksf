"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PostEntry from "./PostEntry";
import Tag from "./Tag";
import type { PostMeta } from "@/lib/posts";

const PARAM = "kat";

/** Klientside kategori-filter for innleggslisten. Holder aktiv kategori i URL (?kat=) */
export default function PostFilter({
  posts,
  categories,
}: {
  posts: PostMeta[];
  categories: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requested = searchParams.get(PARAM);
  const active = requested && categories.includes(requested) ? requested : null;

  const setCategory = useCallback(
    (cat: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cat) {
        params.set(PARAM, cat);
      } else {
        params.delete(PARAM);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const visible = useMemo(
    () => (active ? posts.filter((p) => p.category === active) : posts),
    [posts, active],
  );

  return (
    <>
      <div className="flex gap-1.5 flex-wrap mt-7 mb-2">
        <Tag hot={!active} onClick={() => setCategory(null)}>
          alle
        </Tag>
        {categories.map((c) => (
          <Tag key={c} hot={active === c} onClick={() => setCategory(c)}>
            {c}
          </Tag>
        ))}
      </div>

      <div>
        {visible.map((p) => (
          <PostEntry key={p.slug} post={p} />
        ))}
        {posts.length === 0 && (
          <p className="font-mono text-mute py-10 border-t border-line">
            Ingen innlegg ennå. Legg en .mdx-fil i content/innlegg/.
          </p>
        )}
        {posts.length > 0 && visible.length === 0 && (
          <p className="font-mono text-mute py-10 border-t border-line">
            Ingen innlegg i denne kategorien.
          </p>
        )}
      </div>
    </>
  );
}
