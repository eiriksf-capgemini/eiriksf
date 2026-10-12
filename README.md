# eiriksf — digital CV og profesjonell nettside

Hardkodet portefølje bygget med **Next.js (App Router) + TypeScript + Tailwind CSS v4 + MDX**,
eksportert statisk og servert av **nginx** i en liten, rotløs container.

## Struktur

```
app/            ruter (/, /cv, /innlegg, /innlegg/[slug], /ki, 404, robots, sitemap)
components/     Header, NavLinks, ThemeToggle, Footer, Label, Tag, PostRow, PostEntry
content/
  cv.ts         CV-data (jobber, sertifiseringer, utdanning, områder)
  radar.ts      teknologiradar som flat liste av blips (quadrant/ring/since)
  ki.ts         eksperimenter, prinsipper
  innlegg/*.mdx ett innlegg per fil, med frontmatter
lib/            site.ts (navn/lenker/meny), posts.ts (lesing av MDX), format.ts
app/globals.css designtokens (lys/mørk), Tailwind-theme, komponentklasser, MDX-typografi
docker/         nginx.conf
public/         statiske filer – legg cv.pdf her for «Last ned PDF»
assets/         kildemateriale som ikke serveres av siden (se assets/README.md)
```

## Kom i gang

```bash
corepack enable          # gir deg pnpm – på Node 25+ følger ikke corepack
                         # med lenger, bruk npm i -g pnpm@10.12.1 i stedet
pnpm install
pnpm dev                 # http://localhost:3000
pnpm typecheck && pnpm lint
pnpm build               # statisk eksport til ./out
```

## Docker

```bash
docker compose up               # http://localhost:8080 – bygger alltid på nytt
# eller
pnpm docker:build && docker run --rm -p 8080:8080 eiriksf:latest
```

Compose-filen setter `pull_policy: build`, så `up` bygger imaget på nytt hver
gang. Uten det bygger compose bare når tagen mangler, og `eiriksf:latest`
ligger igjen lokalt etter `pnpm docker:build` – da serverer `up` et gammelt
image uten å si fra.

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

## UI-verifiseringsharness

For aksepttester som krever en ekte nettleser (scrollbredde, aksesibilitetstre,
axe-core, tastaturnavigasjon, elementgeometri), se `tools/verify-ui/README.md`:

```bash
pnpm build
pnpm run verify:ui:setup            # én gang
pnpm run verify:ui:install-browser  # én gang
pnpm verify:ui -- --path /cv/ --viewport 360x800
```

Avhengighetene ligger i en egen manifest utenfor rot-`package.json` og i
`.dockerignore`, slik at `docker build` aldri laster ned en nettleser.