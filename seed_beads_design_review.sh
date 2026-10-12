#!/usr/bin/env bash
# Oppretter beads fra designreviewen i docs/design-review-2026-10-12.md.
# Kjør én gang fra repo-roten. Krever: bd, jq.
# Verifiser flaggnavn mot `bd create --help` / `bd update --help` for din bd-versjon.
#
# /cv-arbeidet får et eget epic (esf-hnd er levert og venter bare på esf-hnd.12).
# /ki-arbeidet får også et eget epic: esf-btl ble levert og lukket 7/7 samme
# dag som denne reviewen, så dette er ny scope, ikke uferdig gammel.
set -euo pipefail

mk() { # mk <nøkkel> <parent|-> <prioritet> <type> <tittel> <beskrivelse> <akseptanse> <notater>
  local key=$1 parent=$2 prio=$3 type=$4 title=$5 desc=$6 acc=$7 notes=$8 new_id
  local args=("$title" -t "$type" -p "$prio" -d "$desc" --acceptance "$acc" --json)
  [[ $parent != - ]] && args+=(--parent "$parent")
  new_id=$(bd create "${args[@]}" | jq -r '.id')
  bd update "$new_id" --notes "$notes" >/dev/null
  eval "ID_$key=\$new_id"
  echo "  $new_id  $title"
}
id_of() { eval "echo \"\$ID_$1\""; }
dep() { bd dep add "$(id_of "$1")" "$(id_of "$2")"; } # $1 avhenger av $2

echo "Epic"
mk E - 1 epic "Kompakt CV: samme innhold på halve høyden" \
"As a visitor to eiriksf.no, I want /cv to show the same career information in roughly half the vertical space, so that I get the overview in one or two screens instead of scrolling through four separate charts that repeat the same time axis.

In scope: merging the employer, role and credential graphics into one figure on a shared axis, a dense employer list, a lg+ sidebar for reference data (PDF, key figures, areas, sectors, languages), moving the profile paragraph into the hero, and a stacked sector bar.
Out of scope: changing CV facts in content/cv.ts; the PDF itself (esf-hnd.9, esf-hnd.12); /ki (esf-btl)." \
"K1: Given all child beads are closed, when /cv is loaded at 1440x900, the page from the h1 to the footer is at most 1700px tall (measured at 3369px on 2026-10-12) and every fact visible today is still on the page or behind a details expansion.
Verified by: document.documentElement.scrollHeight measured in the built export, plus a diff of the text content before and after showing no employer, job, certification, sector or language dropped.

K2: Following should never happen: the date axis is drawn more than once on /cv.
Verified by: grep of app/cv/page.tsx and components/ showing a single consumer of the axis ticks, plus visual review.

K3: Following should never happen: a radar, spider, polar, pie or conic-gradient chart appears on /cv - the guardrail from esf-hnd still applies.
Verified by: case-insensitive grep for radar|spider|polar|conic-gradient|<circle across app/cv and the components it imports." \
"Premise verified: read app/cv/page.tsx, EmployerTimeline.tsx, RoleProgression.tsx, CredentialMarkers.tsx and screenshots of localhost:8080/cv/ on 2026-10-12. Height measured in a headless browser at 1440x900 against the built export: h1 to footer 3369px, scrollHeight 3595px, about four screens. The review's own estimate of ~2900px was low; K1 uses the measured figure. EmployerTimeline, RoleProgression, CredentialMarkers and CompetenceSpans each draw their own 2007-to-now axis. An employer row is ~150px for one line of prose; the bar track is full width but the filled segment is 3-15% of it. The profile paragraph sits last, after all graphics, and the PDF button appears twice. Background and sketches in docs/design-review-2026-10-12.md."

echo "/cv"
mk C1 "$ID_E" 1 feature "Samlet tidslinje for arbeidsgivere, rolle og sertifiseringer" \
"As a visitor, I want employers, role level and certifications on one chart with one shared axis, so that I can see what I was doing, at what level and what I had earned at the same point in time without comparing three separate charts.

In scope: one figure with a thin lane per employer (12-14px), a credential lane with dots and short labels, role level shown as bar intensity or a thin step line above the lanes, and the existing caption about the non-monotonic role curve as figure text. Replaces the bars in EmployerTimeline, RoleProgression and CredentialMarkers.
Out of scope: the text list under the figure (own bead); changing role levels in content/cv.ts." \
"K1: Given the employers, jobs and credentials in content/cv.ts, when /cv is loaded at 1440px, the figure shows one lane per employer, one dot per credential and the role level of every job, and is at most 260px tall.
Verified by: headless-browser count of lanes and dots against content/cv.ts, plus a bounding-box height check.

K2: Given a screen reader or a 360px viewport, the information in the figure is still available as text in reading order.
Verified by: tools/verify-ui at 360x800 and axe-core with zero violations; the figure stays aria-hidden and the text equivalent exists in the DOM.

K3: Following should never happen: SC-900 and PSM I (both 2022-11) collide into one unreadable mark, or a credential before 2007 falls outside the figure.
Verified by: visual review at 1440px and 360px, plus a bounds check that every dot and label is inside the container.

K4: Following should never happen: a credential year list comes back as a substitute for the markers - esf-hnd.6 removed that pattern on purpose.
Verified by: grep for a list that renders certifications outside the figure." \
"Premise verified: read components/EmployerTimeline.tsx, RoleProgression.tsx and CredentialMarkers.tsx on 2026-10-12. All three compute pos() from careerStart and careerMonths in lib/cv.ts, so the shared axis already exists as data; only the rendering is repeated. Keeps the rule from esf-hnd.2 of one row per employer, never per client. Supersedes the visual part of esf-hnd.2, esf-hnd.4 and esf-hnd.6; their acceptance criteria on keyboard, 360px and no horizontal overflow carry over."

mk C2 "$ID_E" 1 feature "Tett erfaringsliste med hele raden som utvidelse" \
"As a visitor, I want the job list under the timeline to be dense and scannable, so that I read employer, years, title and one line per job without three stacked layers per row.

In scope: a list with years in a narrow mono column, employer as group heading, one row per job, the whole row as the details summary with a + / - at the right, and the 'nå' and 'N oppdrag' markers kept.
Out of scope: the timeline bars (C1); the content of the expanded details." \
"K1: Given the jobs in content/cv.ts, when /cv is loaded at 1440px, every job renders exactly once with title, org when via is set, and oneLine, and the collapsed list is at most 70px per job on average.
Verified by: headless-browser count against content/cv.ts and total list height divided by job count.

K2: Given a keyboard-only user, tabbing reaches every row and Enter or Space expands it with aria-expanded reflecting state.
Verified by: scripted keyboard walk in tools/verify-ui.

K3: Following should never happen: expansion stops working without JavaScript.
Verified by: built page loaded with JavaScript disabled; details/summary still opens." \
"Premise verified: read components/EmployerTimeline.tsx on 2026-10-12. Today each employer row has name + bar, the job lines in a 254px-indented ul, and a separate 'Vis detaljer' summary line underneath, ~30px of which is only the toggle. Keep <details>/<summary> as the mechanism (reasons in the component's header comment)."

mk C3 "$ID_E" 1 feature "Sidespalte for oppslagsdata og profilteksten i hero" \
"As a visitor, I want the narrative at the top and the reference data beside the career, so that I read who this is first and look up areas, sectors and languages without scrolling past the timeline.

In scope: profile.about[0] moved into the hero under the intro; one PDF button and one updated date; a key-figure strip (years, employers, sectors, credentials) derived in lib/cv.ts; a lg+ two-column layout (1fr / ~260px) with a sticky aside holding PDF, key figures, areas, sectors and languages; a wider .wrap variant for /cv only.
Out of scope: redesigning areas or sectors (own beads); /, /innlegg and /ki layouts." \
"K1: Given /cv at 1440px, the profile paragraph is above the timeline, the page has exactly one PDF download link, and the aside is visible beside the timeline.
Verified by: DOM order check and a count of a[href=\"/cv.pdf\"] in out/cv/index.html.

K2: Given /cv below lg, the aside content follows the main column in today's reading order and nothing scrolls horizontally at 360px.
Verified by: tools/verify-ui at 360x800 and 1024x768 (scrollWidth equals clientWidth).

K3: Following should never happen: a key figure is typed by hand and drifts from the data.
Verified by: grep showing the strip reads only values computed in lib/cv.ts from content/cv.ts." \
"Premise verified: read app/cv/page.tsx on 2026-10-12. The hero right column holds only the PDF button and two dates that are currently identical; the 'Om profilen' grid sits last with a second PDF button. The comment about esf-hnd.7 (only the first paragraph on the page, the rest in the PDF) still applies - move the paragraph, do not add the other two. The 'one dataset per fact' rule in CLAUDE.md covers the key-figure strip; esf-hnd.11 is the precedent for years-of-experience drifting."

mk C4 "$ID_E" 2 task "Bransjer som én stablet stolpe" \
"As a visitor, I want sector exposure as one horizontal stacked bar with a legend, so that I see the split at a glance in a fraction of the space six separate bars take.

In scope: SectorBars rendered as one 100% horizontal bar plus a two-column legend with duration and share; the headline sentence ('19 år 7 mnd fordelt på 6 bransjer - tyngst i helse') kept; fits the C3 aside.
Out of scope: changing sector assignments in content/cv.ts." \
"K1: Given the sectors in content/cv.ts, the segments sum to 100% and each legend row shows the same duration and percentage as today.
Verified by: comparing rendered values in out/cv/index.html against SectorBars' current output.

K2: Following should never happen: the bar becomes a pie, donut or any other circular chart.
Verified by: grep for <circle, conic-gradient and arc paths in components/SectorBars.tsx.

K3: Following should never happen: a segment below ~2% (Mellom oppdrag, 1.7%) becomes invisible or unlabelled.
Verified by: visual review at 1440px and 360px; the legend lists every segment." \
"Premise verified: read components/SectorBars.tsx and the 2026-10-12 screenshot. Six rows take ~420px; the headline sentence is the strongest part of the section. Horizontal stacked bar keeps clear of the radar-language guardrail."

mk C5 "$ID_E" 2 task "Områder som liste i sidespalten" \
"As a visitor, I want competence areas as a short list with year spans, so that the aside does not carry a fourth miniature time axis that is too narrow to read.

In scope: CompetenceSpans rendered as name + year spans in mono with a filled dot for 'in use now'; the legend line '2007 → nå. Fylt strek = i bruk nå.' updated to match.
Out of scope: the area data in content/cv.ts." \
"K1: Given the areas in content/cv.ts, every area and every span renders as text in the aside, and the 'in use now' marker matches spans with to: null.
Verified by: comparing out/cv/index.html against content/cv.ts.

K2: Following should never happen: a 1-5 dot rating returns - esf-hnd.5 removed it on purpose.
Verified by: grep for repeated dot markup in components/CompetenceSpans.tsx." \
"Premise verified: read app/cv/page.tsx and the 2026-10-12 screenshot. In the 280px aside the mini bars are ~230px wide for a 19-year span, so a one-year span is ~12px. Depends on C3 for the aside."

dep C2 C1
dep C4 C3
dep C5 C3

echo "/ki"
mk KE - 2 epic "Radaren skal bruke bredden på /ki" \
"As a visitor, I want /ki to use the width it has, so that the radar reads as the centrepiece of the page instead of a centred square with empty margins on both sides.

In scope: the placement of the radar on the page, how the intro and legend flow around it, and tying a legend entry to its blip without client JavaScript.
Out of scope: the radar data and blip placement (content/radar.ts, delivered under esf-btl); the front-page strip; the experiments and principles sections." \
"K1: Given all child beads are closed, when /ki is loaded at 1440x900, the radar sits against the right edge of the content column with text flowing around it, and the page is no taller than it is today.
Verified by: visual review plus scrollHeight compared against the 2477px measured on 2026-10-12.

K2: Following should never happen: the layout work adds client JavaScript to a page that is server-rendered today.
Verified by: grep for \"use client\" under app/ki and in TechRadar.tsx, and the Lighthouse performance gate still passing.

K3: Following should never happen: the radar becomes unreadable or disappears below md, where it is deliberately hidden in favour of the legend.
Verified by: tools/verify-ui at 360x800 with zero axe violations and no horizontal overflow." \
"Premise verified 2026-10-12: esf-btl delivered the radar itself and closed 7/7 the same day this review was written, so this is new scope rather than unfinished work - the same reasoning the /cv epic above uses for esf-hnd. Measured in a headless browser at 1440x900: /ki scrollHeight 2477px. The SVG sits in a hidden md:flex justify-center wrapper capped at 600px, so on a 1440px screen the chart is centred with empty space on both sides. Sketches in docs/design-review-2026-10-12.md section 3."

mk K1 "$ID_KE" 2 feature "Høyrestilt radar med tekst som flyter rundt sirkelen" \
"As a visitor, I want the radar placed to the right with the intro and legend flowing around it, so that the page uses its width instead of a centred chart with empty space on both sides.

In scope: on md+, a wrapper around the SVG with float: right, ~420px width, shape-outside: circle(50%) and shape-margin; the h1 stays full width above the float; the legend changes from a CSS grid to normal block flow so it can wrap around the curve.
Out of scope: blip placement and numbering; the legend content; the front-page strip." \
"K1: Given /ki at 1440px, the radar sits at the right edge of the content column and lines of intro and the first legend ring wrap along the circle, not a rectangle.
Verified by: visual review and a headless-browser check that legend lines next to the radar end at varying x positions.

K2: Given /ki below md, layout and reading order are unchanged from today (SVG hidden, legend only).
Verified by: tools/verify-ui at 360x800 with zero axe violations and no horizontal overflow.

K3: Following should never happen: the legend stays a grid and sits beside the float as a block, or text overlaps the SVG.
Verified by: computed display of the legend container is not grid/flex, plus visual review at 768px, 1024px and 1440px.

K4: Following should never happen: the change adds client JavaScript to /ki.
Verified by: no \"use client\" in app/ki or TechRadar.tsx, and lhci autorun keeps performance >= 0.9." \
"Premise verified: read components/TechRadar.tsx and app/ki/page.tsx on 2026-10-12. The SVG is in a hidden md:flex justify-center wrapper, max 600px; the legend is grid sm:grid-cols-2, which creates a block formatting context and will not wrap around a float. Chosen as alternative A in docs/design-review-2026-10-12.md section 3; the user asked for the radar right-aligned with text flowing around it."

mk K2 "$ID_KE" 3 feature "Uthev blip når legendeposten har hover eller fokus" \
"As a visitor, I want the matching blip highlighted when I hover or focus a legend item, so that I can find a tool in the radar without counting numbers.

In scope: data-blip on legend items and data-dot on SVG groups, CSS :has() rules generated at build time from content/radar.ts, optionally a sticky radar on lg+.
Out of scope: highlighting in the other direction (blip to legend), tooltips." \
"K1: Given any blip, hovering or focusing its legend item visibly highlights exactly that blip and no other.
Verified by: headless-browser check per blip comparing computed styles before and after hover.

K2: Following should never happen: the highlight is implemented with React state or client JavaScript.
Verified by: no \"use client\" and no useState in TechRadar.tsx; CLAUDE.md requires deriving state from the DOM.

K3: Following should never happen: highlight relies on colour alone.
Verified by: the highlighted blip also changes size or outline; axe and a manual check in both themes." \
"Premise verified: read components/TechRadar.tsx on 2026-10-12. Blips and legend share the number n from place(), so a stable key already exists. Alternative B in docs/design-review-2026-10-12.md; compatible with K1 and lower priority."

dep K2 K1

echo; echo "Ferdig. Neste: bd ready"
