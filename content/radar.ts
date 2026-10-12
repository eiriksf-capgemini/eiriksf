/**
 * Teknologiradar som én flat, typet liste av "blips".
 *
 * Hver blip har en stabil id (endres aldri), en kvadrant (domene) og en ring
 * (modenhet/tillit). Å flytte en blip til en annen ring er en ett-ords diff:
 * endre `ring` (og `since`), ingenting annet.
 *
 * Om `since`: fire av de seksten blipsene er datert ut fra faktiske kilder i
 * repoet - oppdragsperioden i `content/cv.ts` og et datert innlegg under
 * `content/innlegg/`. To til er utledet av samme innlegg uten at det sier det
 * rett ut, og er merket `bekreft` på linja så de ikke forveksles med de
 * dokumenterte. Alle seks har kilden notert i en kommentar. De ti øvrige står på 2026-10, måneden radaren ble opprettet (commit
 * 62f72e3, 2. oktober 2026). Det er ikke en plassholder lenger: eier har tatt
 * stilling til det og sier at for disse verktøyene er det da de kom inn på
 * radaren som er den datoen vi kan stå inne for. Finnes det en mer presis
 * måned senere, settes den. Ellers settes `since` på nytt hver gang en blip
 * faktisk bytter ring.
 */

export const QUADRANTS = ["agenter", "modeller", "plattform", "styring"] as const;
export const RINGS = ["bruker", "tester", "vurderer", "lagt-bort"] as const;

export type Quadrant = (typeof QUADRANTS)[number];
export type Ring = (typeof RINGS)[number];

export type Blip = {
  id: string; // stabil slug — endres aldri, selv om navnet gjør det
  name: string;
  quadrant: Quadrant;
  ring: Ring;
  since: string; // YYYY-MM: da den havnet i DENNE ringen
  note: string; // én setning: hvorfor står den her
  url?: string;
  source?: string;
  history?: { ring: Ring; at: string }[];
};

export const blips: Blip[] = [
  // --- tidligere "Bruker" (i produksjon) → ring: bruker ---
  {
    id: "claude-code",
    name: "Claude Code",
    quadrant: "agenter",
    ring: "bruker",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Bruker den daglig til agentisk utvikling; den tar unna det meste av kodingen.",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    quadrant: "modeller",
    ring: "bruker",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Fast følgesvenn i IDE-en for kodefullføring og chat, brukt hver dag.",
  },
  {
    id: "backstage",
    name: "Backstage",
    quadrant: "plattform",
    ring: "bruker",
    since: "2023-09", // fra content/cv.ts: Instech-oppdraget fra 2023-09
    note: "Satte den opp som selvhostet utviklerportal; dekker katalog og selvbetjening.",
  },
  {
    id: "argocd",
    name: "ArgoCD",
    quadrant: "plattform",
    ring: "bruker",
    since: "2023-09", // fra content/cv.ts: Instech-oppdraget fra 2023-09
    note: "Driver GitOps-utrulling i produksjon og har aldri gitt grunn til å bytte.",
  },
  {
    id: "external-secrets-operator",
    name: "External Secrets Operator",
    quadrant: "plattform",
    ring: "bruker",
    since: "2023-09", // fra content/cv.ts: Instech-oppdraget fra 2023-09
    note: "Håndterer hemmeligheter i klyngene, satt opp mot Azure Key Vault.",
  },
  {
    id: "terraform-bicep",
    name: "Terraform / Bicep",
    quadrant: "plattform",
    ring: "bruker",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Standardverktøyet mitt for infrastruktur som kode i produksjon.",
  },

  // --- tidligere "Tester" (eksperiment) → ring: tester ---
  {
    id: "mcp-servere-interne-verktoy",
    name: "MCP-servere mot interne verktøy",
    quadrant: "plattform",
    ring: "tester",
    since: "2026-09", // antatt ut fra samme innlegg (2026-09-07) – bekreft
    note: "Utforsker MCP som grensesnitt mot interne verktøy; ikke modent til bruk ennå.",
  },
  {
    id: "ki-agenter-ci-pipelines",
    name: "KI-agenter i CI-pipelines",
    quadrant: "agenter",
    ring: "tester",
    since: "2026-08", // fra eksperimentet "Automatisk triage av Dependabot-PR-er" (2026-08)
    note: "Piloterer en agent som vurderer risiko i CI; stoler ikke blindt på den ennå.",
  },
  {
    id: "crossplane",
    name: "Crossplane",
    quadrant: "plattform",
    ring: "tester",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Evaluerer den som mulig supplement til dagens plattformverktøy.",
  },
  {
    id: "kyverno-policy-as-code",
    name: "Kyverno policy-as-code",
    quadrant: "styring",
    ring: "tester",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Tester policy-as-code, men har ikke rullet det ut i full bredde.",
  },
  {
    id: "opentelemetry-end-to-end",
    name: "OpenTelemetry end-to-end",
    quadrant: "plattform",
    ring: "tester",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Prøver ende-til-ende sporing; dekningen er for tynn for produksjon ennå.",
  },

  // --- tidligere "Følger med på" (radar) → ring: vurderer ---
  {
    id: "platform-engineering-standarder",
    name: "Platform engineering-standarder",
    quadrant: "plattform",
    ring: "vurderer",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Følger CNCF-arbeidet uten å ha tatt stilling til hva jeg bør bruke selv.",
  },
  {
    id: "lokale-modeller-egen-infrastruktur",
    name: "Lokale modeller på egen infrastruktur",
    quadrant: "modeller",
    ring: "vurderer",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Vurderer lokal modellhosting, men har ikke et behov som krever det ennå.",
  },
  {
    id: "sikkerhet-agentiske-systemer",
    name: "Sikkerhet i agentiske systemer",
    quadrant: "styring",
    ring: "vurderer",
    since: "2026-09", // antatt ut fra innlegget om dokumentasjon og KI (2026-09-07) – bekreft
    note: "Følger sikkerhetsrisikoen før jeg tar agenter i bruk i større skala.",
  },
  {
    id: "eu-ai-act-i-praksis",
    name: "EU AI Act i praksis",
    quadrant: "styring",
    ring: "vurderer",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Vurderer hvordan regelverket slår ut i praksis før jeg endrer noe.",
  },
  {
    id: "webassembly-kubernetes",
    name: "WebAssembly i Kubernetes",
    quadrant: "plattform",
    ring: "vurderer",
    since: "2026-10", // da radaren ble opprettet; ingen mer presis måned kjent
    note: "Følger WASM-runtime i Kubernetes som mulig retning; ikke prøvd i praksis.",
  },

  // Ingen blips er lagt til "lagt-bort" (hold) ennå — det finnes ikke noe
  // reelt droppet verktøy i kildedataene, og vi dikter ikke opp ett.
];

/** Grupperer blips per ring. Alle fire ringer er alltid til stede som nøkler. */
export function blipsByRing(source: readonly Blip[] = blips): Record<Ring, Blip[]> {
  const grouped = Object.fromEntries(RINGS.map((ring) => [ring, [] as Blip[]])) as Record<
    Ring,
    Blip[]
  >;
  for (const blip of source) {
    grouped[blip.ring].push(blip);
  }
  return grouped;
}

/** Grupperer blips per kvadrant. Alle fire kvadranter er alltid til stede som nøkler. */
export function blipsByQuadrant(source: readonly Blip[] = blips): Record<Quadrant, Blip[]> {
  const grouped = Object.fromEntries(
    QUADRANTS.map((quadrant) => [quadrant, [] as Blip[]]),
  ) as Record<Quadrant, Blip[]>;
  for (const blip of source) {
    grouped[blip.quadrant].push(blip);
  }
  return grouped;
}

/**
 * Blips i "tester"-ringen, sortert etter `since` synkende (nyeste først).
 * Dette er datagrunnlaget forsiden-stripen skal konsumere direkte.
 */
export function testBlipsBySinceDesc(source: readonly Blip[] = blips): Blip[] {
  return source
    .filter((blip) => blip.ring === "tester")
    .sort((a, b) => b.since.localeCompare(a.since));
}

/** Den nyeste `since`-datoen blant alle blips, til bruk som "oppdatert"-dato. */
export function newestSince(source: readonly Blip[] = blips): string | undefined {
  return source.reduce<string | undefined>(
    (newest, blip) => (newest === undefined || blip.since > newest ? blip.since : newest),
    undefined,
  );
}
