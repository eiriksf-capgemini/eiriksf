import { sectorLabel } from "@/content/cv";
import { careerMonths, gapMonths, monthsLabel, sectorsByTime } from "@/lib/cv";

/**
 * Bransjefordeling som rangerte stolper. Bevisst ikke en stablet stolpe:
 * den smaleste bransjen er ~6 % og ville ikke hatt plass til sin egen
 * etikett. Alle stolper har samme farge – skillet ligger i teksten, ikke i
 * fargen, så grafikken fungerer også i gråtoner og for fargeblinde.
 *
 * Tabellen er ikke et tillegg til grafikken, den *er* grafikken: stolpene
 * ligger inni cellene og er aria-hidden, så skjermleser får tallene direkte.
 */
export default function SectorBars() {
  const rows = [
    ...sectorsByTime.map((s) => ({ name: sectorLabel[s.sector], months: s.months, muted: false })),
    // Hullene mellom oppdrag tas med, ellers summerer ikke andelene til 100 %.
    ...(gapMonths > 0 ? [{ name: "Mellom oppdrag", months: gapMonths, muted: true }] : []),
  ];
  const widest = Math.max(...rows.map((r) => r.months));
  const top = sectorsByTime[0];

  return (
    <table className="w-full border-collapse">
      <caption className="text-left text-[17px] leading-[1.45] mb-5 max-w-[46ch]">
        {monthsLabel(careerMonths)} fordelt på {sectorsByTime.length} bransjer – tyngst i{" "}
        <strong className="font-semibold">{sectorLabel[top.sector].toLowerCase()}</strong>.
      </caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} className="border-t border-line align-middle">
            <th
              scope="row"
              className={[
                // Ikke nowrap: "Bank, finans og forsikring" sprenger 360px-
                // viewporten hvis den ikke får brekke.
                "py-2.5 pr-3 md:pr-4 text-left font-normal text-[14.5px] leading-[1.3]",
                r.muted ? "text-mute" : "text-ink",
              ].join(" ")}
            >
              {r.name}
            </th>
            <td className="py-2.5 w-full">
              <div
                aria-hidden
                className={[
                  "chart-bar h-2.5 rounded-sm",
                  r.muted ? "bg-line-2" : "bg-accent",
                ].join(" ")}
                style={{ width: `${(r.months / widest) * 100}%` }}
              />
            </td>
            <td className="py-2.5 pl-2 md:pl-4 font-mono text-[12.5px] text-mute whitespace-nowrap text-right">
              {monthsLabel(r.months)}
            </td>
            <td className="py-2.5 pl-2 md:pl-3 font-mono text-[12.5px] text-accent-text whitespace-nowrap text-right tabular-nums">
              {((r.months / careerMonths) * 100).toFixed(1)} %
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
