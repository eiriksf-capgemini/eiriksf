import { Tags } from "@/components/Tag";
import { careerMonths, careerStart, employers, monthsLabel, spanMonths, toMonths } from "@/lib/cv";

/**
 * Arbeidsgivere på én felles vannrett tidsakse, 2007 → nå.
 *
 * Én rad per arbeidsgiver, ikke per oppdrag: Bouvet dekker tre oppdrag og
 * Sopra Steria ett, og en tidslinje som viste kunden som arbeidsgiver ville
 * vært direkte feil (se esf-hnd.1). Oppdragene ligger inni raden i stedet.
 *
 * Rad framfor én sammenhengende stripe fordi den korteste arbeidsgiveren er
 * under 1 % av spennet – som segment i en stripe ville den blitt ~6 px bred,
 * umulig å lese og for liten som klikkmål. Som rad er hele bredden klikkbar
 * mens stolpen fortsatt viser når og hvor lenge.
 *
 * Utvidelsen er <details>/<summary>: tastatur, aria-expanded og fokus-
 * oppførsel følger med gratis, og den virker uten JavaScript.
 */

const START = toMonths(careerStart);
const pos = (ym: string) => ((toMonths(ym) - START) / careerMonths) * 100;

/**
 * Startåret pluss femårsmerker, utledet – ikke hardkodet. Annethvert
 * femårsmerke skjules under md: på 360 px kolliderer "2025" med "nå".
 */
function ticks(): { label: string; left: number; mobile: boolean }[] {
  const firstYear = Number(careerStart.slice(0, 4));
  const lastYear = new Date().getFullYear();
  const out = [{ label: String(firstYear), left: 0, mobile: true }];
  for (let y = Math.ceil(firstYear / 5) * 5; y < lastYear; y += 5) {
    out.push({ label: String(y), left: pos(`${y}-01`), mobile: (y / 5) % 2 === 0 });
  }
  return out;
}

export default function EmployerTimeline() {
  const rows = [...employers].reverse(); // nyeste først, som ellers i CV-en

  return (
    <div>
      {/* Akse – ligger i samme rutenett som sporene under, så merkene
          står loddrett over datoene de gjelder. */}
      <div className="grid md:grid-cols-[230px_1fr] md:gap-6">
        <span className="hidden md:block" aria-hidden />
        <div className="relative h-4" aria-hidden>
          {ticks().map((t, i) => (
            <span
              key={t.label}
              className={[
                "absolute top-0 font-mono text-[11px] text-mute",
                i === 0 ? "left-0" : "-translate-x-1/2",
                t.mobile ? "" : "hidden md:inline",
              ].join(" ")}
              style={i === 0 ? undefined : { left: `${t.left}%` }}
            >
              {t.label}
            </span>
          ))}
          <span className="absolute top-0 right-0 font-mono text-[11px] text-mute">nå</span>
        </div>
      </div>

      {rows.map((emp) => {
        const current = emp.to === null;
        return (
          <div key={emp.name} className="border-t border-line py-4">
            <div className="grid md:grid-cols-[230px_1fr] gap-2 md:gap-6 md:items-center">
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h2 className="font-medium text-[15px] inline">{emp.name}</h2>
                  {current && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent-text">
                      nå
                    </span>
                  )}
                  {emp.jobs.length > 1 && (
                    <span className="font-mono text-[10px] text-mute whitespace-nowrap">
                      {emp.jobs.length} oppdrag
                    </span>
                  )}
                </div>
                <div className="font-mono text-[11.5px] text-mute mt-1">
                  {emp.from.slice(0, 4)}–{current ? "nå" : emp.to!.slice(0, 4)} ·{" "}
                  {monthsLabel(emp.months)}
                </div>
              </div>
              <div className="relative h-2.5 rounded-sm bg-bg-2">
                <div
                  aria-hidden
                  className={["absolute inset-y-0 rounded-sm", current ? "bg-accent" : "bg-accent/65"].join(" ")}
                  style={{
                    left: `${pos(emp.from)}%`,
                    width: `${Math.max((emp.months / careerMonths) * 100, 1.2)}%`,
                  }}
                />
              </div>
            </div>

            {/* Standardvisningen: én setning per oppdrag. Alt annet ligger bak
                utvidelsen eller i PDF-en. */}
            <ul className="mt-3.5 md:pl-[254px] flex flex-col gap-1.5">
              {emp.jobs.map((job) => (
                <li key={job.org + job.from} className="text-[14.5px] text-ink-2 leading-[1.5]">
                  <span className="text-ink font-medium">{job.title}</span>
                  {job.via && <span className="text-mute font-mono text-[12px]"> · {job.org}</span>}
                  <span className="text-mute"> — </span>
                  {job.oneLine}
                </li>
              ))}
            </ul>

            <details className="group mt-2.5 md:pl-[254px]">
              <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer inline-flex items-center gap-1.5 font-mono text-[11.5px] text-accent-text py-1">
                <span aria-hidden>
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">–</span>
                </span>
                <span className="group-open:hidden">Vis detaljer</span>
                <span className="hidden group-open:inline">Skjul detaljer</span>
              </summary>
              <div className="pt-4 pb-2">
                {emp.jobs.map((job) => (
                  <div key={job.org + job.from} className="mb-6 last:mb-0">
                    <h3 className="text-[16px] mb-0.5">
                      {job.title}
                      {job.via && <span className="text-mute font-normal"> · {job.org}</span>}
                    </h3>
                    <div className="font-mono text-[12px] text-mute mb-2.5">
                      {job.from.slice(0, 4)}–{job.to ? job.to.slice(0, 4) : "nå"} ·{" "}
                      {monthsLabel(spanMonths(job.from, job.to))}
                    </div>
                    {job.summary.map((t) => (
                      <p key={t.slice(0, 30)} className="text-ink-2 text-[14.5px] mb-2.5 max-w-[70ch]">
                        {t}
                      </p>
                    ))}
                    <div className="mt-3">
                      <Tags items={job.tags} />
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        );
      })}
    </div>
  );
}
