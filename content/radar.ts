/**
 * Teknologiradar som én flat, typet liste av "blips".
 *
 * Hver blip har en stabil id (endres aldri), en kvadrant (domene) og en ring
 * (modenhet/tillit). Å flytte en blip til en annen ring er en ett-ords diff:
 * endre `ring` (og `since`), ingenting annet.
 *
 * Om `since`: migrerte blips har ingen historiske datoer å hente fra – den
 * gamle `content/ki.ts`-strukturen hadde bare tre kolonner uten tidsstempel.
 * For å unngå å dikte opp presise datoer vi ikke kan stå inne for, bruker alle
 * 16 migrerte blips samme måned: 2026-10, måneden git-historikken viser at
 * radardataene først ble lagt inn i repoet (commit 62f72e3, 2. okt 2026). Det
 * er altså et bevisst, dokumentert placeholder-tidsstempel – ikke en påstand
 * om når hvert enkelt verktøy faktisk havnet i sin ring. Eier bør oppdatere
 * `since` etter hvert som ringer faktisk endres fremover.
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

const MIGRATED_SINCE = "2026-10";

export const blips: Blip[] = [
  // --- tidligere "Bruker" (i produksjon) → ring: bruker ---
  {
    id: "claude-code",
    name: "Claude Code",
    quadrant: "agenter",
    ring: "bruker",
    since: MIGRATED_SINCE,
    note: "I daglig bruk for agentisk utvikling; dekker det meste av kodeoppgavene nå.",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    quadrant: "modeller",
    ring: "bruker",
    since: MIGRATED_SINCE,
    note: "Fast IDE-følgesvenn for kodefullføring og chat i det daglige.",
  },
  {
    id: "backstage",
    name: "Backstage",
    quadrant: "plattform",
    ring: "bruker",
    since: MIGRATED_SINCE,
    note: "Kjører som intern utviklerportal (IDP) i produksjon.",
  },
  {
    id: "argocd",
    name: "ArgoCD",
    quadrant: "plattform",
    ring: "bruker",
    since: MIGRATED_SINCE,
    note: "Driver GitOps-utrulling i produksjon og har vært stabilt lenge.",
  },
  {
    id: "external-secrets-operator",
    name: "External Secrets Operator",
    quadrant: "plattform",
    ring: "bruker",
    since: MIGRATED_SINCE,
    note: "Håndterer hemmeligheter i klyngene i produksjon.",
  },
  {
    id: "terraform-bicep",
    name: "Terraform / Bicep",
    quadrant: "plattform",
    ring: "bruker",
    since: MIGRATED_SINCE,
    note: "Standard IaC-verktøy for infrastruktur i produksjon.",
  },

  // --- tidligere "Tester" (eksperiment) → ring: tester ---
  {
    id: "mcp-servere-interne-verktoy",
    name: "MCP-servere mot interne verktøy",
    quadrant: "plattform",
    ring: "tester",
    since: MIGRATED_SINCE,
    note: "Utforsker MCP som grensesnitt mot interne verktøy, ikke modnet til bruk ennå.",
  },
  {
    id: "ki-agenter-ci-pipelines",
    name: "KI-agenter i CI-pipelines",
    quadrant: "agenter",
    ring: "tester",
    since: MIGRATED_SINCE,
    note: "Prøver ut agenter som vurderer og handler i CI, men uten fullt tillit ennå.",
  },
  {
    id: "crossplane",
    name: "Crossplane",
    quadrant: "plattform",
    ring: "tester",
    since: MIGRATED_SINCE,
    note: "Evaluerer som mulig supplement til dagens plattformverktøy.",
  },
  {
    id: "kyverno-policy-as-code",
    name: "Kyverno policy-as-code",
    quadrant: "styring",
    ring: "tester",
    since: MIGRATED_SINCE,
    note: "Tester policy-as-code for å håndheve sikkerhetsregler automatisk.",
  },
  {
    id: "opentelemetry-end-to-end",
    name: "OpenTelemetry end-to-end",
    quadrant: "plattform",
    ring: "tester",
    since: MIGRATED_SINCE,
    note: "Prøver ende-til-ende sporing, men dekningen er ikke komplett nok for produksjon.",
  },

  // --- tidligere "Følger med på" (radar) → ring: vurderer ---
  {
    id: "platform-engineering-standarder",
    name: "Platform engineering-standarder",
    quadrant: "plattform",
    ring: "vurderer",
    since: MIGRATED_SINCE,
    note: "Følger CNCF-arbeidet på platform engineering uten å ha tatt stilling ennå.",
  },
  {
    id: "lokale-modeller-egen-infrastruktur",
    name: "Lokale modeller på egen infrastruktur",
    quadrant: "modeller",
    ring: "vurderer",
    since: MIGRATED_SINCE,
    note: "Vurderer lokal modellhosting, men har ikke et konkret behov som krever det ennå.",
  },
  {
    id: "sikkerhet-agentiske-systemer",
    name: "Sikkerhet i agentiske systemer",
    quadrant: "styring",
    ring: "vurderer",
    since: MIGRATED_SINCE,
    note: "Følger med på sikkerhetsrisiko i agentiske systemer før de tas i bruk i større skala.",
  },
  {
    id: "eu-ai-act-i-praksis",
    name: "EU AI Act i praksis",
    quadrant: "styring",
    ring: "vurderer",
    since: MIGRATED_SINCE,
    note: "Vurderer hvordan regelverket slår ut i praksis før noe endres.",
  },
  {
    id: "webassembly-kubernetes",
    name: "WebAssembly i Kubernetes",
    quadrant: "plattform",
    ring: "vurderer",
    since: MIGRATED_SINCE,
    note: "Følger med på WASM-runtime i Kubernetes som en mulig fremtidig retning.",
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
  const grouped = Object.fromEntries(QUADRANTS.map((quadrant) => [quadrant, [] as Blip[]])) as Record<
    Quadrant,
    Blip[]
  >;
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
  return source.filter((blip) => blip.ring === "tester").sort((a, b) => b.since.localeCompare(a.since));
}

/** Den nyeste `since`-datoen blant alle blips, til bruk som "oppdatert"-dato. */
export function newestSince(source: readonly Blip[] = blips): string | undefined {
  return source.reduce<string | undefined>(
    (newest, blip) => (newest === undefined || blip.since > newest ? blip.since : newest),
    undefined,
  );
}
