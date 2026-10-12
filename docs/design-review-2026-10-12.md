# Designreview – /cv og /ki

Dato: 2026-10-12 · Grunnlag: skjermbilder av `localhost:8080` (desktop, ~1900 px) og koden i
`app/cv/page.tsx`, `app/ki/page.tsx` og `components/`.

## Sammendrag

- **/cv bruker omtrent tre skjermhøyder på innhold som får plass på drøyt én.** Hovedårsaken er
  at samme tidsakse (2007 → nå) tegnes fire ganger – arbeidsgivere, rolleutvikling,
  sertifiseringer og områder – og at hver rad får en fullbreddes stolpe der bare en liten bit er
  fylt.
- **Anbefaling for /cv:** slå sammen de tre tidslinjene til én kompakt figur, gjør
  arbeidsgiverlisten til en tett liste med årstall i egen kolonne, og flytt områder/språk/bransjer
  til en sidespalte ved siden av erfaringen. Anslått høyde: fra ~2900 px til ~1400 px.
- **/ki:** radaren fungerer. Høyrestilling med tekst rundt løses best med `float: right` og
  `shape-outside: circle()`, så teksten følger sirkelen og ikke en firkant. Tre alternativer til
  er beskrevet under.

Funn er merket **[F]** (observasjon), **[A]** (analyse) og **[M]** (min vurdering/forslag).

---

## 1. /cv – hva som tar plass

| Seksjon | Omtrentlig høyde | Innhold | Kommentar |
|---|---|---|---|
| Hero | 300 px | Navn, ingress, PDF-knapp, to datoer | Høyre side er nesten tom |
| Erfaring | 1050 px | 7 arbeidsgivere, 1–3 linjer hver | ~150 px per rad for 1 linje tekst |
| Rolleutvikling | 200 px | 5 nivåer over tid | Samme akse en gang til |
| Sertifiseringer og utdanning | 420 px | 7 elementer, én prikk hver | ~55 px per prikk |
| Bransjer | 420 px | 6 stolper | Lesbar, men romslig |
| Om profilen / Områder / Språk | 520 px | 1 avsnitt, 6 mini-tidslinjer, 2 språk | Venstre kolonne halvtom |

**[F]** Hver arbeidsgiverrad har tre vertikale lag: navn + stolpe, oppdragslinje(r), «+ Vis
detaljer». Stolpen fyller 100 % av bredden, men selve segmentet er 3–15 % av den.

**[F]** «Om profilen» – den eneste fortellende teksten – står helt nederst, etter alle
visualiseringene. PDF-knappen finnes to steder.

**[F]** «siden oppdatert» og «PDF oppdatert» viser samme dato.

**[A]** Leseren må skanne fire separate tidsakser for å koble «hva jobbet han med i 2019» til
rolle, sertifisering og kompetanseområde. Informasjonen er god; fordelingen over siden er det som
gjør den spredt.

**[A]** Siden er 820 px bred på en 1900 px skjerm. For en datatung side er det lite. Sidespalten
under er hovedgrepet for å bruke bredden uten å gjøre lesekolonnen lengre.

## 2. /cv – forslag

### 2.1 Én samlet tidslinje i stedet for tre (størst gevinst)

**[M]** Slå sammen `EmployerTimeline`-stolpene, `RoleProgression` og `CredentialMarkers` til én
figur med delt akse. En rad per arbeidsgiver blir en tynn bane (12–14 px), sertifiseringer blir
prikker på en egen bane nederst, og rollenivå vises som fargeintensitet eller en tynn trappelinje
over banene. Figuren blir ~220 px høy i stedet for ~1200 px fordelt på tre seksjoner.

```
            2007      2010         2015         2020        2025  nå
Capgemini   ·····································································■
Instech     ·······························································▬▬▬▬
Sopra       ·························································▬▬▬
Bouvet      ··················································▬▬▬▬▬▬▬
Helse Vest  ···························▬▬▬▬▬▬▬▬▬▬▬▬▬
Telenor     ▬▬▬▬▬▬▬▬
Sertif.     ································ ●  ·········  ●  ● ●  ·····●
```

Teksten forsvinner ikke: listen i 2.2 står rett under, og figuren forblir `aria-hidden` slik
den er i dag. Prinsippet fra `esf-hnd.1` (én rad per arbeidsgiver, ikke per kunde) beholdes.
Ingen sirkulære former, så det holder seg innenfor regelen om at radarspråket er reservert /ki.

### 2.2 Tett erfaringsliste

**[M]** Under figuren: en liste der årstall står i en smal mono-kolonne til venstre og stolpen
er borte (den er nå i figuren). Én rad per oppdrag, arbeidsgiveren som gruppeoverskrift.

```
2026–nå    Capgemini · Senior Managing Consultant
           Rådgivning på plattform, DevOps og utviklerplattformer.               +
2023–2026  Instech Solutions · Senior DevOps Engineer
           Plattformteam for SAIL (AKS, ArgoCD, Backstage-IDP).                  +
2021–2023  Sopra Steria · Tech Lead · Equinor
           Teknisk retning for autonomt produktteam på Radix.                    +
```

- Hele raden er `<summary>`, med `+` til høyre, i stedet for en egen «Vis detaljer»-linje.
  Det sparer ~30 px per rad og gir et større klikkmål. `<details>` beholdes.
- Varighet («2 år 10 mnd») kan stå i mono ved årstallet ved hover/utvidet, eller droppes –
  figuren viser lengden.
- Anslått ~60 px per oppdrag mot ~150 px i dag.

### 2.3 Sertifiseringer som liste, ikke rader med prikker

> **Forkastet 2026-10-12.** Strider mot esf-hnd.6, som fjernet årstallslistene med vilje.
> Sertifiseringene blir i stedet en egen bane med prikker og korte etiketter i den samlede
> tidslinjen (2.1).

**[M]** ~~Når prikkene ligger i den samlede figuren, holder det med en kompakt to-kolonners liste:~~

```
2026  GH-900 GitHub Foundations          2022  Professional Scrum Master I
2022  SC-900 Security, Compliance & Id.  2021  AZ-900 Azure Fundamentals
2017  DASA DevOps Fundamentals           2015  B.Sc. Computer Science, UiB
```

Fra ~420 px til ~100 px. Alternativ: chips med utsteder som tooltip-fri undertekst.

### 2.4 Bransjer som én stablet stolpe

**[M]** Seks separate stolper kan bli én 100 %-stolpe (horisontal, ikke sektor/kake) med en
forklaring under i to kolonner. Setningen «19 år 7 mnd fordelt på 6 bransjer – tyngst i helse»
beholdes som overskrift; den er det beste i seksjonen. ~120 px i stedet for ~420 px.

### 2.5 Ny sidelayout: hovedkolonne + sidespalte

**[M]** Over `lg`: to kolonner, `1fr 260px`. Sidespalten er `sticky` og holder det som er
oppslagsdata, ikke fortelling:

```
┌───────────────────────────────────────────┬──────────────────┐
│ Eirik Sander-Fjeld                        │ ↓ Last ned PDF   │
│ Senior DevOps Engineer og Tech Lead …     │ oppdatert 10-12  │
│ Har ledet og bidratt til etablering …     │                  │
├───────────────────────────────────────────┤ 19 år · 7 arb.g. │
│ [samlet tidslinje 2.1]                    │ 6 bransjer       │
│                                           │                  │
│ [erfaringsliste 2.2]                      │ OMRÅDER          │
│                                           │ Plattform & K8s  │
│                                           │ CI/CD & GitOps … │
│ [sertifiseringer 2.3]                     │                  │
│                                           │ BRANSJER  [2.4]  │
│                                           │ SPRÅK            │
└───────────────────────────────────────────┴──────────────────┘
```

- «Om profilen»-avsnittet flyttes opp i hero, under ingressen. Én PDF-knapp, én dato.
- En faktastripe («19 år · 7 arbeidsgivere · 6 bransjer · 5 sertifiseringer») gir oversikten
  som visualiseringene i dag bruker en hel skjerm på. Tallene utledes i `lib/cv.ts`, ikke
  skrives inn for hånd (jf. «ett datasett per faktum»).
- Under `lg` faller sidespalten under hovedkolonnen, i samme rekkefølge som i dag.
- `.wrap` kan få en bredere variant (~1080 px) bare for /cv.

### 2.6 Mindre ting

- **[M]** `CompetenceSpans` («Områder») er en fjerde tidsakse. I sidespalten kan den bli en
  enkel liste med årsspenn i mono; fylt prikk = i bruk nå. Mini-stolpene på 230 px er vanskelige
  å lese uansett.
- **[M]** Rolleutvikling: setningen under plottet («Linjen stiger ikke jevnt …») er bedre enn
  plottet. Behold den som bildetekst til den samlede figuren.
- **[M]** «NÅ»-merket på Capgemini og «3 oppdrag» på Bouvet er gode – behold dem i listen.

## 3. /ki – høyrestilt radar med tekst rundt

**[F]** Radaren er sentrert, 600 px maks, med legenden i et `grid sm:grid-cols-2` under.
SVG-en er `hidden md:flex` og `aria-hidden`; legenden er innholdet for skjermlesere og mobil.

**[A]** Teknisk forutsetning for alle float-variantene: legenden kan ikke være et grid. Et grid
lager en ny blokk-formateringskontekst og legger seg *ved siden av* floaten som en firkant i
stedet for å flyte rundt den. Legenden må være vanlig blokkflyt (eventuelt `columns`, som også
flyter).

### Alternativ A – float med sirkulær tekstflyt (anbefalt)

```
Verktøy, eksperimenter og hva jeg følger med på.
En levende oversikt over teknologi          ╭──────────╮
jeg bruker i praksis, tester ut, eller    ╭─┤  radar   ├─╮
holder et øye med …                       │ │  ~420px  │ │
BRUKER (6)                                │ ╰──────────╯ │
 1 Claude Code · Agenter                   ╰────────────╯
   Bruker den daglig til agentisk utvikling
 2 GitHub Copilot · Modeller
   Fast følgesvenn i IDE-en …
TESTER (5) …  (full bredde når sirkelen er passert)
```

- `float: right; width: 420px; shape-outside: circle(50%); shape-margin: 1.5rem;` på en wrapper
  rundt SVG-en, kun `md:` og opp.
- Ingressen og første ring («bruker») flyter rundt kurven; resten av legenden får full bredde.
- h1 står over floaten i full bredde, ellers brytes overskriften stygt.
- Legenden går fra to kolonner til én – det er prisen. Til gjengjeld leses den i
  ringrekkefølge, som er naturlig.

### Alternativ B – sticky radar + kobling legende ↔ blip

```
┌ legende (scroller) ─────────────┬ radar (sticky top) ┐
│ BRUKER (6)                      │                    │
│  1 Claude Code       ← hover →  │   ● 1 uthevet      │
│  2 GitHub Copilot               │                    │
│ TESTER (5) …                    │                    │
└─────────────────────────────────┴────────────────────┘
```

- To kolonner, radaren `position: sticky` til høyre. Når man scroller legenden, står radaren
  stille.
- Hover/fokus på en legendepost uthever tilhørende blip med CSS `:has()` – for eksempel
  `.ki:has([data-blip="7"]:is(:hover,:focus-within)) [data-dot="7"]`. Reglene genereres ved
  build fra `content/radar.ts`. Ingen React-state, i tråd med regelen om å utlede fra DOM.
- Mest interaktivt, mest arbeid.

### Alternativ C – radar i hero

- Radaren (~360 px) står til høyre for h1 og ingress i hero; legenden under i full bredde, to
  kolonner som i dag.
- Minst endring. Gir ikke tekstflyt, men løser «høyrestilt» og fjerner det tomme feltet på
  begge sider av radaren.

### Alternativ D – legende per kvadrant rundt radaren

- Fire korte lister plassert i hjørnene rundt radaren (Styring øverst til venstre, Agenter
  øverst til høyre osv.), slik de fleste tech radar-implementasjoner gjør.
- Speiler geometrien godt, men med 16 blips og lange notater blir hjørnene trange på 820 px.
  Passer bedre om notatene skjules bak `<details>`.

**[M]** Jeg ville valgt A for det du beskriver, og eventuelt lagt på hover-koblingen fra B
senere – de utelukker ikke hverandre.

### Små ting på /ki

- **[F]** Kvadrantene er nummerert fortløpende på tvers av ringer, så tallene hopper rundt i
  sirkelen. **[M]** Vurder å farge eller forme blipene etter ring (fylt / ring / stiplet) så
  modenhet leses uten å telle sirkler.
- **[F]** «lagt bort»-ringen er tom og vises bare som en stripe. **[M]** Greit nå; når den får
  innhold, bør legenden vise den med en dempet farge.
- **[F]** Eksperimenter og prinsipper står fint. Prinsipp-blokken er det mest særpregede
  elementet på siden – kan den stå høyere?

## 4. Prioritering

| # | Tiltak | Effekt | Innsats |
|---|---|---|---|
| 1 | Samlet tidslinje (2.1) + tett liste (2.2) | Stor | Middels |
| 2 | Sidespalte og «Om profilen» i hero (2.5) | Stor | Lav–middels |
| 3 | Radar float med `shape-outside` (3A) | Middels | Lav |
| 4 | ~~Sertifiseringer som liste (2.3)~~ – forkastet, inngår i 2.1 | – | – |
| 5 | Bransjer som stablet stolpe (2.4) | Lav–middels | Lav |
| 6 | Hover-kobling legende ↔ blip (3B) | Lav | Middels |

Verifisering etter endringer: `pnpm verify:ui -- --path /cv/ --viewport 360x800` og tilsvarende
for `/ki/` og `1440x900`, så mobil og tab-rekkefølge ikke regresserer.
