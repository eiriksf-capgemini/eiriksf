import { competence } from "@/content/cv";
import { formatSpans } from "@/lib/cv";

/**
 * Fagområder som liste med årstall (esf-7qk.5).
 *
 * Dette var tidligere et eget minispor per område, tegnet på samme akse som
 * resten av karrieren. Den aksen finnes allerede én gang på siden, i
 * CareerTimeline, og i sidespalten var sporet ~230px bredt for nitten år -
 * et ettårig spenn ble da rundt tolv piksler og sa ingenting. Årstallene
 * sier det presist på mindre plass.
 *
 * Den fylte prikken betyr "i bruk nå", altså at området har et spenn uten
 * sluttdato. Den er ikke en vurdering: terningkastet på 1-5 ble fjernet med
 * vilje i esf-hnd.5 og skal ikke tilbake i noen form.
 */
export default function CompetenceSpans() {
  return (
    <ul>
      {competence.map((c) => {
        const inUse = c.spans.some((s) => s.to === null);
        return (
          <li key={c.name} className="border-t border-line py-2">
            <div className="flex items-baseline gap-2">
              <span
                aria-hidden
                className={[
                  "shrink-0 w-1.5 h-1.5 rounded-full translate-y-[-1px]",
                  inUse ? "bg-accent" : "bg-line-2",
                ].join(" ")}
              />
              <span className="text-[13.5px] leading-[1.35]">{c.name}</span>
              {inUse && <span className="sr-only">, i bruk nå</span>}
            </div>
            <div className="font-mono text-[11px] text-mute mt-1 ml-3.5 leading-[1.4]">
              {formatSpans(c.spans)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
