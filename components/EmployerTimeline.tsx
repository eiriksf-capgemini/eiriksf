import { Tags } from "@/components/Tag";
import { employers, monthsLabel, spanMonths } from "@/lib/cv";

/**
 * Tett erfaringsliste under den samlede tidslinjen (CareerTimeline):
 * årstall i en smal mono-kolonne, arbeidsgiver som gruppeoverskrift, én rad
 * per oppdrag. Tidsaksen og stolpene flyttet til CareerTimeline i esf-7qk.1
 * – denne listen er nå bare teksten, med hele raden som klikkmål.
 *
 * Utvidelsen er <details>/<summary>: tastatur, aria-expanded og fokus-
 * oppførsel følger med gratis, og den virker uten JavaScript.
 */

export default function EmployerTimeline() {
  const rows = [...employers].reverse(); // nyeste først, som ellers i CV-en

  return (
    <div className="mt-2">
      {rows.map((emp) => {
        const current = emp.to === null;
        return (
          <div key={emp.name}>
            <div className="flex items-baseline gap-2 flex-wrap pt-4 pb-0.5">
              <h2 className="font-medium text-[15px]">{emp.name}</h2>
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

            {emp.jobs.map((job) => (
              <details key={job.org + job.from} className="group border-t border-line">
                <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-start gap-3 py-2">
                  <span className="font-mono text-[11.5px] text-mute whitespace-nowrap pt-[2px] w-[68px] shrink-0">
                    {job.from.slice(0, 4)}–{job.to ? job.to.slice(0, 4) : "nå"}
                  </span>
                  <span className="text-[14.5px] leading-[1.45] text-ink-2 flex-1 min-w-0">
                    <span className="text-ink font-medium">{job.title}</span>
                    {job.via && (
                      <span className="text-mute font-mono text-[12px]"> · {job.org}</span>
                    )}
                    <span className="text-mute"> — </span>
                    {job.oneLine}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-[13px] text-accent-text pt-[2px] w-4 shrink-0 text-right"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">–</span>
                  </span>
                </summary>
                <div className="pb-4 pl-[80px] pr-6">
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
              </details>
            ))}
          </div>
        );
      })}
    </div>
  );
}
