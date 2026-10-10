import { ROLE_LEVELS, jobs, roleLevelLabel, roleLevelRank, type Job } from "@/content/cv";
import { careerMonths, careerStart, monthsLabel, spanMonths, toMonths } from "@/lib/cv";

/**
 * Rollenivå over tid. Samme akse og samme rutenett som arbeidsgiver-
 * tidslinjen, så 2007 og «nå» står loddrett over hverandre i begge.
 *
 * Kurven er bevisst ikke monoton: 2019 er et utviklerskritt ned fra Tech
 * Lead i 2018, og 2023 et skritt ned fra Tech Lead i 2021. Det er det
 * dataene sier, og grafikken skal vise formen som er, ikke en jevn stigning.
 *
 * Selve plottet er aria-hidden; teksten under gir samme informasjon i
 * rekkefølge for skjermlesere.
 */

const START = toMonths(careerStart);
const pos = (ym: string) => ((toMonths(ym) - START) / careerMonths) * 100;
const width = (j: Job) => Math.max((spanMonths(j.from, j.to) / careerMonths) * 100, 1.2);

/** Øverste bane er høyeste nivå. */
const lanes = [...ROLE_LEVELS].reverse();
const laneOf = (j: Job) => lanes.length - roleLevelRank(j.roleLevel);
const LANE_H = 30;

export default function RoleProgression() {
  const chrono = [...jobs].reverse();

  return (
    <div>
      {/* Plottet krever navngitte baner for å bety noe. Under md er det
          ikke plass til dem, så der vises listen under i stedet. */}
      <div className="hidden md:grid md:grid-cols-[230px_1fr] gap-2 md:gap-6">
        <div style={{ height: lanes.length * LANE_H }}>
          {lanes.map((l) => (
            <div
              key={l}
              className="font-mono text-[11px] text-mute flex items-center justify-end pr-1"
              style={{ height: LANE_H }}
            >
              {roleLevelLabel[l]}
            </div>
          ))}
        </div>

        <div className="relative" style={{ height: lanes.length * LANE_H }} aria-hidden>
          {lanes.map((l, i) => (
            <div
              key={l}
              className="absolute inset-x-0 border-t border-dashed border-line"
              style={{ top: i * LANE_H + LANE_H / 2 }}
            />
          ))}
          {/* loddrette forbindelser mellom påfølgende oppdrag */}
          {chrono.slice(1).map((j, i) => {
            const prev = chrono[i];
            const a = laneOf(prev) * LANE_H + LANE_H / 2;
            const b = laneOf(j) * LANE_H + LANE_H / 2;
            if (a === b) return null;
            return (
              <div
                key={`c-${j.org}-${j.from}`}
                className="absolute w-px bg-accent/40"
                style={{ left: `${pos(j.from)}%`, top: Math.min(a, b), height: Math.abs(a - b) }}
              />
            );
          })}
          {chrono.map((j) => (
            <div
              key={`${j.org}-${j.from}`}
              className={[
                "absolute h-[7px] rounded-sm",
                j.to === null ? "bg-accent" : "bg-accent/70",
              ].join(" ")}
              style={{
                left: `${pos(j.from)}%`,
                width: `${width(j)}%`,
                top: laneOf(j) * LANE_H + LANE_H / 2 - 3.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Samme innhold som plottet: synlig liste på mobil, tekstekvivalent
          for skjermlesere på større skjermer. */}
      <ol className="md:sr-only flex flex-col gap-2">
        {chrono.map((j) => (
          <li key={`t-${j.org}-${j.from}`} className="text-[14px] leading-[1.45] border-t border-line pt-2">
            <span className="font-mono text-[11.5px] text-mute">
            {j.from.slice(0, 4)}–{j.to ? j.to.slice(0, 4) : "nå"} · {monthsLabel(spanMonths(j.from, j.to))}
            </span>
            <br />
            <span className="text-accent-text">{roleLevelLabel[j.roleLevel]}</span>
            <span className="text-ink-2">
              {" "}
              — {j.title}
              {j.via ? ` · ${j.org}` : ""}
            </span>
          </li>
        ))}
      </ol>
      <p className="font-mono text-[11px] text-mute mt-4 md:pl-[254px]">
        Nivået er utledet av titlene i CV-en. Linjen stiger ikke jevnt: i 2019 og 2023 går
        den ned et hakk igjen.
      </p>
    </div>
  );
}
