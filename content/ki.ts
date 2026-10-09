/**
 * Eksperimenter og prinsipper for /ki.
 *
 * Teknologiradaren som tidligere lå her som `radar` er migrert til
 * `content/radar.ts` som en flat, typet liste av blips (se den filen for
 * datamodell og utvalgsfunksjoner). Rediger fritt.
 */

export const experiments = [
  {
    title: "Backstage-plugin som genererer onboarding-dokumentasjon med KI",
    desc: "Leser katalogmetadata, GitOps-konfig og README-er og lager et første utkast til tjenestedokumentasjon.",
    status: "fungerende prototype",
    date: "2026-09",
  },
  {
    title: "Automatisk triage av Dependabot-PR-er",
    desc: "Agent som vurderer risiko, kjører tester og foreslår merge-rekkefølge for sårbarhetsoppdateringer.",
    status: "pilot på to repoer",
    date: "2026-08",
  },
  {
    title: "Denne nettsiden",
    desc: "Next.js med statisk eksport, Tailwind og MDX. Ingen editor, ingen database – innhold er filer i Git og kjører i en liten nginx-container.",
    status: "pågår",
    date: "2026-10",
  },
];

export const principles = [
  { k: "selvbetjening", v: "KI skal fjerne køer, ikke lage nye" },
  { k: "sporbarhet", v: "alt en agent gjør skal være en PR" },
  { k: "minste tilgang", v: "agenter får samme rammer som mennesker" },
  { k: "mennesket", v: "godkjenner, forstår, eier resultatet" },
  { k: "målbart", v: "tid spart > demo-faktor" },
];
