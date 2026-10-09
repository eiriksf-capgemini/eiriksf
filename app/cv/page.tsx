import type { Metadata } from "next";
import Label from "@/components/Label";
import { Tags } from "@/components/Tag";
import {
  certifications,
  competence,
  education,
  jobs,
  languages,
  profile,
  type Job,
} from "@/content/cv";
import { formatSpans } from "@/lib/cv";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "CV", description: profile.intro };

const MND = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];

function fmt(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return `${MND[m - 1]} ${y}`;
}
function duration(from: string, to: string | null) {
  const [fy, fm] = from.split("-").map(Number);
  const end = to ? to.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  const months = (end[0] - fy) * 12 + (end[1] - fm) + 1;
  const y = Math.floor(months / 12),
    m = months % 12;
  return [y ? `${y} år` : "", m ? `${m} mnd` : ""].filter(Boolean).join(" ");
}

export default function CvPage() {
  const full = jobs.filter((j) => !j.compact);
  const compact = jobs.filter((j) => j.compact);

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

      <div className="grid md:grid-cols-[1fr_280px] gap-16 mt-14">
        <div>
          <Label>Erfaring</Label>
          {full.map((j) => (
            <JobRow key={j.org + j.from} job={j} />
          ))}

          <div className="mt-10">
            <Label>Tidligere</Label>
            {compact.map((j) => (
              <div
                key={j.org + j.from}
                className="grid md:grid-cols-[150px_1fr] gap-1 md:gap-7 py-4 border-t border-line"
              >
                <div className="font-mono text-[12.5px] text-accent-text">
                  {j.from.slice(0, 4)} — {j.to?.slice(0, 4)}
                </div>
                <div>
                  <span className="font-medium">{j.title}</span>
                  <span className="font-mono text-[12.5px] text-mute"> · {j.org}</span>
                  <p className="text-ink-2 text-[14.5px] mt-1 mb-0">{j.summary[0]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <Label>Om profilen</Label>
            {profile.about.map((p) => (
              <p key={p.slice(0, 30)} className="text-ink-2 text-[15.5px] mb-4 max-w-[68ch]">
                {p}
              </p>
            ))}
          </div>
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
            {competence.map((c) => (
              <div
                key={c.name}
                className="flex justify-between gap-3 font-mono text-xs py-[7px] border-t border-line"
              >
                <span>{c.name}</span>
                <span className="text-accent-text whitespace-nowrap">{formatSpans(c.spans)}</span>
              </div>
            ))}
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

function JobRow({ job }: { job: Job }) {
  const current = job.to === null;
  return (
    <div className="grid md:grid-cols-[150px_1fr] gap-2 md:gap-7 py-8 border-t border-line">
      <div className="font-mono text-[12.5px] text-mute leading-[1.7]">
        <b className="block text-accent-text font-semibold text-sm">
          {job.from.slice(0, 4)} — {current ? "nå" : job.to!.slice(0, 4)}
          {current && <span className="text-[9px] align-[2px]"> ●</span>}
        </b>
        {fmt(job.from)} – {current ? "" : fmt(job.to!)}
        <br />
        <span className="text-accent-text">{current ? "pågår" : duration(job.from, job.to)}</span>
      </div>
      <div>
        <h3 className="text-[20px] mb-0.5">{job.title}</h3>
        <div className="font-mono text-[13px] font-semibold text-accent-text mb-3">
          {job.org}
          {job.via && <span className="text-mute font-normal"> · via {job.via}</span>}
        </div>
        {job.summary.map((s) => (
          <p key={s.slice(0, 30)} className="text-ink-2 text-[15px] mb-3">
            {s}
          </p>
        ))}
        <div className="mt-3.5">
          <Tags items={job.tags} />
        </div>
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
