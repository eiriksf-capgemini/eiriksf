"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { readonly n: string; readonly label: string; readonly href: string };

export default function NavLinks({ items }: { items: readonly Item[] }) {
  const path = usePathname();
  return (
    <nav className="flex gap-1.5" aria-label="Hovedmeny">
      {items.map((it) => {
        const active = path === it.href || path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={[
              "font-mono text-[13px] px-2.5 py-1.5 rounded inline-flex gap-2 items-baseline",
              "hover:bg-bg-2 hover:text-ink",
              active ? "text-ink bg-bg-2 shadow-[inset_0_-2px_0_var(--accent)]" : "text-ink-2",
            ].join(" ")}
          >
            <span className="text-accent-text text-[11px] font-bold">{it.n}</span>
            <span className="hidden sm:inline">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
