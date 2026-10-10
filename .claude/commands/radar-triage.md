---
description: Gå gjennom radar-innboksen og flytt aksepterte fangster inn i content/radar.ts
---

Triage av teknologiradar-innboksen. Fangstene i `content/radar-inbox.jsonl` er
rå URL-er — de har ingen mening før et menneske har bestemt kvadrant, ring og
den ene setningen som sier hvorfor.

## Slik gjør du det

1. Kjør `node scripts/radar-inbox.mjs list` for å se hva som venter.
   Er innboksen tom, si det og stopp.

2. Les `content/radar.ts` først, slik at forslagene dine passer inn i det som
   allerede står der — både kvadrantene, ringene og tonen i notatene.

3. For **hver** fangst, foreslå:
   - `quadrant`: en av `agenter`, `modeller`, `plattform`, `styring`
   - `ring`: en av `bruker`, `tester`, `vurderer`, `lagt-bort`
   - `note`: **én** setning på norsk som sier hvorfor den står i den ringen.
     Ikke en beskrivelse av verktøyet — en begrunnelse.
   - `id`: stabil kebab-case-slug, må ikke kollidere med en eksisterende id
   - `since`: måneden den havner i denne ringen, altså inneværende måned

   Si tydelig at notatet er **ditt utkast**, ikke eierens mening.

4. **Spør om hver enkelt.** Vis forslaget og vent på svar: godta, endre eller
   avvis. Ikke slå sammen flere fangster i ett spørsmål, og ikke anta et ja.

5. Når en fangst er godtatt:
   - legg blipen inn i `blips`-arrayet i `content/radar.ts` med feltene over,
     og `url` satt til fangstens URL
   - kjør `node scripts/radar-inbox.mjs accept <url>`

   Når en fangst er avvist:
   - kjør `node scripts/radar-inbox.mjs reject <url>` — linjen blir stående
     med et `rejected`-felt, så `radar:capture` ser den fortsatt som duplikat
     og den samme URL-en dukker ikke opp igjen

6. Til slutt: kjør `pnpm run typecheck` (som kjører radar-sjekken) og
   `pnpm run build`. Rapporter hva som ble lagt til, hva som ble avvist, og
   hvilke notater eieren bør skrive om i sin egen stemme.

## Dette skal aldri skje

Ingen blip havner i `content/radar.ts` uten at eieren har sett og godkjent
ring og notat. Det finnes ingen «godta alle»-snarvei, og du skal ikke lage en.
Radaren er en mening, ikke en lenkesamling — en blip uten en begrunnelse et
menneske står inne for, er ikke verdt å publisere.
