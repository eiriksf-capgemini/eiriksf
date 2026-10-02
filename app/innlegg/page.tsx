import type { Metadata } from "next";
import Label from "@/components/Label";
import PostEntry from "@/components/PostEntry";
import Tag from "@/components/Tag";
import { getAllPosts, getCategories } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Innlegg",
  description: "Erfaringer, mønstre og meninger om utviklerplattformer, DevOps og sikkerhet.",
};

export default function PostsPage() {
  const posts = getAllPosts();
  const cats = getCategories();

  return (
    <div className="wrap">
      <Label idx="02">Innlegg</Label>
      <h1 className="text-[48px] break-words">Notater fra plattformsiden.</h1>
      <p className="text-[21px] leading-[1.5] text-ink mt-3.5 max-w-[44ch]">
        Erfaringer, mønstre og meninger om utviklerplattformer, DevOps og sikkerhet. Skrevet for
        folk som bygger og drifter ting.
      </p>

      {/* Kategorier – rent visuelt inntil filtrering ev. legges til */}
      <div className="flex gap-1.5 flex-wrap mt-7 mb-2">
        <Tag hot>alle</Tag>
        {cats.map((c) => (
          <Tag key={c}>{c}</Tag>
        ))}
      </div>

      <div>
        {posts.map((p) => (
          <PostEntry key={p.slug} post={p} />
        ))}
        {posts.length === 0 && (
          <p className="font-mono text-mute py-10 border-t border-line">
            Ingen innlegg ennå. Legg en .mdx-fil i content/innlegg/.
          </p>
        )}
      </div>
    </div>
  );
}
