import { certifications, education } from "@/content/cv";
import { careerMonths, careerStart, formatYm, toMonths } from "@/lib/cv";

/**
 * Sertifiseringer og utdanning som merker på samme tidsakse som
 * arbeidsgiverne, i stedet for to årstallslister i sidespalten.
 *
 * Én rad per merke, ikke alle prikkene på én stripe: SC-900 og PSM I ble
 * begge tatt i 11.2022 og ville ligget rett oppå hverandre. Som rader kan
 * de ikke kollidere uansett hvor tett datoene ligger.
 *
 * Alt står som tekst i venstre kolonne – prikken er dekorativ. Det er ingen
 * detalj som bare finnes ved hover, så det finnes ikke noe en tastatur- eller
 * skjermleserbruker går glipp av.
 */

const START = toMonths(careerStart);
const pos = (ym: string) => ((toMonths(ym) - START) / careerMonths) * 100;

type Mark = {
  key: string;
  title: string;
  by: string;
  when: string;
  /** Null når merket ligger helt før aksen starter. */
  at: string | null;
  /** Startpunkt for et spenn (utdanning). Kan ligge før aksen. */
  from?: string;
};

function marks(): Mark[] {
  const certs: Mark[] = certifications.map((c) => ({
    key: c.title,
    title: c.title,
    by: c.by,
    when: formatYm(c.date),
    at: c.date,
  }));
  const edu: Mark[] = education.map((e) => ({
    key: e.title,
    title: e.title,
    by: e.by,
    when: `${e.from.slice(0, 4)}–${e.to.slice(0, 4)}`,
    at: toMonths(e.to) >= START ? e.to : null,
    from: e.from,
  }));
  return [...certs, ...edu].sort((a, b) => {
    const av = a.at ?? "0000-00";
    const bv = b.at ?? "0000-00";
    return bv.localeCompare(av);
  });
}

export default function CredentialMarkers() {
  return (
    <ul className="mt-1">
      {marks().map((m) => {
        const before = m.at === null;
        const spanStart = m.from ? Math.max(pos(m.from), 0) : null;
        const clipped = m.from ? toMonths(m.from) < START : false;
        return (
          <li
            key={m.key}
            className="grid md:grid-cols-[230px_1fr] gap-1 md:gap-6 md:items-center py-2.5 border-t border-line"
          >
            <div>
              <div className="text-[14px] leading-[1.35]">{m.title}</div>
              <div className="font-mono text-[11px] text-mute mt-0.5">
                {m.by} · {m.when}
              </div>
            </div>
            <div className="relative h-2.5" aria-hidden>
              <div className="absolute inset-x-0 top-[5px] h-px bg-line" />
              {m.at && spanStart !== null && (
                <div
                  className="chart-bar absolute top-[3px] h-[3px] rounded-sm bg-accent/30"
                  style={{ left: `${spanStart}%`, width: `${Math.max(pos(m.at) - spanStart, 0.6)}%` }}
                />
              )}
              {clipped && m.at && (
                <span className="absolute -left-0.5 -top-[3px] font-mono text-[10px] text-mute leading-none">
                  ‹
                </span>
              )}
              <span
                className={[
                  "chart-bar absolute top-0 w-2.5 h-2.5 rounded-full",
                  before ? "bg-line-2" : "bg-accent",
                ].join(" ")}
                style={before ? { left: 0 } : { left: `calc(${pos(m.at!)}% - 5px)` }}
              />
              {before && (
                <span className="absolute left-3.5 -top-[3px] font-mono text-[10px] text-mute leading-none">
                  ‹ før {careerStart.slice(0, 4)}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
