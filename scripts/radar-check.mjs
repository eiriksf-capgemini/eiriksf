// Validerer radardata før typecheck og build, slik at ødelagte eller foreldede
// data feiler høylytt i stedet for å snike seg med i en build.
//
// Kjøres automatisk før typecheck/build via pre*-scripts i package.json
// (se `pretypecheck`/`prebuild`), på samme måte som generate:theme-init.
//
// Datafilen (content/radar.ts) er TypeScript, men inneholder ingen imports og
// ingen TS-konstruksjoner ut over `as const` og typealiaser – såkalt
// "erasable syntax". Derfor kan Node laste den direkte som et ES-modul med
// typene strippet bort (stabilt i Node >=22.18/23.6, og eksplisitt slått på
// her med --experimental-strip-types for å virke likt på tvers av Node-
// versjoner, inkl. node:22-alpine i Dockerfile). Det er langt mer robust enn
// å regex-parse kildekoden selv, og gir oss de faktiske, evaluerte verdiene
// (inkludert ev. beregnede felter) i stedet for en tekstlig tilnærming.
//
// Reglene som sjekkes (se esf-btl.4):
//   - alle id-er er unike
//   - `since` er en parseable YYYY-MM-dato som ikke ligger i fremtiden
//   - `note` er ikke-tom og under 90 tegn
//   - ingen to blips har samme `name`
//   - (ikke-fatal) advarsel hvis ingen blip har byttet ring de siste 120
//     dagene
//
// Scriptet tar imot en valgfri filsti som argument (brukt av tester/fixtures
// til å peke på andre datafiler enn content/radar.ts).
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const MAX_NOTE_LENGTH = 90;
const STALE_AFTER_DAYS = 120;
const SINCE_PATTERN = /^(\d{4})-(\d{2})$/;

const targetArg = process.argv[2] ?? "content/radar.ts";
const targetPath = resolve(process.cwd(), targetArg);

let moduleExports;
try {
  moduleExports = await import(pathToFileURL(targetPath).href);
} catch (error) {
  console.error(`[radar-check] Klarte ikke å laste ${targetArg}: ${error.message}`);
  process.exit(1);
}

const blips = moduleExports.blips;
if (!Array.isArray(blips)) {
  console.error(`[radar-check] Fant ingen eksportert \`blips\`-liste i ${targetArg}`);
  process.exit(1);
}

const errors = [];
function reportError(rule, label, detail) {
  errors.push(`[radar-check] ${rule}: "${label}" – ${detail}`);
}

// --- unike id-er ---
const byId = new Map();
for (const blip of blips) {
  const group = byId.get(blip.id) ?? [];
  group.push(blip);
  byId.set(blip.id, group);
}
for (const [id, group] of byId) {
  if (group.length > 1) {
    const names = group.map((b) => b.name).join(", ");
    reportError("duplicate-id", id, `id brukes av ${group.length} blips: ${names}`);
  }
}

// --- unike navn ---
const byName = new Map();
for (const blip of blips) {
  const group = byName.get(blip.name) ?? [];
  group.push(blip);
  byName.set(blip.name, group);
}
for (const [name, group] of byName) {
  if (group.length > 1) {
    const ids = group.map((b) => b.id).join(", ");
    reportError("duplicate-name", name, `navnet brukes av ${group.length} blips: ${ids}`);
  }
}

// --- `since`: parseable YYYY-MM, ikke i fremtiden ---
const now = new Date();
const currentYearMonth = now.getUTCFullYear() * 12 + now.getUTCMonth();

/** Parser en "YYYY-MM"-streng. Returnerer null hvis den er ugyldig. */
function parseSince(since) {
  if (typeof since !== "string") return null;
  const match = SINCE_PATTERN.exec(since);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month, yearMonth: year * 12 + (month - 1) };
}

const validSinceByBlip = new Map();
for (const blip of blips) {
  const parsed = parseSince(blip.since);
  if (!parsed) {
    reportError("invalid-since", blip.id ?? blip.name, `"${blip.since}" er ikke en gyldig YYYY-MM-dato`);
    continue;
  }
  if (parsed.yearMonth > currentYearMonth) {
    reportError("future-since", blip.id ?? blip.name, `"${blip.since}" ligger i fremtiden`);
    continue;
  }
  validSinceByBlip.set(blip, parsed);
}

// --- notat: ikke-tomt og under MAX_NOTE_LENGTH tegn ---
for (const blip of blips) {
  const note = blip.note;
  const label = blip.id ?? blip.name;
  if (typeof note !== "string" || note.trim().length === 0) {
    reportError("empty-note", label, "notatet mangler eller er tomt");
  } else if (note.length >= MAX_NOTE_LENGTH) {
    reportError("note-too-long", label, `notatet er ${note.length} tegn, grensen er ${MAX_NOTE_LENGTH}`);
  }
}

if (errors.length > 0) {
  for (const message of errors) {
    console.error(message);
  }
  console.error(`[radar-check] ${errors.length} feil funnet i ${targetArg}.`);
  process.exit(1);
}

// --- ikke-fatal: advarsel hvis ingen blip har byttet ring de siste 120 dagene ---
// Vi bruker den nyeste gyldige `since`-datoen blant alle blips. Vi tolker
// YYYY-MM som den 1. i måneden (tidligst mulig faktisk dato i den måneden),
// slik at vi heller advarer én dag for tidlig enn for sent.
let newestSinceDate;
for (const parsed of validSinceByBlip.values()) {
  const date = Date.UTC(parsed.year, parsed.month - 1, 1);
  if (newestSinceDate === undefined || date > newestSinceDate) {
    newestSinceDate = date;
  }
}

if (newestSinceDate !== undefined) {
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysSinceChange = Math.floor((todayUTC - newestSinceDate) / (24 * 60 * 60 * 1000));
  if (daysSinceChange >= STALE_AFTER_DAYS) {
    console.error(
      `[radar-check] ADVARSEL: ingen blip har byttet ring de siste ${daysSinceChange} dagene (grense: ${STALE_AFTER_DAYS}). Radaren kan være foreldet.`,
    );
  }
}

console.log(`[radar-check] OK (${blips.length} blips, ${targetArg})`);
