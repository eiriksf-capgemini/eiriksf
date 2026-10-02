#!/usr/bin/env bash
# Oppretter backloggen i Beads. Kjør én gang fra repo-roten etter `bd init`.
# Krever: bd, jq. Verifiser flaggnavn mot `bd create --help` / `bd dep add --help` for din bd-versjon.
set -euo pipefail

mk() { # mk <nøkkel> <prioritet 0-4> <type> <tittel> <beskrivelse>
  local key=$1 prio=$2 type=$3 title=$4 desc=$5 new_id
  new_id=$(bd create "$title" -t "$type" -p "$prio" -d "$desc" --json | jq -r '.id')
  eval "ID_$key=\$new_id"
  echo "  $new_id  $title"
}
id_of() { eval "echo \"\$ID_$1\""; }
dep() { bd dep add "$(id_of "$1")" "$(id_of "$2")"; }                      # $1 avhenger av $2
child() { bd dep add "$(id_of "$1")" "$(id_of "$2")" --type parent-child; } # $1 er under epic $2

echo "Epics"
mk E1 1 epic "Fundament: første build og container" "Få prosjektet til å bygge lokalt og kjøre i Docker."
mk E2 1 epic "Innhold" "Ekte CV-data, PDF, første innlegg, KI-radar."
mk E3 1 epic "Design, UX og tilgjengelighet" "Kontrast, tastatur, mobil, fonter, ikoner."
mk E4 2 epic "Plattform og drift" "CI, registry, kjøremiljø, oppdateringer, CSP."
mk E5 2 epic "Synlighet og metadata" "Feed, strukturerte data, analysebeslutning."

echo "E1"
mk E1_1 0 task "Første lokale build går grønt" "pnpm install, typecheck, lint, build. Ferdig når out/ genereres uten feil."
mk E1_2 0 task "Lås avhengigheter og sjekk inn pnpm-lock.yaml" "Pin Next/Tailwind/next-mdx-remote. Dockerfile med --frozen-lockfile."
mk E1_3 0 task "Verifiser Docker-image og nginx-ruting" "compose up; test /, /cv/, /innlegg/<slug>/, 404, /healthz, cache-headere. Image < 30 MB."
mk E1_4 1 task "Fyll inn lib/site.ts" "Domene, LinkedIn, GitHub, e-post. Ingen plassholdere."
mk E1_5 1 chore "Git-repo, første commit, bd init" "bd ready skal vise neste bead."
for k in E1_1 E1_2 E1_3 E1_4 E1_5; do child $k E1; done
dep E1_2 E1_1; dep E1_3 E1_2; dep E1_5 E1_1

echo "E2"
mk E2_1 1 task "Kvalitetssikre content/cv.ts mot CV-PDF" "Skriv ut Capgemini-rollen. CV-siden kan sendes til rekrutterer."
mk E2_2 1 task "Legg public/cv.pdf" "Eksport fra CV-malen. Nedlastingsknappen virker."
mk E2_3 1 task "Skriv første ekte innlegg" "Erstatt de tre eksemplene. Minst ett innlegg med draft: false."
mk E2_4 2 task "Oppdater KI-radar og eksperimenter" "Kun reelle verktøy og eksperimenter i content/ki.ts."
mk E2_5 2 task "Profilbilde og OG-bilde" "OG 1200x630 i public/. Deling på LinkedIn viser bilde."
for k in E2_1 E2_2 E2_3 E2_4 E2_5; do child $k E2; done
dep E2_2 E2_1

echo "E3"
mk E3_1 1 bug "Kontrast: oransje på lys bakgrunn under WCAG AA" "#E4601A på #F5F2EC er ~3.5:1. Mørkere variant (f.eks. #C8500F) for små mono-etiketter. Alle tekstflater >= 4.5:1."
mk E3_2 1 task "Tastatur og skjermleser" "Oransje fokusring, skip-link, landemerker. Lighthouse a11y >= 95."
mk E3_3 1 task "Mobilgjennomgang" "Hero, nøkkeltall, CV-tidslinje, radar, header. Ingen horisontal scroll på 360 px."
mk E3_4 1 feature "Selvhostede fonter via next/font/local" "Inter + JetBrains Mono, font-display: swap. Ingen eksterne kall."
mk E3_5 2 task "Favicon og app-ikoner" "app/icon.svg og apple-icon.png med eiriksf_-motiv."
mk E3_6 3 feature "Klientside-filtrering av innlegg på kategori" "Filter uten reload, URL ?kat=."
for k in E3_1 E3_2 E3_3 E3_4 E3_5 E3_6; do child $k E3; done
dep E3_3 E1_3; dep E3_6 E2_3

echo "E4"
mk E4_1 1 feature "CI: lint, typecheck, build, docker build på PR" "GitHub Actions. Rød/grønn status på PR."
mk E4_2 2 feature "Publiser image til GHCR" "sha- og latest-tag."
mk E4_3 2 task "Kjøremiljø, reverse proxy og TLS" "Velg VPS/k8s/Container Apps. Siden på eget domene over HTTPS."
mk E4_4 2 chore "Dependabot/Renovate for npm og Docker base images" "Første auto-PR har kommet."
mk E4_5 3 task "CSP-herding: fjern unsafe-inline for script" "Flytt tema-init til egen fil med hash."
mk E4_6 3 task "Lighthouse performance i CI" "Performance >= 95."
for k in E4_1 E4_2 E4_3 E4_4 E4_5 E4_6; do child $k E4; done
dep E4_1 E1_5; dep E4_2 E4_1; dep E4_3 E4_2; dep E4_4 E1_5; dep E4_5 E1_3; dep E4_6 E4_1

echo "E5"
mk E5_1 2 feature "RSS/Atom-feed" "app/feed.xml/route.ts med force-static + link rel=alternate. Feed validerer."
mk E5_2 3 task "Strukturerte data (Person, BlogPosting)" "JSON-LD. Rich Results Test uten feil."
mk E5_3 3 task "Beslutning om analyse" "Selvhostet Umami/Plausible eller bevisst ingen. Dokumenter i README."
for k in E5_1 E5_2 E5_3; do child $k E5; done
dep E5_1 E2_3; dep E5_2 E1_4; dep E5_3 E4_3

echo; echo "Ferdig. Neste: bd ready"