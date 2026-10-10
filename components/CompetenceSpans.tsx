import { competence } from "@/content/cv";
import { careerMonths, careerStart, formatSpans, spanMonths, toMonths } from "@/lib/cv";

/**
 * Kompetanse som tid i stedet for terningkast. Hvert område tegnes på samme
 * akse som resten av karrieren (2007 → nå), så et område som har ligget
 * brakk og blitt tatt opp igjen vises som to segmenter – ikke som ett tall.
 *
 * Sporet er aria-hidden; skjermleser får spennene som tekst i samme rad,
 * så tallene finnes uavhengig av grafikken.
 */
export default function CompetenceSpans() {
  const start = toMonths(careerStart);

  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">
        Fagområder med periodene de har vært i aktiv bruk, fra {careerStart.slice(0, 4)} til i dag
      </caption>
      <tbody>
        {competence.map((c) => (
          <tr key={c.name} className="border-t border-line">
            <td className="pt-2.5 pb-3">
              {/* Ikke nowrap og ikke én linje: "2015–2015 · 2018–2019 ·
                  2021–2023 · 2026–nå" har en min-content-bredde som sprenger
                  360px-viewporten og dytter hele sidelayouten utenfor. */}
              <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-0.5 min-w-0">
                <span className="text-[13.5px]">{c.name}</span>
                <span className="font-mono text-[11px] text-mute">{formatSpans(c.spans)}</span>
              </div>
              <div aria-hidden className="relative h-1.5 mt-2 rounded-sm bg-bg-2">
                {c.spans.map((s) => (
                  <span
                    key={s.from}
                    className={[
                      "chart-bar absolute inset-y-0 rounded-sm",
                      s.to === null ? "bg-accent" : "bg-accent/55",
                    ].join(" ")}
                    style={{
                      left: `${((toMonths(s.from) - start) / careerMonths) * 100}%`,
                      width: `${Math.max((spanMonths(s.from, s.to) / careerMonths) * 100, 1.5)}%`,
                    }}
                  />
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
