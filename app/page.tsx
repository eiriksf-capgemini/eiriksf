import Link from "next/link";
import Label from "@/components/Label";
import PostRow from "@/components/PostRow";
import { Tags } from "@/components/Tag";
import { getAllPosts } from "@/lib/posts";
import { profile } from "@/content/cv";
import { careerYears, formatYm, stats } from "@/lib/cv";
import { site } from "@/lib/site";
import { newestSince, testBlipsBySinceDesc } from "@/content/radar";

/**
 * Antall kolonner i "Prøver ut nå"-stripen følger antall blips, ikke en fast
 * firedeling som Nøkkeltall – ringen kan ha 1–4 elementer, og klassenavnene
 * må stå bokstavelig i kilden for at Tailwind skal generere dem.
 */
const TRYOUT_GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-4",
};

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  const tryoutBlips = testBlipsBySinceDesc().slice(0, 4);
  const tryoutUpdated = newestSince();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: site.title,
    worksFor: {
      "@type": "Organization",
      name: site.employer,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
    },
    description: site.description,
    email: site.links.email,
    sameAs: [site.links.linkedin, site.links.github],
  };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {/* Hero */}
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-14 items-end">
        <div>
          <div className="font-mono text-[13px] text-mute mb-5 flex gap-2.5 items-center">
            <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)]" />
            {site.title} · {site.employer} · {site.location}
          </div>
          <h1 className="text-[clamp(40px,6vw,68px)]">
            Bygger plattformer som gjør utviklingsteam{" "}
            <em className="not-italic text-accent-text bg-[linear-gradient(transparent_70%,var(--accent-soft)_70%)]">
              selvgående.
            </em>
          </h1>
          <p className="text-[21px] leading-[1.5] text-ink mt-6 max-w-[44ch]">
            Plattformutvikling, Kubernetes, GitOps og utviklerplattformer. {careerYears}+ år i
            helse, energi, offentlig sektor og forsikring.
          </p>
          <div className="flex gap-3 mt-8">
            <Link className="btn btn-primary" href="/cv/">
              Les CV <span>→</span>
            </Link>
            <Link className="btn" href="/innlegg/">
              Siste innlegg
            </Link>
          </div>
        </div>

        <Whoami />
      </div>

      <hr className="hairline" />

      {/* Nøkkeltall */}
      <div className="grid grid-cols-2 md:grid-cols-4 border border-line rounded-md overflow-hidden">
        {stats.map((s, i) => (
          <div
            key={s.desc}
            className={[
              "p-5 px-6 border-line",
              i % 2 === 0 ? "border-r" : "md:border-r",
              i === stats.length - 1 ? "md:border-r-0" : "",
              i < 2 ? "border-b md:border-b-0" : "",
            ].join(" ")}
          >
            <div className="text-[40px] font-semibold tracking-[-0.03em] leading-none text-accent-text">
              {s.num}
              {s.sup && <sup className="text-ink text-[18px]">{s.sup}</sup>}
            </div>
            <div className="font-mono text-[11.5px] text-mute mt-2">{s.desc}</div>
          </div>
        ))}
      </div>

      <hr className="hairline" />

      {/* Prøver ut nå – speiler Nøkkeltall sin rammede grid, data fra content/radar.ts */}
      {tryoutBlips.length > 0 && (
        <>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <Label idx="01">Prøver ut nå</Label>
            {tryoutUpdated && (
              <span className="font-mono text-[12.5px] text-mute shrink-0">
                oppdatert {formatYm(tryoutUpdated)}
              </span>
            )}
          </div>
          <div
            className={[
              "grid border border-line rounded-md overflow-hidden",
              TRYOUT_GRID_COLS[tryoutBlips.length],
            ].join(" ")}
          >
            {tryoutBlips.map((b, i) => (
              <div
                key={b.id}
                className={[
                  "p-5 px-6 border-line",
                  i < tryoutBlips.length - 1 ? "border-b md:border-b-0" : "",
                  i < tryoutBlips.length - 1 ? "md:border-r" : "",
                ].join(" ")}
              >
                <div className="font-semibold text-[15px] text-ink">{b.name}</div>
                <div className="text-ink-2 text-[13.5px] leading-snug mt-1.5">{b.note}</div>
                <div className="font-mono text-[11px] text-mute mt-2.5">{formatYm(b.since)}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Link className="btn" href="/ki/">
              Se hele radaren <span>→</span>
            </Link>
          </div>
          {/* Skilleren hører til stripen: står den utenfor betingelsen, får
              forsiden to nakne hairlines på rad den dagen tester-ringen er tom. */}
          <hr className="hairline" />
        </>
      )}

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Label idx="02">Siste innlegg</Label>
          {posts.map((p) => (
            <PostRow key={p.slug} post={p} />
          ))}
        </div>
        <div>
          <Label idx="03">Kjernekompetanse</Label>
          <Tags items={profile.keySkills} hot={profile.hot} />
          <p className="text-ink-2 text-[15px] mt-6">{profile.about[2]}</p>
        </div>
      </div>
    </div>
  );
}

function Whoami() {
  const rows: [string, React.ReactNode][] = [
    ["navn", site.name],
    ["rolle", "Platform / DevOps / Tech Lead"],
    ["fokus", "IDP · Kubernetes · GitOps · Sikkerhet"],
    ["stack", "Azure · AKS · ArgoCD · Backstage"],
    [
      "status",
      <span key="status" className="text-accent-text">
        tilgjengelig for rådgivning
      </span>,
    ],
  ];
  return (
    <div className="border border-line border-t-[3px] border-t-accent rounded-md bg-bg-2 font-mono text-[12.5px] px-5 py-4 leading-[1.75] text-ink-2">
      <div className="flex gap-1.5 -mt-1.5 mb-2.5" aria-hidden>
        <i className="w-[9px] h-[9px] rounded-full bg-accent" />
        <i className="w-[9px] h-[9px] rounded-full bg-line-2" />
        <i className="w-[9px] h-[9px] rounded-full bg-line-2" />
      </div>
      <div className="text-mute">$ whoami</div>
      {rows.map(([k, v]) => (
        <div key={k}>
          <span className="text-mute inline-block w-[92px]">{k}</span>
          <span className="text-ink">{v}</span>
        </div>
      ))}
      <div className="mt-2">
        <span className="text-mute">$</span>
        <span className="cursor" style={{ height: 13 }} aria-hidden />
      </div>
    </div>
  );
}
