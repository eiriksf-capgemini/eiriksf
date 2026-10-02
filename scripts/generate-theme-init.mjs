// Genererer en innholds-hashet, statisk fil av theme-init-scriptet under public/,
// slik at den kan refereres med <script src="..."> (ekstern, same-origin fil)
// i stedet for en inline <script>. Dette gjør at CSP script-src kan være
// 'self' uten 'unsafe-inline'.
//
// Kjøres automatisk før dev/build/typecheck (se package.json: pre*-scripts),
// slik at hash og generert manifest alltid er i sync med innholdet i
// scripts/theme-init.js.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = join(rootDir, "scripts", "theme-init.js");
const publicDir = join(rootDir, "public");
const manifestPath = join(rootDir, "lib", "theme-init-asset.generated.ts");

const source = readFileSync(sourcePath, "utf8");
const hash = createHash("sha256").update(source).digest("hex").slice(0, 10);
const fileName = `theme-init.${hash}.js`;

// Rydd bort gamle hashede varianter fra tidligere kjøringer.
for (const entry of readdirSync(publicDir)) {
  if (/^theme-init\.[a-f0-9]+\.js$/.test(entry) && entry !== fileName) {
    unlinkSync(join(publicDir, entry));
  }
}

writeFileSync(join(publicDir, fileName), source);

writeFileSync(
  manifestPath,
  `// Auto-generert av scripts/generate-theme-init.mjs – ikke rediger manuelt.
export const themeInitSrc = "/${fileName}";
`,
);

console.log(`[generate-theme-init] ${fileName}`);
