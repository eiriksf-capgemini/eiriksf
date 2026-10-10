// Fixture for scripts/radar-check.mjs (esf-btl.4, K1): én forekomst av hver
// defekt scriptet skal avvise. Brukes kun av radar-check-testen, ikke av
// appen. Ikke en reell radardatafil.
export const blips = [
  {
    id: "dup-id",
    name: "Første Duplikat",
    quadrant: "agenter",
    ring: "bruker",
    since: "2024-01",
    note: "Et gyldig notat for den første duplikat-id-en.",
  },
  {
    id: "dup-id",
    name: "Andre Duplikat",
    quadrant: "agenter",
    ring: "bruker",
    since: "2024-02",
    note: "Et gyldig notat for den andre duplikat-id-en.",
  },
  {
    id: "bad-since",
    name: "Ugyldig Dato",
    quadrant: "modeller",
    ring: "tester",
    since: "2024-13",
    note: "Notatet er greit, men datoen har en ugyldig måned.",
  },
  {
    id: "future-date",
    name: "Fremtidig Ting",
    quadrant: "plattform",
    ring: "vurderer",
    since: "2099-01",
    note: "Denne har en dato langt fram i tid.",
  },
  {
    id: "empty-note",
    name: "Tomt Notat",
    quadrant: "styring",
    ring: "lagt-bort",
    since: "2023-05",
    note: "   ",
  },
  {
    id: "long-note",
    name: "Altfor Langt Notat",
    quadrant: "agenter",
    ring: "tester",
    since: "2023-06",
    note: "Dette notatet er med vilje skrevet altfor langt for å teste at valideringsregelen for maks nittifire tegn faktisk slår ut som forventet i denne testen her.",
  },
  {
    id: "dup-name-a",
    name: "Samme Navn",
    quadrant: "modeller",
    ring: "bruker",
    since: "2023-07",
    note: "Et gyldig notat for navnedupliseringstesten.",
  },
  {
    id: "dup-name-b",
    name: "Samme Navn",
    quadrant: "modeller",
    ring: "tester",
    since: "2023-08",
    note: "Et annet gyldig notat for samme navn-test.",
  },
];
