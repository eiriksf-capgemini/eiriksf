/**
 * CV-innhold. Rediger her – siden /cv genereres fra disse dataene.
 * Datoer som "YYYY-MM"; `to: null` betyr pågående.
 */

export type Job = {
  title: string;
  org: string;
  via?: string;
  from: string;
  to: string | null;
  summary: string[];
  tags: string[];
  /** Vis i kompakt liste nederst i stedet for full oppføring */
  compact?: boolean;
};

export const profile = {
  updated: "2026-10-02",
  intro:
    "Senior DevOps Engineer og Tech Lead med bred erfaring innen plattformutvikling, skyarkitektur, systemintegrasjon og Application Lifecycle Management.",
  about: [
    "Har ledet og bidratt til etablering av moderne utviklerplattformer, Kubernetes-baserte applikasjonsmiljøer, GitOps-leveransemodeller og automatiserte CI/CD-prosesser innen helse, energi, offentlig sektor, finans og forsikring.",
    "Kombinerer sterk teknisk kompetanse med erfaring innen arkitektur, sikkerhet, plattformforvaltning og teamledelse. Har drevet initiativer innen Internal Developer Platforms, DevOps-transformasjon, informasjonssikkerhet og digitalisering av forretningskritiske prosesser.",
    "En rød tråd gjennom karrieren har vært etablering av selvbetjeningsløsninger og plattformkapabiliteter som reduserer manuelt arbeid, standardiserer utviklingsprosesser og gir utviklingsteam større grad av autonomi.",
  ],
  keySkills: [
    "Kubernetes",
    "GitOps",
    "Backstage",
    "Azure",
    "ArgoCD",
    "CI/CD",
    "Infrastructure as Code",
    "Observabilitet",
    "Secrets management",
    "ISO 27001",
    "Sårbarhetsstyring",
    "ALM",
    "Teknisk ledelse",
    "Arkitektur",
    "Python",
    "C#",
  ],
  hot: ["Kubernetes", "GitOps", "Backstage", "Azure"],
};

export const stats = [
  { num: "15", sup: "+", desc: "år i bransjen" },
  { num: "50", sup: "+", desc: "applikasjoner på plattform" },
  { num: "7", sup: "", desc: "utviklingsteam betjent" },
  { num: "<5", sup: "min", desc: "onboarding av ny app" },
];

export const jobs: Job[] = [
  {
    title: "Senior Managing Consultant",
    org: "Capgemini",
    from: "2026-08",
    to: null,
    summary: [
      "Rådgivning innen plattformutvikling, DevOps-transformasjon og utviklerplattformer.",
    ],
    tags: ["Plattform", "DevOps", "Rådgivning"],
  },
  {
    title: "Senior DevOps Engineer",
    org: "Instech Solutions AS",
    from: "2023-09",
    to: "2026-07",
    summary: [
      "Medlem av plattformteamet med ansvar for SAIL, Instechs Kubernetes-baserte applikasjonsplattform (AKS, ArgoCD, CI/CD, observabilitet) som understøttet syv utviklingsteam og 50+ applikasjoner.",
      "Etablerte en selvhostet Backstage-basert Internal Developer Portal som reduserte onboarding av nye applikasjoner fra flere dager til under fem minutter. Utviklet templates som automatiserte opprettelse av repoer, GitOps-konfigurasjon og pipelines, samt egne plugins og scorecards.",
      "Ledet migrering av 30+ applikasjoner fra Azure App Services til AKS, med sanering av fem applikasjoner for å redusere teknisk gjeld. Bidro til ISO 27001-etterlevelse gjennom gap-analyser og implementering av kontroller innen syv områder: tilgang til kildekode, privilegerte tilganger, sårbarhetsstyring, datamaskering, SDLC, secure coding og change management.",
      "Samarbeidet tett med sikkerhetsarkitekt om sårbarhetsstyring (Dependabot, Defender for Cloud, statisk analyse) og secrets management basert på Azure Key Vault og External Secrets Operator.",
    ],
    tags: [
      "Kubernetes",
      "AKS",
      "ArgoCD",
      "Backstage",
      "GitOps",
      "Azure DevOps",
      "Azure Key Vault",
      "Defender for Cloud",
      "ISO 27001",
      "SonarQube",
    ],
  },
  {
    title: "Tech Lead",
    org: "Equinor ASA",
    via: "Sopra Steria",
    from: "2021-09",
    to: "2023-08",
    summary: [
      "Teknisk retning for et autonomt produktteam på syv (UX, frontend, backend, DevOps) med ansvar for forretningskritiske applikasjoner på Equinors Kubernetes-baserte Radix-plattform.",
      "Designet og implementerte Azure-basert infrastruktur, etablerte tekniske standarder og ledet arbeidet med å standardisere og automatisere bygge-, test- og utrullingsprosesser – resultatet var helautomatiserte CI/CD-pipelines for teamets applikasjoner.",
    ],
    tags: ["Azure", "Kubernetes", "CI/CD", "Arkitektur", "Teknisk ledelse", "Radix"],
  },
  {
    title: "Backend-utvikler",
    org: "Bergen kommune",
    from: "2019-01",
    to: "2021-08",
    summary: [
      "Papirløs Forvaltning: automatiserte etablering og vedlikehold av digitale møtebøker for byrådet gjennom integrasjon mellom SharePoint, Microsoft Graph API og OneNote. Løsningen håndterte fire til ti byrådsmøter per måned.",
      "En av to seniorutviklere med ansvar for arkitektur, løsningsdesign og prototyping. Rådgivning og videreutvikling av Microsoft 365-plattformen for 1 000–2 000 brukere.",
    ],
    tags: ["Microsoft Graph", "SharePoint", "OneNote", "Microsoft 365", "Løsningsdesign"],
  },
  {
    title: "Tech Lead",
    org: "Kinect Energy AS",
    from: "2018-03",
    to: "2019-01",
    summary: [
      "Datadrevet plattform for prediksjon og optimalisering av kraftproduksjon fra 39 vindturbiner i to nederlandske vindparker. Kombinerte SCADA-data fra Bazefield med værprognoser for bedre beslutningsstøtte i energihandel.",
      "Ansvar for arkitektur, integrasjonsdesign og databehandlingsflyt. Løsning basert på Python, mikrotjenester og SESAM.IO.",
    ],
    tags: ["Python", "Mikrotjenester", "SCADA", "SESAM.IO", "Data science"],
  },
  {
    title: "Utvikler",
    org: "Bouvet ASA",
    from: "2017-03",
    to: "2018-03",
    compact: true,
    summary: [
      "Rådgivning innen ALM og utviklingsprosesser (TFS), samt utvikling på SharePoint, C# og Microsoft 365.",
    ],
    tags: ["ALM", "TFS", "C#", "SharePoint"],
  },
  {
    title: "DevOps Engineer",
    org: "Helse Vest IKT AS",
    from: "2012-02",
    to: "2017-02",
    compact: true,
    summary: [
      "Ansvar for Application Lifecycle Management: standardisering og automatisering av bygging, testing og utrulling. Systemadministrator for Nødjournalen. Konstituert seksjonsleder apr–okt 2015.",
    ],
    tags: ["ALM", "DevOps", "Ledelse"],
  },
  {
    title: "Koordinator for meldingsflyt",
    org: "Helse Vest IKT AS",
    from: "2010-08",
    to: "2012-02",
    compact: true,
    summary: [
      "Meldingsløftet: kvalitetssikring av elektronisk meldingsutveksling mellom spesialist- og primærhelsetjenesten. PKI, sertifikathåndtering og meldingsstandarder.",
    ],
    tags: ["E-helse", "PKI", "Integrasjon"],
  },
  {
    title: "Operational Engineer",
    org: "Telenor Nordic ASA",
    from: "2007-03",
    to: "2010-08",
    compact: true,
    summary: [
      "Døgnkontinuerlig overvåking og feilhåndtering av Telenors tjenesteplattform. Spesialist på e-post/samhandling, webhosting og SSL-sertifikater.",
    ],
    tags: ["Drift", "Incident management", "Exchange"],
  },
];

export const certifications = [
  { year: "2026", title: "GH-900: GitHub Foundations", by: "Pearson VUE" },
  { year: "2022", title: "Professional Scrum Master I", by: "Scrum.org" },
  { year: "2022", title: "SC-900 Security, Compliance & Identity", by: "Microsoft" },
  { year: "2021", title: "AZ-900 Azure Fundamentals", by: "Microsoft" },
  { year: "2017", title: "DASA DevOps Fundamentals", by: "DASA" },
];

export const education = [
  { year: "2015", title: "B.Sc. Computer Science", by: "Universitetet i Bergen" },
  { year: "1999", title: "Fagbrev Maritim Serviceelektronikk", by: "Bergen Maritime VGS" },
];

export const areas: { name: string; level: 1 | 2 | 3 | 4 | 5 }[] = [
  { name: "Plattform & Kubernetes", level: 5 },
  { name: "CI/CD & GitOps", level: 5 },
  { name: "Azure", level: 4 },
  { name: "Sikkerhet & compliance", level: 4 },
  { name: "Teknisk ledelse", level: 4 },
  { name: "Utvikling (C#/Python)", level: 3 },
];

export const languages = [
  { name: "Norsk", level: "morsmål" },
  { name: "Engelsk", level: "flytende" },
];
