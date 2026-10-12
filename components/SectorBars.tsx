import { sectorLabel } from "@/content/cv";
import { careerMonths, gapMonths, monthsLabel, sectorsByTime } from "@/lib/cv";

/**
 * Bransjefordeling som én stablet stolpe med egen legende (esf-7qk.4).
 *
 * Før stod dette som seks rangerte stolper under hverandre, og kommentaren
 * her sa at en stablet stolpe var bevisst valgt bort fordi det smaleste
 * feltet ikke ville hatt plass til etiketten sin. Det argumentet gjaldt så
 * lenge etiketten måtte ligge inni feltet. Nå ligger den i legenden under,
 * og da faller innvendingen bort: seks rader på ~420px blir én stolpe pluss
 * en kompakt liste som får plass i sidespalten.
 *
 * Fargen bærer ingen informasjon alene - hvert felt gjentas i legenden med
 * navn, varighet og andel, så grafikken fungerer i gråtoner og for
 * fargeblinde. Stolpen er aria-hidden; legenden er tabellen skjermleseren
 * faktisk leser.
 */
export default function SectorBars() {
  const rows = [
    ...sectorsByTime.map((s) => ({ name: sectorLabel[s.sector], months: s.months, muted: false })),
    // Hullene mellom oppdrag tas med, ellers summerer ikke andelene til 100 %.
    ...(gapMonths > 0 ? [{ name: "Mellom oppdrag", months: gapMonths, muted: true }] : []),
  ];
  const top = sectorsByTime[0];

  // Fallende dekkevne i stedet for seks ulike farger: rekkefølgen i stolpen
  // er den samme som i legenden, så nyansen er en pekepinn, ikke nøkkelen.
  const shade = (i: number, muted: boolean) => (muted ? 1 : Math.max(1 - i * 0.145, 0.3));

  return (
    <div>
      <p className="text-[14.5px] leading-[1.45] mb-4">
        {monthsLabel(careerMonths)} fordelt på {sectorsByTime.length} bransjer – tyngst i{" "}
        <strong className="font-semibold">{sectorLabel[top.sector].toLowerCase()}</strong>.
      </p>

      <div aria-hidden className="flex h-3 w-full overflow-hidden rounded-sm bg-bg-2">
        {rows.map((r, i) => (
          <span
            key={r.name}
            className={r.muted ? "bg-line-2" : "bg-accent"}
            // min-width: "Mellom oppdrag" er 1,7 % og ville vært under én
            // piksel på en 260px-spalte. Den skal fortsatt kunne ses.
            style={{
              width: `${(r.months / careerMonths) * 100}%`,
              minWidth: "3px",
              opacity: shade(i, r.muted),
            }}
          />
        ))}
      </div>

      <table className="w-full border-collapse mt-3.5">
        <caption className="sr-only">
          Bransjer med varighet og andel av karrieren, største først
        </caption>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.name} className="align-baseline">
              <td className="py-[5px] pr-2 w-0">
                <span
                  aria-hidden
                  className={[
                    "inline-block w-2.5 h-2.5 rounded-[2px] align-middle",
                    r.muted ? "bg-line-2" : "bg-accent",
                  ].join(" ")}
                  style={{ opacity: shade(i, r.muted) }}
                />
              </td>
              <th
                scope="row"
                className={[
                  // Ikke nowrap: "Bank, finans og forsikring" sprenger en smal
                  // spalte hvis den ikke får brekke.
                  "py-[5px] pr-2 text-left font-normal text-[13px] leading-[1.3]",
                  r.muted ? "text-mute" : "text-ink",
                ].join(" ")}
              >
                {r.name}
              </th>
              <td className="py-[5px] font-mono text-[11px] text-mute whitespace-nowrap text-right tabular-nums">
                {monthsLabel(r.months)}
                <span className="text-accent-text">
                  {" · "}
                  {((r.months / careerMonths) * 100).toFixed(1)} %
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
