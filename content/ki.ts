/** Teknologiradar og eksperimenter for /ki. Rediger fritt. */

export type RadarItem = { name: string; note: string };

export const radar: { title: string; sub: string; items: RadarItem[] }[] = [
  {
    title: "Bruker",
    sub: "i produksjon",
    items: [
      { name: "Claude Code", note: "agentisk utvikling" },
      { name: "GitHub Copilot", note: "IDE" },
      { name: "Backstage", note: "IDP" },
      { name: "ArgoCD", note: "GitOps" },
      { name: "External Secrets Operator", note: "secrets" },
      { name: "Terraform / Bicep", note: "IaC" },
    ],
  },
  {
    title: "Tester",
    sub: "eksperiment",
    items: [
      { name: "MCP-servere mot interne verktøy", note: "ki" },
      { name: "KI-agenter i CI-pipelines", note: "ki" },
      { name: "Crossplane", note: "plattform" },
      { name: "Kyverno policy-as-code", note: "sikkerhet" },
      { name: "OpenTelemetry end-to-end", note: "observabilitet" },
    ],
  },
  {
    title: "Følger med på",
    sub: "radar",
    items: [
      { name: "Platform engineering-standarder", note: "CNCF" },
      { name: "Lokale modeller på egen infrastruktur", note: "ki" },
      { name: "Sikkerhet i agentiske systemer", note: "ki · sikkerhet" },
      { name: "EU AI Act i praksis", note: "regulering" },
      { name: "WebAssembly i Kubernetes", note: "runtime" },
    ],
  },
];

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
