/**
 * Utledede verdier for CV-siden. content/cv.ts holder fakta – her regnes
 * arbeidsgivere, bransjeår og spenn ut, slik at hver grafikk leser samme
 * kilde i stedet for å telle på nytt selv.
 *
 * Måneder telles eksklusivt (sluttmåned ikke medregnet), slik at summen av
 * oppdrag pluss hull blir nøyaktig karrierespennet. Visningen av varighet
 * per jobb på /cv teller inklusivt – det er en bevisst forskjell.
 */
import { jobs, SECTORS, statsFigures, type Competence, type Job, type Sector } from "@/content/cv";

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
export const gapMonths =
  careerMonths - Object.values(sectorMonths).reduce((sum, m) => sum + m, 0);

/** Hele år i bransjen, utledet fra første jobb. Én kilde, to visningssteder. */
export const careerYears = Math.floor(careerMonths / 12);

/** Nøkkeltall for forsiden. Første tall utledes, resten er innhold. */
export const stats = [
  { num: String(careerYears), sup: "+", desc: "år i bransjen" },
  ...statsFigures,
];
