# UI-verifiseringsharness (esf-07k.1)

Et lite, gjenbrukbart verktøy for å kjøre nettleserbaserte aksepttester mot den
statiske eksporten i `out/`, slik at beads med krav som "sjekk scrollbredde
ved 360px", "dump aksesibilitetstreet", "kjør axe-core" eller "følg
tab-rekkefølgen" kan verifiseres med én kommando i stedet for at noen bygger
et engangsskript med Puppeteer/Playwright hver gang (jf. esf-2b9).

## Hvorfor denne mappen har sin egen `package.json`

Avhengighetene her (`playwright`, `axe-core`) er **bevisst holdt utenfor**
rot-`package.json`:

- Dockerfilets `deps`-steg kjører `pnpm install --frozen-lockfile` kun basert
  på rot-`package.json`/`pnpm-lock.yaml`. En nøstet manifest her blir aldri
  sett, lastet ned eller installert av det bygget – uansett.
- `tools/verify-ui/` står i `.dockerignore`, så selv om noen kjører
  `docker build` fra en arbeidsmappe der denne mappens `node_modules`
  (inkludert en nedlastet Chromium-binær) allerede finnes lokalt, blir den
  aldri sendt inn i build-konteksten.
- Playwright (≥1.4x) laster **ikke** ned en nettleser automatisk ved
  `pnpm install` lenger – det er et eget, eksplisitt steg
  (`playwright install chromium`). Vi er likevel eksplisitte med egen mappe
  og `.dockerignore`-oppføring i stedet for å stole på at det alltid forblir
  sånn.

Resultat: avhengigheten kan aldri bli en prod-avhengighet, og nettleseren kan
aldri havne i et Docker-lag, uten at noen aktivt endrer denne isolasjonen.

## Oppsett (én gang per maskin)

```bash
pnpm run verify:ui:setup            # installerer playwright + axe-core her
pnpm run verify:ui:install-browser  # laster ned Chromium til ~/.cache (ikke node_modules)
```

Uten browser-steget feiler `pnpm verify:ui` med en forklarende feilmelding
(ikke en stacktrace) som ber deg kjøre kommandoen over.

## Bruk

```bash
pnpm build                                   # lag out/ først
pnpm verify:ui -- --path /cv/ --viewport 360x800 --selectors "h1,nav"
```

Valg:

| Flagg         | Beskrivelse                                              | Default      |
| ------------- | --------------------------------------------------------- | ------------ |
| `--path`      | Side å besøke, f.eks. `/cv/`, `/ki/`, `/innlegg/<slug>/`   | `/`          |
| `--viewport`  | `BREDDExHØYDE`, f.eks. `360x800`                           | `1280x800`   |
| `--tab-steps` | Antall `Tab`-trykk som registreres                         | `20`         |
| `--selectors` | Kommaseparerte CSS-selektorer for geometrisjekk            | (ingen)      |
| `--json`      | Skriv rapporten som JSON i stedet for tekst                | av           |

Rapporten inneholder, i rekkefølge: scrollbredde (overflow ja/nei), axe-core
sine brudd, tastaturrekkefølgen med `document.activeElement` per steg,
elementgeometri (`getBoundingClientRect`) for oppgitte selektorer, og et
ARIA-snapshot av siden (aksesibilitetstreet) – i et format som kan limes rett
inn i en close reason.

Harnesset vurderer **ikke** selv om funnene er greie eller ikke (f.eks. om et
axe-brudd faktisk er en regresjon). Det er opp til hver bead som bruker det.

## Hva som ikke er i scope

- Selve akseptkriteriene/assertions for den enkelte bead.
- Lighthouse-gaten (`.lighthouserc.json`) – uendret, kjører separat i CI.
- Å kjøre automatisk som del av `pnpm build`/`pnpm dev` – harnesset er
  bevisst opt-in og wires ikke inn i noen `pre*`-hook.
