// Minimal statisk filserver for out/ (next build -> output: "export").
// Ingen avhengigheter – bruker kun node:http/node:fs. Speiler try_files-
// logikken i docker/nginx.conf (uri, uri/index.html, uri.html, 404.html),
// slik at harnesset ser samme ruting som produksjonsbildet.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

function safeJoin(outDir, pathname) {
  // Fjern ethvert forsøk på "../"-traversering før vi join'er mot out/.
  const cleaned = normalize(pathname).replace(/^([.][.][/\\])+/, "");
  const full = join(outDir, cleaned);
  if (!full.startsWith(outDir + sep) && full !== outDir) {
    return outDir; // fall tilbake til roten – stat() under feiler uskadelig
  }
  return full;
}

export async function startStaticServer(outDir) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      const base = safeJoin(outDir, pathname);

      const candidates = [base, join(base, "index.html"), `${base}.html`];

      for (const candidate of candidates) {
        try {
          const st = await stat(candidate);
          if (st.isFile()) {
            const body = await readFile(candidate);
            res.writeHead(200, {
              "content-type": CONTENT_TYPES[extname(candidate)] ?? "application/octet-stream",
            });
            res.end(body);
            return;
          }
        } catch {
          // prøv neste kandidat
        }
      }

      const notFoundBody = await readFile(join(outDir, "404.html")).catch(() => Buffer.from("404 Not Found"));
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(notFoundBody);
    } catch (err) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end(`500 Internal Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.removeListener("error", reject);
      resolve(undefined);
    });
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve(undefined))),
  };
}
