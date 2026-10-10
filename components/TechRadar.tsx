import { QUADRANTS, RINGS, blips, type Blip, type Quadrant, type Ring } from "@/content/radar";

/**
 * Teknologiradar: fire kvadranter (domene) og fire ringer (modenhet).
 *
 * Plasseringen er deterministisk – vinkel og radius utledes av blipens
 * plass i sin egen (kvadrant, ring)-gruppe, aldri av tilfeldighet. Et
 * tilfeldig jitter ville gitt ny SVG i hver eneste build og dermed støy i
 * diffen på den statiske eksporten.
 *
 * Blipene er nummererte, ikke navngitte, i selve sirkelen: fire elementer i
 * én kvadrantring får ikke plass til etiketter uten å overlappe. Nøkkelen
 * under er derfor ikke et vedlegg, den er innholdet – og den er det eneste
 * som vises under md og det eneste skjermlesere får.
 */

const SIZE = 520;
const C = SIZE / 2;
const R = 236;
/** Blip-radius. Målt minste senteravstand er 21 px, så 9 gir luft. */
const BLIP_R = 9;
const RING_LABEL: Record<Ring, string> = {
  bruker: "bruker",
  tester: "tester",
  vurderer: "vurderer",
  "lagt-bort": "lagt bort",
};
const QUADRANT_LABEL: Record<Quadrant, string> = {
  agenter: "Agenter",
  modeller: "Modeller",
  plattform: "Plattform & verktøykjede",
  styring: "Styring & sikkerhet",
};
/** Kortform i selve sirkelen – de lange navnene sprengte viewBoxen. */
const QUADRANT_SHORT: Record<Quadrant, string> = {
  agenter: "Agenter",
  modeller: "Modeller",
  plattform: "Plattform",
  styring: "Styring",
};
/** Startvinkel per kvadrant i SVG-grader (0 = øst, 90 = sør). */
const QUADRANT_START: Record<Quadrant, number> = {
  agenter: 270,
  modeller: 0,
  plattform: 90,
  styring: 180,
};

/**
 * Ringbredden følger hvor mange blips ringen faktisk har, ikke like deler.
 * Med like deler fikk «bruker» en liten skive å trenge seks blips inn i,
 * mens «lagt bort» – som er tom – la beslag på en fjerdedel av radien.
 * +1 per ring så en tom ring fortsatt får en synlig stripe.
 */
const RING_WEIGHT = RINGS.map((r) => blips.filter((b) => b.ring === r).length + 2);
const WEIGHT_SUM = RING_WEIGHT.reduce((a, b) => a + b, 0);
const ringOuter = (i: number) =>
  (RING_WEIGHT.slice(0, i + 1).reduce((a, b) => a + b, 0) / WEIGHT_SUM) * R;

type Placed = Blip & { n: number; x: number; y: number };

function place(): Placed[] {
  // Stabil nummerering: ring utenfra og inn, så kvadrant, så id.
  const ordered = [...blips].sort(
    (a, b) =>
      RINGS.indexOf(a.ring) - RINGS.indexOf(b.ring) ||
      QUADRANTS.indexOf(a.quadrant) - QUADRANTS.indexOf(b.quadrant) ||
      a.id.localeCompare(b.id),
  );
  const groups = new Map<string, Blip[]>();
  for (const b of ordered) {
    const k = `${b.quadrant}|${b.ring}`;
    groups.set(k, [...(groups.get(k) ?? []), b]);
  }
  return ordered.map((b, idx) => {
    const ri = RINGS.indexOf(b.ring);
    const group = groups.get(`${b.quadrant}|${b.ring}`)!;
    const i = group.findIndex((g) => g.id === b.id);
    const n = group.length;
    // Vinkel: jevn fordeling innenfor kvadrantens 90 grader, med luft i kantene.
    const deg = QUADRANT_START[b.quadrant] + ((i + 0.5) / n) * 90;
    // Radius: to alternerende baner i ringen, så like vinkler ikke gir like punkter.
    const inner = ri === 0 ? 14 : ringOuter(ri - 1);
    const outer = ringOuter(ri);
    // 0,30/0,78 og ikke 0,38/0,68: med den smalere spredningen havnet to
    // naboer i plattform/bruker 19,8 px fra hverandre med 22 px diameter.
    const t = i % 2 === 0 ? 0.3 : 0.78;
    const rad = inner + (outer - inner) * t;
    const a = (deg * Math.PI) / 180;
    return { ...b, n: idx + 1, x: C + rad * Math.cos(a), y: C + rad * Math.sin(a) };
  });
}

export default function TechRadar() {
  const placed = place();
  const byRing = (r: Ring) => placed.filter((p) => p.ring === r);

  return (
    <div>
      <div className="hidden md:flex justify-center" aria-hidden>
        <svg viewBox={`-30 -26 ${SIZE + 60} ${SIZE + 52}`} className="w-full max-w-[600px] h-auto" role="presentation">
          {RINGS.map((r, i) => (
            <circle
              key={r}
              cx={C}
              cy={C}
              r={ringOuter(i)}
              fill="none"
              className="stroke-line"
              strokeWidth={1}
            />
          ))}
          <line x1={C} y1={C - R} x2={C} y2={C + R} className="stroke-line" strokeWidth={1} />
          <line x1={C - R} y1={C} x2={C + R} y2={C} className="stroke-line" strokeWidth={1} />

          {RINGS.map((r, i) => (
            <text
              key={`rl-${r}`}
              x={C + 4}
              y={C - (i === 0 ? ringOuter(0) / 2 : (ringOuter(i - 1) + ringOuter(i)) / 2) + 3}
              className="fill-mute font-mono"
              fontSize={10}
            >
              {RING_LABEL[r]}
            </text>
          ))}

          {QUADRANTS.map((q) => {
            const mid = ((QUADRANT_START[q] + 45) * Math.PI) / 180;
            const x = C + (R + 4) * Math.cos(mid);
            const y = C + (R + 4) * Math.sin(mid);
            const anchor = Math.cos(mid) < -0.1 ? "end" : Math.cos(mid) > 0.1 ? "start" : "middle";
            return (
              <text
                key={q}
                x={x}
                y={y + (Math.sin(mid) > 0 ? 9 : -3)}
                textAnchor={anchor}
                fontSize={11}
                className="fill-ink font-mono"
              >
                {QUADRANT_SHORT[q]}
              </text>
            );
          })}

          {placed.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={BLIP_R} className="fill-accent" />
              <text
                x={p.x}
                y={p.y + 3.2}
                textAnchor="middle"
                fontSize={9}
                className="fill-accent-ink font-mono"
              >
                {p.n}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-7 md:mt-8">
        {RINGS.map((r) => {
          const items = byRing(r);
          if (items.length === 0) return null;
          return (
            <section key={r}>
              {/* h2, ikke h3: /ki har bare h1 over denne, og et hopp til h3 er
                  et overskriftsnivå-brudd (fanget av Lighthouse, ikke av axe). */}
              <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-text mb-2">
                {RING_LABEL[r]} ({items.length})
              </h2>
              <ul className="flex flex-col gap-2">
                {items.map((p) => (
                  <li key={p.id} className="text-[14px] leading-[1.45] flex gap-2.5">
                    <span className="font-mono text-[11px] text-mute pt-[3px] w-5 shrink-0 text-right">
                      {p.n}
                    </span>
                    <span>
                      <span className="font-medium">{p.name}</span>
                      <span className="font-mono text-[11px] text-mute"> · {QUADRANT_LABEL[p.quadrant]}</span>
                      <br />
                      <span className="text-ink-2">{p.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
