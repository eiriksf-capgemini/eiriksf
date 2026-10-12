import { jobs, roleLevelLabel } from "@/content/cv";
import {
  axisPosition,
  axisTicks,
  careerMonths,
  careerStart,
  credentialMarks,
  employers,
  monthsLabel,
  roleLevelOpacity,
  spanMonths,
  toMonths,
} from "@/lib/cv";

/**
 * Arbeidsgivere, rollenivå og sertifiseringer på én felles vannrett tidsakse,
 * 2007 → nå – slått sammen fra EmployerTimeline, RoleProgression og
 * CredentialMarkers (esf-7qk.1), som før tegnet samme akse tre ganger for å
 * vise tre fasetter av samme tidslinje hver for seg.
 *
 * Én bane per arbeidsgiver, ikke per oppdrag: Bouvet dekker tre oppdrag og
 * Sopra Steria ett, og en tidslinje som viste kunden som arbeidsgiver ville
 * vært direkte feil (se esf-hnd.1/esf-hnd.2). Rollenivå vises som
 * feltstyrke inni hver banes oppdragssegmenter i stedet for en egen trapp
 * over banene – det er det samme tallet (roleLevelRank), bare som
 * opasitet, og det får plass uten å legge til en fjerde bane.
 *
 * Sertifiseringer og utdanning er én bane nederst, med prikkene fordelt på
 * to forskjøvne spor: SC-900 og PSM I ble begge tatt i 11.2022 og ville
 * ligget nøyaktig oppå hverandre på ett spor.
 *
 * Selve figuren er aria-hidden og skjult under md (ikke plass til navngitte
 * baner der – samme avveining som RoleProgression gjorde før). Jobblisten
 * rett under (EmployerTimeline) gir arbeidsgiver/tittel/år som tekst på alle
 * bredder; rollenivå og sertifiseringer har sine egne tekstekvivalenter her,
 * synlige under md der figuren er skjult og sr-only der figuren vises.
 */

const LANE_H = 13;
const ROW_H = 24;
const CRED_H = 58;

export default function CareerTimeline() {
  const rows = [...employers].reverse(); // nyeste øverst, som i sketchen i designreviewet
  const chrono = [...jobs].reverse(); // eldst først, for tekstekvivalenten under
  const marks = credentialMarks();
  const START = toMonths(careerStart);

  return (
    <div>
      <div aria-hidden className="hidden md:block print:!hidden">
        {/* Akse – ligger i samme rutenett som banene under, så merkene
            står loddrett over datoene de gjelder. */}
        <div className="grid grid-cols-[160px_1fr] gap-4">
          <span />
          <div className="relative h-4">
            {axisTicks().map((t, i) => (
              <span
                key={t.label}
                className={[
                  "absolute top-0 font-mono text-[11px] text-mute",
                  i === 0 ? "left-0" : "-translate-x-1/2",
                ].join(" ")}
                style={i === 0 ? undefined : { left: `${t.left}%` }}
              >
                {t.label}
              </span>
            ))}
            <span className="absolute top-0 right-0 font-mono text-[11px] text-mute">nå</span>
          </div>
        </div>

        {/* Arbeidsgiverbaner */}
        <div className="mt-1">
          {rows.map((emp) => (
            <div
              key={emp.name}
              className="grid grid-cols-[160px_1fr] gap-4 items-center"
              style={{ height: ROW_H }}
            >
              <div
                className="text-[12px] font-medium text-ink-2 text-right truncate"
                title={emp.name}
              >
                {emp.name}
              </div>
              <div className="relative rounded-sm bg-bg-2" style={{ height: LANE_H }}>
                {emp.jobs.map((job) => (
                  <div
                    key={job.org + job.from}
                    className="chart-bar absolute inset-y-0 rounded-sm bg-accent"
                    style={{
                      left: `${axisPosition(job.from)}%`,
                      width: `${Math.max((spanMonths(job.from, job.to) / careerMonths) * 100, 1.2)}%`,
                      opacity: roleLevelOpacity(job.roleLevel),
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sertifiseringer og utdanning – én bane, to forskjøvne spor */}
        <div className="grid grid-cols-[160px_1fr] gap-4 items-center mt-2">
          <div className="text-[12px] font-medium text-mute text-right">Sertifiseringer</div>
          <div className="relative" style={{ height: CRED_H }}>
            <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
            {marks.map((m, i) => {
              const track = i % 2; // 0 = øvre spor, 1 = nedre spor – skiller nabodatoer
              const dotY = track === 0 ? CRED_H / 2 - 12 : CRED_H / 2 + 4;
              const labelTop = track === 0 ? dotY - 13 : dotY + 11;
              const before = m.at === null;
              const spanStart = m.from ? Math.max(axisPosition(m.from), 0) : null;
              const clipped = m.from ? toMonths(m.from) < START : false;
              return (
                <div key={m.key}>
                  {m.at && spanStart !== null && (
                    <div
                      className="chart-bar absolute h-[3px] rounded-sm bg-accent/30"
                      style={{
                        left: `${spanStart}%`,
                        width: `${Math.max(axisPosition(m.at) - spanStart, 0.6)}%`,
                        top: dotY + 2.5,
                      }}
                    />
                  )}
                  <span
                    className={[
                      "chart-bar absolute w-2 h-2 rounded-full",
                      before ? "bg-line-2" : "bg-accent",
                    ].join(" ")}
                    style={
                      before
                        ? { left: 0, top: dotY }
                        : { left: `calc(${axisPosition(m.at!)}% - 4px)`, top: dotY }
                    }
                  />
                  <span
                    className="absolute font-mono text-[9.5px] text-mute whitespace-nowrap"
                    style={
                      before
                        ? { left: 12, top: labelTop }
                        : {
                            left: `calc(${axisPosition(m.at!)}% - 4px)`,
                            top: labelTop,
                            transform: "translateX(-50%)",
                          }
                    }
                  >
                    {clipped && "‹ "}
                    {before ? `før ${careerStart.slice(0, 4)}` : m.short}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="font-mono text-[11px] text-mute mt-3.5 md:pl-[176px] print:pl-0">
        Feltstyrken i banene viser rollenivå, fra Drift (lysest) til Teknisk ledelse (mørkest) –
        utledet av titlene i CV-en. Nivået stiger ikke jevnt: i 2019 og 2023 går det ned et hakk
        igjen.
      </p>

      {/* Tekstekvivalent for rollenivå: synlig under md der figuren er
          skjult, sr-only der figuren vises. aria-label i stedet for en
          overskrift – en ekte <h3> her ville hoppet fra h1 til h3 i
          dokumentkonturen (axe heading-order). */}
      <ol
        aria-label="Rollenivå over tid"
        className="md:sr-only print:not-sr-only flex flex-col gap-2 mt-4"
      >
        {chrono.map((j) => (
          <li
            key={`role-${j.org}-${j.from}`}
            className="text-[14px] leading-[1.45] border-t border-line pt-2"
          >
            <span className="font-mono text-[11.5px] text-mute">
              {j.from.slice(0, 4)}–{j.to ? j.to.slice(0, 4) : "nå"} ·{" "}
              {monthsLabel(spanMonths(j.from, j.to))}
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

      {/* Tekstekvivalent for sertifiseringer/utdanning, samme synlighetsregel. */}
      <ul
        aria-label="Sertifiseringer og utdanning"
        className="md:sr-only print:not-sr-only flex flex-col gap-1 mt-2"
      >
        {marks.map((m) => (
          <li
            key={`cred-${m.key}`}
            className="text-[13.5px] leading-[1.4] border-t border-line pt-1.5"
          >
            {m.title}{" "}
            <span className="font-mono text-[11px] text-mute">
              · {m.by} · {m.when}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
