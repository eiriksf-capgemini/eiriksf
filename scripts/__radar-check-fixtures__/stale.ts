// Fixture for scripts/radar-check.mjs (esf-btl.4, K3): alle blips er ellers
// gyldige, men har `since`-datoer langt tilbake i tid, slik at ingen ring er
// endret de siste 120 dagene. Brukes kun av radar-check-testen.
export const blips = [
  {
    id: "old-one",
    name: "Gammel Ting Én",
    quadrant: "agenter",
    ring: "bruker",
    since: "2024-01",
    note: "En gyldig blip som ikke har flyttet ring på lenge.",
  },
  {
    id: "old-two",
    name: "Gammel Ting To",
    quadrant: "plattform",
    ring: "tester",
    since: "2024-03",
    note: "En annen gyldig blip, også uendret lenge.",
  },
];
