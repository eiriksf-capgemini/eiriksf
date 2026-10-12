import { Tags } from "@/components/Tag";
import { employers, monthsLabel, spanMonths } from "@/lib/cv";

/**
 * Arbeidsgiverliste under den samlede tidslinjen (CareerTimeline). Aksen og
 * stolpen som før lå her er flyttet dit i esf-7qk.1 – CareerTimeline er nå
 * den eneste som tegner 2007 → nå, og denne komponenten er bare teksten.
 *
 * Utvidelsen er <details>/<summary>: tastatur, aria-expanded og fokus-
 * oppførsel følger med gratis, og den virker uten JavaScript.
 */

export default function EmployerTimeline() {
  const rows = [...employers].reverse(); // nyeste først, som ellers i CV-en

  return (
    <div>
      {rows.map((emp) => {
        const current = emp.to === null;
        return (
          <div key={emp.name} className="border-t border-line py-4">
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

            {/* Standardvisningen: én setning per oppdrag. Alt annet ligger bak
                utvidelsen eller i PDF-en. */}
            <ul className="mt-3.5 flex flex-col gap-1.5">
              {emp.jobs.map((job) => (
                <li key={job.org + job.from} className="text-[14.5px] text-ink-2 leading-[1.5]">
                  <span className="text-ink font-medium">{job.title}</span>
                  {job.via && <span className="text-mute font-mono text-[12px]"> · {job.org}</span>}
                  <span className="text-mute"> — </span>
                  {job.oneLine}
                </li>
              ))}
            </ul>

            <details className="group mt-2.5">
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
                      <p
                        key={t.slice(0, 30)}
                        className="text-ink-2 text-[14.5px] mb-2.5 max-w-[70ch]"
                      >
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
