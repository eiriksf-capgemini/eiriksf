import type { Metadata } from "next";
import { Suspense } from "react";
import Label from "@/components/Label";
import PostFilter from "@/components/PostFilter";
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

      {/* Kategorier – klientside filter, aktiv kategori speiles i URL som ?kat= */}
      <Suspense fallback={null}>
        <PostFilter posts={posts} categories={cats} />
      </Suspense>
    </div>
  );
}
