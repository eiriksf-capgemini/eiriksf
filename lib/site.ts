export const site = {
  name: "Eirik Sander-Fjeld",
  handle: "eiriksf",
  title: "Senior Managing Consultant",
  employer: "Capgemini",
  location: "Bergen",
  url: "https://eiriksf.no",
  description:
    "Plattformutvikling, Kubernetes, GitOps og utviklerplattformer. Digital CV, innlegg og notater om KI og teknologi.",
  links: {
    linkedin: "https://www.linkedin.com/in/eiriksf",
    github: "https://github.com/eiriksf",
    email: "mailto:post@eiriksf.no",
  },
} as const;

export const nav = [
  { n: "01", label: "cv", href: "/cv/" },
  { n: "02", label: "innlegg", href: "/innlegg/" },
  { n: "03", label: "ki & teknologi", href: "/ki/" },
] as const;
