import type { Metadata } from "next";
import CompetenceSpans from "@/components/CompetenceSpans";
import CredentialMarkers from "@/components/CredentialMarkers";
import EmployerTimeline from "@/components/EmployerTimeline";
import Label from "@/components/Label";
import SectorBars from "@/components/SectorBars";
import { languages, profile } from "@/content/cv";
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
          <span className="font-mono text-[12.5px] text-mute md:text-right">
            siden oppdatert {profile.updated}
            <br />
            PDF oppdatert {profile.pdfUpdated}
          </span>
        </div>
      </div>

      <section className="mt-14">
        <Label>Erfaring</Label>
        <EmployerTimeline />
      </section>

      <section className="mt-12">
        <Label>Sertifiseringer og utdanning</Label>
        <CredentialMarkers />
      </section>

      <section className="mt-14">
        <Label>Bransjer</Label>
        <SectorBars />
      </section>

      <div className="grid md:grid-cols-[1fr_280px] gap-16 mt-14">
        <div>
          <Label>Om profilen</Label>
          {/* Bare ingressen her. De to andre avsnittene står i PDF-en – siden
              skal ikke konkurrere med dokumentet (esf-hnd.7). */}
          <p className="text-ink-2 text-[15.5px] mb-5 max-w-[68ch]">{profile.about[0]}</p>
          <a className="btn" href="/cv.pdf" download>
            ↓ Last ned full CV (PDF)
          </a>
          <p className="font-mono text-[11.5px] text-mute mt-2.5">
            Alle detaljer fra hvert oppdrag ligger i PDF-en · oppdatert {profile.pdfUpdated}
          </p>
        </div>

        <aside>
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
