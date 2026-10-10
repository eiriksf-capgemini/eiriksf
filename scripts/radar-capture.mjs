#!/usr/bin/env node
// Fanger en URL til teknologiradar-innboksen (content/radar-inbox.jsonl) med
// én kommando, slik at det koster nesten ingenting å notere et interessant
// verktøy mens man leser nyhetsbrev. Triage (velge kvadrant/ring/notat og
// flytte inn i content/radar.ts) skjer senere, i en egen omgang — denne
// kommandoen tar bare vare på url + tittel + kilde + dato.
//
// Bruk:
//   pnpm radar:capture <url> --source="TLDR AI"
//
// Bevisste designvalg:
// - "Best effort"-henting: klarer vi ikke å nå siden (DNS/nettverksfeil,
//   timeout, 4xx/5xx) eller finner ingen <title>, skriver vi likevel linjen
//   — med tom tittel — og avslutter med kode 0. Triage kan fylle inn tittel
//   manuelt senere; en unnlatt fangst er verre enn en tom tittel.
// - Dupliseringssjekk er en ren strengsammenligning av URL-en, mot både
//   innboksen og mot `url`-feltet på publiserte blips i content/radar.ts.
//   Nesten ingen blips har satt `url` i dag (se kommentarene i radar.ts), så
//   det siste sjekket treffer bare de få som faktisk har fått URL-en skrevet
//   inn — det er ikke en generell "er dette verktøyet allerede dekket"-sjekk.
// - content/radar.ts leses som ren tekst (regex), IKKE importert/evaluert —
//   dette er en .mjs-fil uten noen TypeScript-transpilering tilgjengelig, og
//   vi ønsker uansett ikke å kjøre innholdet i filen, bare lese det.
// - Ingen avhengigheter: Node 22+ har global fetch, i likhet med
//   scripts/generate-theme-init.mjs er dette en frittstående helper.

import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const inboxPath = join(rootDir, "content", "radar-inbox.jsonl");
const radarPath = join(rootDir, "content", "radar.ts");

const FETCH_TIMEOUT_MS = 8000;
const MAX_BODY_BYTES = 200_000; // nok til å finne <title> i så godt som alle sider

function parseArgs(argv) {
  let url;
  let source = "";
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--source=")) {
      source = arg.slice("--source=".length);
    } else if (arg === "--source") {
      source = argv[i + 1] ?? "";
      i++;
    } else if (!arg.startsWith("--") && url === undefined) {
      url = arg;
    }
  }
  return { url, source };
}

function readExistingInboxUrls() {
  if (!existsSync(inboxPath)) return new Set();
  const lines = readFileSync(inboxPath, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== "");
  const urls = new Set();
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (typeof entry.url === "string") urls.add(entry.url.trim());
    } catch {
      // Ødelagt/uparserbar linje — ignorer den i dup-sjekken (den blir
      // stående i filen uendret; dette scriptet reparerer ikke innboksen).
    }
  }
  return urls;
}

/**
 * Henter publiserte blip-URLer fra content/radar.ts med et regex-søk i
 * kildeteksten. Fanger kun de få blips som faktisk har satt `url: "..."` —
 * de aller fleste har ikke det (se toppkommentaren i radar.ts).
 */
function readPublishedBlipUrls() {
  if (!existsSync(radarPath)) return new Set();
  const source = readFileSync(radarPath, "utf8");
  const urls = new Set();
  const re = /url:\s*["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(source)) !== null) {
    urls.add(match[1].trim());
  }
  return urls;
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!match) return "";
  return decodeEntities(match[1]).trim().replace(/\s+/g, " ");
}

/** Henter <title> fra en URL. Feiler aldri — returnerer "" ved enhver feil. */
async function fetchTitle(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return "";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(parsed, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": "radar-capture/1.0 (+personal tech radar inbox)" },
    });
    if (!response.ok || !response.body) return "";

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let totalBytes = 0;
    try {
      while (totalBytes < MAX_BODY_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        buffer += decoder.decode(value, { stream: true });
        const title = extractTitle(buffer);
        if (title) return title;
      }
    } finally {
      reader.cancel().catch(() => {});
    }
    return extractTitle(buffer);
  } catch {
    // Nettverksfeil, DNS-feil, timeout (AbortError), ikke-2xx uten body osv.
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const { url, source } = parseArgs(process.argv.slice(2));
  if (!url) {
    console.error('Bruk: pnpm radar:capture <url> --source="TLDR AI"');
    process.exitCode = 1;
    return;
  }

  const trimmedUrl = url.trim();

  const inboxUrls = readExistingInboxUrls();
  if (inboxUrls.has(trimmedUrl)) {
    console.log(`Allerede i innboksen, hopper over: ${trimmedUrl}`);
    return;
  }

  const publishedUrls = readPublishedBlipUrls();
  if (publishedUrls.has(trimmedUrl)) {
    console.log(`Allerede publisert som blip i content/radar.ts, hopper over: ${trimmedUrl}`);
    return;
  }

  const title = await fetchTitle(trimmedUrl);
  const entry = {
    url: trimmedUrl,
    title,
    source,
    captured: new Date().toISOString().slice(0, 10),
  };

  appendFileSync(inboxPath, `${JSON.stringify(entry)}\n`, "utf8");
  console.log(`Fanget: ${trimmedUrl}${title ? ` — "${title}"` : " (ingen tittel funnet)"}`);
}

main();
