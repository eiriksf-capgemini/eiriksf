import Link from "next/link";
import { nav, site } from "@/lib/site";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b-2 border-accent backdrop-blur-md bg-bg/90">
      <div className="wrap flex items-center justify-between h-14">
        <Link href="/" className="font-mono text-sm font-semibold" aria-label={`${site.handle} – til forsiden`}>
          {site.handle}
          <span className="cursor" aria-hidden />
        </Link>
        <NavLinks items={nav} />
        <ThemeToggle />
      </div>
    </header>
  );
}
