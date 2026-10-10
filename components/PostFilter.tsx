"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PostEntry from "./PostEntry";
import Tag from "./Tag";
import type { PostMeta } from "@/lib/posts";

const PARAM = "kat";

/**
 * Klientside kategori-filter for innleggslisten. Aktiv kategori speiles i
 * URL-en som ?kat=.
 *
 * Leser bevisst IKKE useSearchParams: den tvinger Next til å hoppe over
 * prerendering av dette undertreet, og med statisk eksport endte hele
 * innleggslisten som tom HTML – usynlig for søkemotorer og for alle før
 * hydrering, og den forårsaket et layouthopp når listen dukket opp.
 * Siden eksporten uansett er én fil for alle query-strenger, kan ikke
 * serveren vite kategorien. Derfor: render alt, og filtrer etter mount.
 */
export default function PostFilter({
  posts,
  categories,
}: {
  posts: PostMeta[];
  categories: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(PARAM);
    setActive(requested && categories.includes(requested) ? requested : null);
  }, [categories]);

  const setCategory = useCallback(
    (cat: string | null) => {
      setActive(cat);
      const params = new URLSearchParams(window.location.search);
      if (cat) {
        params.set(PARAM, cat);
      } else {
        params.delete(PARAM);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
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
