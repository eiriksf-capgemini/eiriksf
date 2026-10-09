import type { Metadata } from "next";
import CompetenceSpans from "@/components/CompetenceSpans";
import EmployerTimeline from "@/components/EmployerTimeline";
import Label from "@/components/Label";
import SectorBars from "@/components/SectorBars";
import { certifications, education, languages, profile } from "@/content/cv";
import { careerStart } from "@/lib/cv";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "CV", description: profile.intro };

export default function CvPage() {
  return (
    <div className="wrap">
      <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
        <div>
          <Label idx="01">Curriculum vitae</Label>
          <h1 className="text-[48px]">{site.name}</h1>
          <p className="text-[21px] leading-[1.5] text-ink mt-3.5 max-w-[44ch]">{profile.intro}</p>
        </div>
        <div className="flex flex-col gap-2.5 md:items-end">
          <a className="btn" href="/cv.pdf" download>
            ↓ Last ned PDF
          </a>
          <span className="font-mono text-[12.5px] text-mute">oppdatert {profile.updated}</span>
        </div>
      </div>

      <section className="mt-14">
        <Label>Erfaring</Label>
        <EmployerTimeline />
      </section>

      <section className="mt-14">
        <Label>Bransjer</Label>
        <SectorBars />
      </section>

      <div className="grid md:grid-cols-[1fr_280px] gap-16 mt-14">
        <div>
          <Label>Om profilen</Label>
          {profile.about.map((p) => (
            <p key={p.slice(0, 30)} className="text-ink-2 text-[15.5px] mb-4 max-w-[68ch]">
              {p}
            </p>
          ))}
        </div>

        <aside>
          <Block
            title="Sertifiseringer"
            items={certifications.map((c) => ({ ...c, when: c.date.slice(0, 4) }))}
          />
          <Block
            title="Utdanning"
            items={education.map((e) => ({ ...e, when: e.to.slice(0, 4) }))}
          />
          <div className="mb-10">
            <Label>Områder</Label>
            <CompetenceSpans />
            <p className="font-mono text-[11px] text-mute mt-2.5 leading-[1.5]">
              {careerStart.slice(0, 4)} → nå. Fylt strek = i bruk nå.
            </p>
          </div>
          <div className="mb-10">
            <Label>Språk</Label>
            {languages.map((l) => (
              <div
                key={l.name}
                className="flex justify-between font-mono text-xs py-[7px] border-t border-line"
              >
                <span>{l.name}</span>
                <span className="text-mute">{l.level}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Block({
  title,
  items,
}: {
  title: string;
  items: { when: string; title: string; by: string }[];
}) {
  return (
    <div className="mb-10">
      <Label>{title}</Label>
      {items.map((it) => (
        <div key={it.title} className="py-2.5 border-t border-line">
          <div className="font-mono text-xs text-accent-text font-semibold">{it.when}</div>
          <div className="text-[15.5px] font-semibold">{it.title}</div>
          <div className="text-[13px] text-mute">{it.by}</div>
        </div>
      ))}
    </div>
  );
}
