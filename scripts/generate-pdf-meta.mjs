// Leser ut datoen public/cv.pdf ble produsert, og skriver den til en generert
// modul siden kan vise ved siden av nedlastingslenken.
//
// Hvorfor dette og ikke et felt i content/cv.ts: datoen stod der før, og et
// håndskrevet tall blir stående når filen byttes. Da lover siden en ferskhet
// dokumentet ikke har - nettopp det esf-hnd.9 finnes for å unngå. Nå kan de
// to ikke gli fra hverandre: bytter du PDF-en, flytter datoen seg av seg selv
// (esf-hnd.12).
//
// Kilden er PDF-ens egen CreationDate, ikke filens mtime og ikke
// byggetidspunktet. mtime overlever ikke en git clone - en fersk utsjekk gir
// utsjekkstidspunktet - og byggetidspunktet ville sagt at CV-en var oppdatert
// i dag hver gang noe helt annet på siden ble bygget.
//
// Kjøres automatisk før dev/build/typecheck (se package.json: pre*-scripts).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const pdfPath = join(rootDir, "public", "cv.pdf");
const outPath = join(rootDir, "lib", "pdf-meta.generated.ts");

/**
 * PDF-datoer ser ut som D:YYYYMMDDHHmmSSZ eller D:YYYYMMDDHHmmSS+02'00'.
 * Vi trenger bare måneden og dagen, så tidssone og klokkeslett ignoreres.
 */
function readCreationDate(buffer) {
  const match = /\/CreationDate\s*\(\s*D:(\d{4})(\d{2})(\d{2})/.exec(buffer.toString("latin1"));
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

let pdf;
try {
  pdf = readFileSync(pdfPath);
} catch {
  console.error(
    "[generate-pdf-meta] Fant ikke public/cv.pdf. Siden kan ikke oppgi en dato for et dokument som ikke finnes.",
  );
  process.exit(1);
}

const created = readCreationDate(pdf);
if (!created) {
  // Hellere stoppe enn å gjette. En dato vi ikke kan lese ut av dokumentet er
  // en dato vi ikke kan stå inne for, og da er det bedre at bygget sier fra.
  console.error(
    "[generate-pdf-meta] Fant ingen CreationDate i public/cv.pdf. Legg inn en dato i dokumentet, eller oppdater denne leseren hvis formatet er nytt.",
  );
  process.exit(1);
}

writeFileSync(
  outPath,
  `// Auto-generert av scripts/generate-pdf-meta.mjs – ikke rediger manuelt.
// Lest ut av CreationDate i public/cv.pdf.
export const pdfUpdated = "${created}";
`,
);

console.log(`[generate-pdf-meta] cv.pdf produsert ${created}`);
