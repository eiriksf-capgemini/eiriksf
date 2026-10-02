import type { Metadata } from "next";
import Label from "@/components/Label";
import { experiments, principles, radar } from "@/content/ki";

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

      <div className="grid md:grid-cols-3 gap-6 mt-9">
        {radar.map((col) => (
          <div key={col.title} className="border border-line rounded-md overflow-hidden bg-bg-2">
            <div className="px-4 py-3 bg-accent text-accent-ink flex justify-between items-center">
              <span className="font-mono text-xs uppercase tracking-[0.12em]">{col.title}</span>
              <span className="font-mono text-[11px] opacity-80">{col.sub}</span>
            </div>
            <ul className="py-1.5">
              {col.items.map((it) => (
                <li
                  key={it.name}
                  className="px-4 py-2 flex justify-between gap-3 text-[14.5px] border-t border-dashed border-line first:border-t-0"
                >
                  <span>{it.name}</span>
                  <span className="text-mute font-mono text-[11.5px] whitespace-nowrap">{it.note}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
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
          <pre className="font-mono text-[12.5px] leading-[1.7] bg-bg-2 border border-line rounded-md px-[18px] py-4 overflow-auto text-ink-2">
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
