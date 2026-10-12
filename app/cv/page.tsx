import type { Metadata } from "next";
import CareerTimeline from "@/components/CareerTimeline";
import CompetenceSpans from "@/components/CompetenceSpans";
import EmployerTimeline from "@/components/EmployerTimeline";
import Label from "@/components/Label";
import SectorBars from "@/components/SectorBars";
import { languages, profile } from "@/content/cv";
import { careerStart, cvKeyFigures } from "@/lib/cv";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "CV", description: profile.intro };

export default function CvPage() {
  return (
    <div className="wrap wrap-cv">
      {/* Fortellingen først. Profilavsnittet stod før nederst, etter all
          grafikken, der det var det siste en leser møtte i stedet for det
          første (esf-7qk.3). Fortsatt bare ingressen: de to andre avsnittene
          hører til PDF-en, siden skal ikke konkurrere med dokumentet
          (esf-hnd.7). */}
      <Label idx="01">Curriculum vitae</Label>
      <h1 className="text-[48px]">{site.name}</h1>
      <p className="text-[21px] leading-[1.5] text-ink mt-3.5 max-w-[44ch]">{profile.intro}</p>
      <p className="text-ink-2 text-[15.5px] mt-4 max-w-[68ch]">{profile.about[0]}</p>

      <div className="grid lg:grid-cols-[1fr_260px] gap-x-14 gap-y-12 mt-8 items-start">
        <section>
          <Label>Erfaring</Label>
          <CareerTimeline />
          <EmployerTimeline />
        </section>

        {/* Oppslagsdata ved siden av karrieren, ikke under den. Sticky fra lg
            og opp slik at nedlasting og nøkkeltall følger med mens tidslinjen
            rulles; under lg faller spalten ned etter hovedkolonnen. */}
        <aside className="lg:sticky lg:top-10 flex flex-col gap-10">
          <div>
            <a className="btn" href="/cv.pdf" download>
              ↓ Last ned full CV (PDF)
            </a>
            <p className="font-mono text-[11.5px] text-mute mt-2.5 leading-[1.5]">
              Alle detaljer fra hvert oppdrag ligger i PDF-en
              <br />
              oppdatert {profile.pdfUpdated}
            </p>
          </div>

          <div>
            <Label>Nøkkeltall</Label>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              {cvKeyFigures.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[19px] text-ink leading-none">{f.value}</dt>
                  <dd className="font-mono text-[11px] text-mute mt-1.5 leading-[1.35]">
                    {f.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <Label>Områder</Label>
            <CompetenceSpans />
            <p className="font-mono text-[11px] text-mute mt-2.5 leading-[1.5]">
              {careerStart.slice(0, 4)} → nå. Fylt prikk = i bruk nå.
            </p>
          </div>

          <div>
            <Label>Bransjer</Label>
            <SectorBars />
          </div>

          <div>
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
