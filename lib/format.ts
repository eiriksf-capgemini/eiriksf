/** ISO-dato → "2026-09-18" (brukes konsekvent i mono-stil) */
export const isoDate = (d: string | Date) =>
  (typeof d === "string" ? new Date(d) : d).toISOString().slice(0, 10);

/** Grov lesetid basert på ~200 ord/min */
export const readingTime = (text: string) =>
  Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
