#!/usr/bin/env node
// UI-verifiseringsharness (esf-07k.1).
//
// Server den statiske eksporten i out/ og kjører et sett med gjenbrukbare,
// nettleserbaserte sjekker mot én navngitt side:
//   - scrollbredde ved en gitt viewport (oppdager horisontal overflow)
//   - aksesibilitetstre (accessibility tree)
//   - axe-core-kjøring (WCAG-relaterte brudd)
//   - tastaturnavigasjon (Tab-rekkefølge, document.activeElement per steg)
//   - elementgeometri (getBoundingClientRect for navngitte CSS-selektorer)
//
// Output er tekst ment for direkte sitering i en close reason. Selve
// akseptkriteriene (hva som er "riktig" scrollbredde, hvilke axe-brudd som
// er greie, osv.) er IKKE harnessets jobb – det hører til hver enkelt bead.
//
// Avhengighetene (playwright, axe-core) ligger bevisst i denne mappens egen
// package.json/pnpm-lock.yaml – IKKE i rot-package.json – og mappen er
// listet i .dockerignore. Se README.md i denne mappen for hvorfor.
import { parseArgs } from "node:util";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { stat } from "node:fs/promises";
import { startStaticServer } from "./serve.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const outDir = join(repoRoot, "out");
const require = createRequire(import.meta.url);

const HELP = `
Bruk: pnpm verify:ui -- [valg]

Valg:
  --path <sti>          Side å besøke, f.eks. /cv/ eller /ki/ (default: /)
  --viewport <BxH>       Viewport i piksler, f.eks. 360x800 (default: 1280x800)
  --tab-steps <n>        Antall Tab-trykk å registrere (default: 20)
  --selectors <css,css>  Kommaseparert liste CSS-selektorer for geometrisjekk
  --json                  Skriv rapporten som JSON i stedet for tekst
  --help                  Vis denne hjelpeteksten

Eksempel:
  pnpm verify:ui -- --path /cv/ --viewport 360x800 --selectors "h1,.card"
`;

function parseViewport(raw) {
  const match = /^(\d+)x(\d+)$/.exec(raw.trim());
  if (!match) {
    throw new UsageError(`Ugyldig --viewport "${raw}". Forventet format: BREDDExHØYDE, f.eks. 360x800.`);
  }
  return { width: Number(match[1]), height: Number(match[2]) };
}

function normalizePagePath(raw) {
  let p = raw.trim();
  if (!p.startsWith("/")) p = `/${p}`;
  // trailingSlash: true i next.config.ts – alle "sider" (uten filendelse) ligger
  // som <sti>/index.html. Filer (feed.xml, cv.pdf, ...) skal IKKE få lagt til "/".
  const looksLikeFile = /\.[a-zA-Z0-9]+$/.test(p);
  if (!looksLikeFile && !p.endsWith("/")) p += "/";
  return p;
}

class UsageError extends Error {}
class HarnessError extends Error {}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch (err) {
    if (err && (err.code === "ERR_MODULE_NOT_FOUND" || err.code === "MODULE_NOT_FOUND")) {
      throw new HarnessError(
        [
          "Avhengighetene for UI-verifiseringsharnesset er ikke installert.",
          "",
          "Kjør (én gang):",
          "  pnpm --dir tools/verify-ui install",
          "",
          "og prøv deretter igjen: pnpm verify:ui -- --path <sti>",
        ].join("\n"),
      );
    }
    throw err;
  }
}

async function launchBrowser(chromium) {
  try {
    return await chromium.launch({ headless: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("Executable doesn't exist")) {
      throw new HarnessError(
        [
          "Chromium-binæren som Playwright trenger er ikke lastet ned.",
          "",
          "Dette er med vilje: å installere avhengigheter (pnpm install) laster",
          "ALDRI ned en nettleser automatisk her – nedlastingen er et eget,",
          "eksplisitt steg du må kjøre selv (og som docker build aldri kjører):",
          "",
          "  pnpm --dir tools/verify-ui run install:browser",
          "",
          "Prøv deretter igjen: pnpm verify:ui -- --path <sti>",
        ].join("\n"),
      );
    }
    throw err;
  }
}

async function ensureOutDir() {
  try {
    const st = await stat(outDir);
    if (!st.isDirectory()) throw new Error("not a directory");
  } catch {
    throw new HarnessError(
      [
        `Fant ikke en statisk eksport i ${outDir}.`,
        "",
        "Kjør bygg først:",
        "  pnpm build",
        "",
        "og prøv deretter igjen: pnpm verify:ui -- --path <sti>",
      ].join("\n"),
    );
  }
}

async function runChecks(page, { tabSteps, selectors }) {
  const scroll = await page.evaluate(() => ({
    documentScrollWidth: document.documentElement.scrollWidth,
    documentClientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    windowInnerWidth: window.innerWidth,
  }));
  const horizontalOverflow = scroll.documentScrollWidth > scroll.documentClientWidth;

  let accessibilityTree = null;
  let accessibilityError = null;
  try {
    // page.accessibility.snapshot() er fjernet fra Playwright (var allerede
    // deprecated). ariaSnapshot() gir et lesbart YAML-tre av ARIA-rollene –
    // nettopp det et aksesibilitetstre skal vise, og i et format som er
    // trivielt å sitere rått i en close reason.
    accessibilityTree = await page.locator("html").ariaSnapshot();
  } catch (err) {
    accessibilityError = err instanceof Error ? err.message : String(err);
  }

  let axeResults = null;
  let axeError = null;
  try {
    const axePath = require.resolve("axe-core/axe.min.js");
    await page.addScriptTag({ path: axePath });
    axeResults = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      const result = await window.axe.run();
      return {
        violations: result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.map((n) => ({ target: n.target, html: n.html })),
        })),
        passes: result.passes.length,
        incomplete: result.incomplete.length,
      };
    });
  } catch (err) {
    axeError = err instanceof Error ? err.message : String(err);
  }

  // Nullstill fokus til dokumentet, ikke til et spesifikt element, før vi
  // begynner å Tab-e – ellers starter vandringen midt i DOM-en.
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });

  const tabOrder = [];
  for (let i = 0; i < tabSteps; i += 1) {
    await page.keyboard.press("Tab");
    // eslint-disable-next-line no-await-in-loop
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const text = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("alt") || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 60);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        role: el.getAttribute("role"),
        href: el.getAttribute("href"),
        text,
      };
    });
    tabOrder.push({ step: i + 1, focused: info });
    if (!info) break; // fokus falt tilbake til <body> – resten av løkka gir ikke mer info
  }

  const geometry = [];
  for (const selector of selectors) {
    // eslint-disable-next-line no-await-in-loop
    const rect = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, right: r.right, bottom: r.bottom, left: r.left };
    }, selector);
    geometry.push({ selector, rect });
  }

  return {
    scroll: { ...scroll, horizontalOverflow },
    accessibilityTree,
    accessibilityError,
    axeResults,
    axeError,
    tabOrder,
    geometry,
  };
}

function printTextReport(report) {
  const { page, viewport, result } = report;
  const lines = [];
  lines.push("=".repeat(70));
  lines.push(`UI-verifiseringsrapport – ${page.path}`);
  lines.push(`URL: ${page.url}`);
  lines.push(`Viewport: ${viewport.width}x${viewport.height}`);
  lines.push("=".repeat(70));

  lines.push("");
  lines.push("-- Scrollbredde --");
  lines.push(`documentElement.scrollWidth: ${result.scroll.documentScrollWidth}`);
  lines.push(`documentElement.clientWidth: ${result.scroll.documentClientWidth}`);
  lines.push(`body.scrollWidth:            ${result.scroll.bodyScrollWidth}`);
  lines.push(`window.innerWidth:          ${result.scroll.windowInnerWidth}`);
  lines.push(`Horisontal overflow: ${result.scroll.horizontalOverflow ? "JA" : "nei"}`);

  lines.push("");
  lines.push("-- axe-core --");
  if (result.axeError) {
    lines.push(`(axe-core feilet: ${result.axeError})`);
  } else {
    const v = result.axeResults.violations;
    lines.push(`${v.length} brudd funnet (${result.axeResults.passes} bestått, ${result.axeResults.incomplete} uavklart).`);
    for (const violation of v) {
      lines.push(`  [${violation.impact ?? "ukjent alvorlighet"}] ${violation.id}: ${violation.help}`);
      lines.push(`    ${violation.helpUrl}`);
      for (const node of violation.nodes) {
        lines.push(`    - ${node.target.join(" ")}`);
      }
    }
  }

  lines.push("");
  lines.push(`-- Tastaturrekkefølge (${result.tabOrder.length} Tab-trykk) --`);
  if (result.tabOrder.length === 0) {
    lines.push("(ingen fokuserbare elementer funnet)");
  }
  for (const entry of result.tabOrder) {
    if (!entry.focused) {
      lines.push(`  ${entry.step}. (fokus falt tilbake til <body>)`);
      continue;
    }
    const f = entry.focused;
    const extras = [f.id ? `id="${f.id}"` : null, f.role ? `role="${f.role}"` : null, f.href ? `href="${f.href}"` : null]
      .filter(Boolean)
      .join(" ");
    lines.push(`  ${entry.step}. <${f.tag}> ${extras} "${f.text}"`.trimEnd());
  }

  lines.push("");
  lines.push("-- Elementgeometri --");
  if (result.geometry.length === 0) {
    lines.push("(ingen --selectors oppgitt – hoppet over)");
  }
  for (const g of result.geometry) {
    if (!g.rect) {
      lines.push(`  ${g.selector}: IKKE FUNNET`);
      continue;
    }
    const r = g.rect;
    lines.push(
      `  ${g.selector}: x=${r.x.toFixed(1)} y=${r.y.toFixed(1)} w=${r.width.toFixed(1)} h=${r.height.toFixed(1)} (top=${r.top.toFixed(1)} right=${r.right.toFixed(1)} bottom=${r.bottom.toFixed(1)} left=${r.left.toFixed(1)})`,
    );
  }

  lines.push("");
  lines.push("-- Aksesibilitetstre (ARIA-snapshot) --");
  if (result.accessibilityError) {
    lines.push(`(kunne ikke hente aksesibilitetstre: ${result.accessibilityError})`);
  } else if (!result.accessibilityTree) {
    lines.push("(tomt tre)");
  } else {
    lines.push(result.accessibilityTree.trimEnd());
  }

  lines.push("");
  lines.push("=".repeat(70));

  console.log(lines.join("\n"));
}

async function main() {
  // pnpm forwarder enkelte ganger den bokstavelige "--" brukeren skrev etter
  // scriptnavnet (f.eks. "pnpm verify:ui -- --path /cv/") videre til selve
  // prosessen, i tillegg til at node:util sin parseArgs tolker en "--" i
  // argv som "resten er positional args". Fjern en eventuell ledende "--"
  // før parsing, slik at flaggene våre blir tolket som flagg uansett hvilken
  // pakkebehandler/skall som kalte oss.
  const rawArgs = process.argv.slice(2);
  const args = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;

  const { values } = parseArgs({
    args,
    options: {
      path: { type: "string", default: "/" },
      viewport: { type: "string", default: "1280x800" },
      "tab-steps": { type: "string", default: "20" },
      selectors: { type: "string", default: "" },
      json: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  const pagePath = normalizePagePath(values.path);
  const viewport = parseViewport(values.viewport);
  const tabSteps = Number.parseInt(values["tab-steps"], 10);
  if (!Number.isFinite(tabSteps) || tabSteps < 0) {
    throw new UsageError(`Ugyldig --tab-steps "${values["tab-steps"]}". Forventet et ikke-negativt heltall.`);
  }
  const selectors = values.selectors
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await ensureOutDir();
  const { chromium } = await loadPlaywright();

  const server = await startStaticServer(outDir);
  let browser;
  try {
    browser = await launchBrowser(chromium);
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const url = new URL(pagePath, server.url).toString();
    await page.goto(url, { waitUntil: "networkidle" });

    const result = await runChecks(page, { tabSteps, selectors });
    const report = { page: { path: pagePath, url }, viewport, result };

    if (values.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      printTextReport(report);
    }
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
}

main().catch((err) => {
  if (err instanceof UsageError) {
    console.error(`Ugyldig bruk: ${err.message}`);
    console.error(HELP);
    process.exitCode = 1;
    return;
  }
  if (err instanceof HarnessError) {
    console.error(err.message);
    process.exitCode = 1;
    return;
  }
  // Uventet feil – vis stacktrace, dette er IKKE den forventede "mangler
  // nettleser"-situasjonen som K3 dreier seg om.
  console.error("Uventet feil i verify:ui:");
  console.error(err);
  process.exitCode = 1;
});
