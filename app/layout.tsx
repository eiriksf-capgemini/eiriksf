import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import { inter, jetbrainsMono } from "@/lib/fonts";
import { themeInitSrc } from "@/lib/theme-init-asset.generated";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.handle}`, template: `%s — ${site.handle}` },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: site.handle,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="no"
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Setter tema før første paint for å unngå blink. Ekstern, same-origin,
            innholds-hashet fil (public/theme-init.<hash>.js, se scripts/generate-theme-init.mjs)
            slik at scriptet ikke er "inline" og CSP script-src kan være 'self'.
            Scriptet må kjøre synkront (ikke async/defer) før resten av <body>
            rendres, for å unngå blink av feil tema – derfor slås lint-regelen
            av for akkurat denne linjen. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src={themeInitSrc} />
      </head>
      <body className="min-h-dvh flex flex-col">
        <a href="#hovedinnhold" className="skip-link">
          Hopp til hovedinnhold
        </a>
        <Header />
        <main id="hovedinnhold" className="flex-1 py-14 pb-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
