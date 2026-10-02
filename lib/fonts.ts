import localFont from "next/font/local";

// Selvhostet Inter (sans) – statiske woff2-filer, ingen eksterne kall.
export const inter = localFont({
  src: [
    { path: "../app/fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

// Selvhostet JetBrains Mono – statiske woff2-filer, ingen eksterne kall.
export const jetbrainsMono = localFont({
  src: [
    { path: "../app/fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/jetbrains-mono-600.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/jetbrains-mono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
