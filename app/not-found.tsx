import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="font-mono text-accent-text text-sm mb-4">404</div>
      <h1 className="text-[48px]">Fant ikke siden.</h1>
      <p className="text-ink-2 mt-4 mb-8">Lenken kan være gammel, eller innholdet er flyttet.</p>
      <Link href="/" className="btn btn-primary">
        ← Til forsiden
      </Link>
    </div>
  );
}
