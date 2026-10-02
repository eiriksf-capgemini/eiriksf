# eiriksf — digital CV og profesjonell nettside

Hardkodet portefølje bygget med **Next.js (App Router) + TypeScript + Tailwind CSS v4 + MDX**,
eksportert statisk og servert av **nginx** i en liten, rotløs container.

## Struktur

```
app/            ruter (/, /cv, /innlegg, /innlegg/[slug], /ki, 404, robots, sitemap)
components/     Header, NavLinks, ThemeToggle, Footer, Label, Tag, PostRow, PostEntry
content/
  cv.ts         CV-data (jobber, sertifiseringer, utdanning, områder)
  ki.ts         teknologiradar, eksperimenter, prinsipper
  innlegg/*.mdx ett innlegg per fil, med frontmatter
lib/            site.ts (navn/lenker/meny), posts.ts (lesing av MDX), format.ts
app/globals.css designtokens (lys/mørk), Tailwind-theme, komponentklasser, MDX-typografi
docker/         nginx.conf
public/         statiske filer – legg cv.pdf her for «Last ned PDF»
```

## Kom i gang

```bash
corepack enable          # gir deg pnpm
pnpm install
pnpm dev                 # http://localhost:3000
pnpm typecheck && pnpm lint
pnpm build               # statisk eksport til ./out
```

## Docker

```bash
docker compose up --build        # http://localhost:8080
# eller
pnpm docker:build && docker run --rm -p 8080:8080 eiriksf:latest
```

Imaget bruker `nginx-unprivileged` (kjører som ikke-root på port 8080) og inneholder kun de
statiske filene – ingen Node i runtime.

## Skrive et innlegg

Lag `content/innlegg/min-slug.mdx`:

```mdx
---
title: "Tittel"
date: 2026-10-01
category: plattform
tags: [Kubernetes, GitOps]
excerpt: "Én–to setninger som vises i listen."
draft: false        # true skjuler innlegget i produksjonsbygg
---

Innhold i Markdown/MDX. Lesetid beregnes automatisk.
```

Slug = filnavn. Innleggene sorteres på `date`.

## Tilpasse

- Navn, tittel, lenker og meny: `lib/site.ts`
- Farger og fonter: tokens øverst i `app/globals.css`
- Tema: lagres i `localStorage` (`theme`), følger systemet første gang

## Videre arbeid (forslag)

- Legg `public/cv.pdf` (eksport fra CV-malen) så nedlastingsknappen virker
- Selvhostede fonter (Inter + JetBrains Mono) via `next/font/local` om du vil bort fra systemfonter
- Klientside-filtrering av innlegg på kategori
- RSS-feed (`app/feed.xml/route.ts` med `dynamic = "force-static"`)