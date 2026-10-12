/**
 * Utledede verdier for CV-siden. content/cv.ts holder fakta – her regnes
 * arbeidsgivere, bransjeår og spenn ut, slik at hver grafikk leser samme
 * kilde i stedet for å telle på nytt selv.
 *
 * Måneder telles eksklusivt (sluttmåned ikke medregnet), slik at summen av
 * oppdrag pluss hull blir nøyaktig karrierespennet. Visningen av varighet
 * per jobb på /cv teller inklusivt – det er en bevisst forskjell.
 */
import {
  certifications,
  education,
  jobs,
  ROLE_LEVELS,
  roleLevelRank,
  SECTORS,
  statsFigures,
  type Competence,
  type Job,
  type RoleLevel,
  type Sector,
} from "@/content/cv";

const MND = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];

/** "YYYY-MM" → antall måneder siden år 0. Gir sammenlignbare tall. */
export function toMonths(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

/** Inneværende måned som "YYYY-MM". Fryses ved bygg – siden er statisk. */
export function currentYm(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Antall måneder i et spenn. `to: null` betyr fram til nå. */
export function spanMonths(from: string, to: string | null): number {
  return toMonths(to ?? currentYm()) - toMonths(from);
}

/** 235 → "19 år 7 mnd" */
export function monthsLabel(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} år` : "", m ? `${m} mnd` : ""].filter(Boolean).join(" ") || "0 mnd";
}

/** "2021-09" → "sep 2021" */
export function formatYm(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MND[m - 1]} ${y}`;
}

/** [{2012-02 → 2018-03}, {2021-09 → nå}] → "2012–2018 · 2021–nå" */
export function formatSpans(spans: Competence["spans"]): string {
  return spans.map((s) => `${s.from.slice(0, 4)}–${s.to ? s.to.slice(0, 4) : "nå"}`).join(" · ");
}

export const careerStart = jobs.reduce((min, j) => (j.from < min ? j.from : min), jobs[0].from);
export const careerEnd = jobs.some((j) => j.to === null)
  ? null
  : jobs.reduce((max, j) => (j.to! > max ? j.to! : max), jobs[0].to!);
export const careerMonths = spanMonths(careerStart, careerEnd);

/**
 * Arbeidsgivere, eldst først. Konsulentoppdrag grupperes på arbeidsgiver
 * (`via`), ikke på kunde – ellers ville tidslinjen vist Bouvet tre ganger.
 */
export type Employer = {
  name: string;
  from: string;
  to: string | null;
  months: number;
  jobs: Job[];
};

export const employers: Employer[] = (() => {
  const byName = new Map<string, Job[]>();
  for (const job of jobs) {
    const key = job.via ?? job.org;
    byName.set(key, [...(byName.get(key) ?? []), job]);
  }
  return [...byName.entries()]
    .map(([name, group]) => {
      const from = group.reduce((min, j) => (j.from < min ? j.from : min), group[0].from);
      const ongoing = group.some((j) => j.to === null);
      const to = ongoing
        ? null
        : group.reduce((max, j) => (j.to! > max ? j.to! : max), group[0].to!);
      return { name, from, to, months: spanMonths(from, to), jobs: group };
    })
    .sort((a, b) => a.from.localeCompare(b.from));
})();

/** Måneder per bransje. Summen pluss `gapMonths` er hele karrierespennet. */
export const sectorMonths: Record<Sector, number> = SECTORS.reduce(
  (acc, sector) => {
    acc[sector] = jobs
      .filter((j) => j.sector === sector)
      .reduce((sum, j) => sum + spanMonths(j.from, j.to), 0);
    return acc;
  },
  {} as Record<Sector, number>,
);

/** Bransjer med tid, største først. Bransjer uten tid faller ut. */
export const sectorsByTime = SECTORS.map((sector) => ({
  sector,
  months: sectorMonths[sector],
}))
  .filter((s) => s.months > 0)
  .sort((a, b) => b.months - a.months);

/** Måneder mellom oppdrag – jobbskifter som ikke faller på samme måned. */
export const gapMonths = careerMonths - Object.values(sectorMonths).reduce((sum, m) => sum + m, 0);

/** Hele år i bransjen, utledet fra første jobb. Én kilde, to visningssteder. */
export const careerYears = Math.floor(careerMonths / 12);

/** Nøkkeltall for forsiden. Første tall utledes, resten er innhold. */
export const stats = [
  { num: String(careerYears), sup: "+", desc: "år i bransjen" },
  ...statsFigures,
];

/**
 * Nøkkeltall for sidespalten på /cv (esf-7qk.3). Alle fire utledes av
 * content/cv.ts, ingen av dem skrives for hånd: et tall som er tastet inn blir
 * stående når dataene endrer seg, og esf-hnd.11 var nettopp det - år i
 * bransjen hadde glidd fra virkeligheten.
 */
export const cvKeyFigures: { value: string; label: string }[] = [
  { value: `${careerYears}+`, label: "år i bransjen" },
  { value: String(employers.length), label: "arbeidsgivere" },
  { value: String(sectorsByTime.length), label: "bransjer" },
  {
    value: String(certifications.length + education.length),
    label: "sertifiseringer og grader",
  },
];

/**
 * Felles akse for den samlede tidslinjen (esf-7qk.1). Flyttet hit fra de tre
 * grafikkene som før tegnet hver sin akse – nå finnes pos()-regnestykket og
 * femårsmerkene bare ett sted, konsumert av CareerTimeline alene.
 */
const AXIS_START = toMonths(careerStart);

/** Posisjon på den felles tidsaksen (careerStart → nå) som prosent, 0–100. */
export function axisPosition(ym: string): number {
  return ((toMonths(ym) - AXIS_START) / careerMonths) * 100;
}

/** Startåret pluss femårsmerker. Annethvert merke skjules under md: på
 *  360 px kolliderer "2025" med "nå". */
export function axisTicks(): { label: string; left: number; mobile: boolean }[] {
  const firstYear = Number(careerStart.slice(0, 4));
  const lastYear = new Date().getFullYear();
  const out = [{ label: String(firstYear), left: 0, mobile: true }];
  for (let y = Math.ceil(firstYear / 5) * 5; y < lastYear; y += 5) {
    out.push({ label: String(y), left: axisPosition(`${y}-01`), mobile: (y / 5) % 2 === 0 });
  }
  return out;
}

/**
 * Rollenivå som skalert feltstyrke (0.28–1) i arbeidsgiverbanene. Rang 1
 * (Drift) er lysest, rang 5 (Teknisk ledelse) er mørkest. Erstatter
 * RoleProgression sine egne baner – nivået vises nå som intensitet inni
 * arbeidsgiverbanen i stedet for en egen trapp over dem.
 */
export function roleLevelOpacity(level: RoleLevel): number {
  const rank = roleLevelRank(level); // 1..ROLE_LEVELS.length
  const steps = ROLE_LEVELS.length - 1;
  return 0.28 + (rank - 1) * (0.72 / steps);
}

/** Korte etiketter ved prikkene i sertifiserings-/utdanningsbanen – samme
 *  tekst som fulltittelen, bare forkortet så den får plass ved siden av
 *  prikken. Ren presentasjon, ingen ny CV-fakta. */
const CREDENTIAL_SHORT_LABEL: Record<string, string> = {
  "GH-900: GitHub Foundations": "GH-900",
  "Professional Scrum Master I": "PSM I",
  "SC-900 Security, Compliance & Identity": "SC-900",
  "AZ-900 Azure Fundamentals": "AZ-900",
  "DASA DevOps Fundamentals": "DASA",
  "B.Sc. Computer Science": "B.Sc.",
  "Fagbrev Maritim Serviceelektronikk": "Fagbrev",
};

export type CredentialMark = {
  key: string;
  title: string;
  by: string;
  when: string;
  short: string;
  /** Null når merket ligger helt før aksen starter. */
  at: string | null;
  /** Startpunkt for et spenn (utdanning). Kan ligge før aksen. */
  from?: string;
};

/**
 * Sertifiseringer og utdanning som merker på den felles tidsaksen, nyest
 * først. Flyttet hit fra CredentialMarkers.tsx da figuren ble slått sammen
 * med arbeidsgiver- og rolletidslinjen (esf-7qk.1) – samme utledning, nå
 * delt kilde for den samlede figuren og dens tekstekvivalent.
 */
export function credentialMarks(): CredentialMark[] {
  const certs: CredentialMark[] = certifications.map((c) => ({
    key: c.title,
    title: c.title,
    by: c.by,
    when: formatYm(c.date),
    short: CREDENTIAL_SHORT_LABEL[c.title] ?? c.title.split(" ")[0],
    at: c.date,
  }));
  const edu: CredentialMark[] = education.map((e) => ({
    key: e.title,
    title: e.title,
    by: e.by,
    when: `${e.from.slice(0, 4)}–${e.to.slice(0, 4)}`,
    short: CREDENTIAL_SHORT_LABEL[e.title] ?? e.title.split(" ")[0],
    at: toMonths(e.to) >= AXIS_START ? e.to : null,
    from: e.from,
  }));
  return [...certs, ...edu].sort((a, b) => {
    const av = a.at ?? "0000-00";
    const bv = b.at ?? "0000-00";
    return bv.localeCompare(av);
  });
}
