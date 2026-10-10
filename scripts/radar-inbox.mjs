#!/usr/bin/env node
// Mekanikken bak /radar-triage: lese innboksen, og markere en fangst som
// akseptert eller avvist. Selve vurderingen — kvadrant, ring og den ene
// setningen — gjør et menneske; dette scriptet tar bare bokføringen, slik at
// den delen er etterprøvbar og ikke avhenger av at en agent husker riktig.
//
//   node scripts/radar-inbox.mjs list
//   node scripts/radar-inbox.mjs accept <url>
//   node scripts/radar-inbox.mjs reject <url>
//
// Akseptert = linjen fjernes (blipen lever nå i content/radar.ts).
// Avvist    = linjen blir stående med et rejected-felt. Den blir dermed
//             fortsatt sett som duplikat av radar-capture, så den samme
//             URL-en foreslås ikke på nytt neste gang.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const inboxPath = join(dirname(fileURLToPath(import.meta.url)), "..", "content", "radar-inbox.jsonl");

function read() {
  if (!existsSync(inboxPath)) return [];
  return readFileSync(inboxPath, "utf8")
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map((l, i) => {
      try {
        return JSON.parse(l);
      } catch {
        throw new Error(`Ugyldig JSON på linje ${i + 1} i content/radar-inbox.jsonl`);
      }
    });
}

const write = (entries) =>
  writeFileSync(inboxPath, entries.map((e) => JSON.stringify(e)).join("\n") + (entries.length ? "\n" : ""), "utf8");

const [cmd, url] = process.argv.slice(2);
const entries = read();

if (cmd === "list") {
  const pending = entries.filter((e) => !e.rejected);
  if (pending.length === 0) {
    console.log("Innboksen er tom – ingenting å triagere.");
  } else {
    console.log(`${pending.length} fangst(er) til triage:\n`);
    for (const e of pending) {
      console.log(`  ${e.url}`);
      console.log(`    tittel: ${e.title || "(ingen)"}`);
      console.log(`    kilde:  ${e.source || "(ukjent)"} · fanget ${e.captured}\n`);
    }
  }
} else if (cmd === "accept" || cmd === "reject") {
  if (!url) {
    console.error(`Bruk: node scripts/radar-inbox.mjs ${cmd} <url>`);
    process.exit(1);
  }
  const hit = entries.find((e) => e.url === url && !e.rejected);
  if (!hit) {
    console.error(`Fant ingen ubehandlet fangst med URL ${url}`);
    process.exit(1);
  }
  if (cmd === "accept") {
    write(entries.filter((e) => e !== hit));
    console.log(`Akseptert og fjernet fra innboksen: ${url}`);
  } else {
    hit.rejected = new Date().toISOString().slice(0, 10);
    write(entries);
    console.log(`Avvist (blir stående som duplikatsperre): ${url}`);
  }
} else {
  console.error("Bruk: node scripts/radar-inbox.mjs list|accept <url>|reject <url>");
  process.exit(1);
}
