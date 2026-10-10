import type { Metadata } from "next";
import Label from "@/components/Label";
import TechRadar from "@/components/TechRadar";
import { experiments, principles } from "@/content/ki";

export const metadata: Metadata = {
  title: "KI & teknologi",
  description: "Verktøy, eksperimenter og hva jeg følger med på – med vekt på KI i plattformarbeid.",
};


export default function KiPage() {
  return (
    <div className="wrap">
      <Label idx="03">KI &amp; teknologi</Label>
      <h1 className="text-[48px]">Verktøy, eksperimenter og hva jeg følger med på.</h1>
      <p className="text-[21px] leading-[1.5] text-ink mt-3.5 max-w-[44ch]">
        En levende oversikt over teknologi jeg bruker i praksis, tester ut, eller holder et øye med –
        med vekt på KI i plattform- og utviklerarbeid.
      </p>

      <div className="mt-9">
        <TechRadar />
      </div>

      <hr className="hairline" />

      <div className="grid md:grid-cols-2 gap-12">
        <div className="min-w-0">
          <Label>Eksperimenter</Label>
          {experiments.map((e) => (
            <div key={e.title} className="border-l-2 border-accent pl-5 py-1 my-4">
              <div className="font-semibold text-[17px]">{e.title}</div>
              <div className="text-[14.5px] text-ink-2">{e.desc}</div>
              <div className="font-mono text-[11.5px] text-mute mt-1">
                status: {e.status} · {e.date}
              </div>
            </div>
          ))}
        </div>
        <div className="min-w-0">
          <Label>Prinsipper</Label>
          <pre
            tabIndex={0}
            role="region"
            aria-label="Prinsipper for KI i plattformarbeid"
            className="font-mono text-[12.5px] leading-[1.7] bg-bg-2 border border-line rounded-md px-[18px] py-4 overflow-auto text-ink-2 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="text-mute"># hvordan jeg tenker om KI i plattformarbeid</span>
            {"\n"}
            {principles.map((p) => (
              <span key={p.k}>
                <span className="text-accent-text">{p.k}</span>
                {":".padEnd(16 - p.k.length)}
                {p.v}
                {"\n"}
              </span>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
