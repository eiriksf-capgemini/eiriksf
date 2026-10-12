"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/**
 * Temaet bor i `data-theme` på <html>, satt av theme-init-scriptet før første
 * paint. Knappen leser det derfor rett fra DOM-en med useSyncExternalStore i
 * stedet for å speile det i egen state: verdien finnes allerede når vi
 * rendrer, og vi slipper å skrive den inn i state fra en effect – som er
 * nettopp det react-hooks/set-state-in-effect advarer mot (esf-07k.12).
 *
 * Konsekvensen er at `toggle` bare skriver til DOM og localStorage. Endringen
 * på attributtet plukkes opp av observatøren under, som ber React rendre på
 * nytt. Det finnes dermed ingen kopi av temaet som kan komme ut av sync.
 */
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return (document.documentElement.dataset.theme as Theme) ?? "light";
}

/**
 * Under prerendering finnes ingen DOM å lese fra. "light" er samme antakelse
 * som før og matcher standardtemaet i app/globals.css, så markupen serveren
 * sender stemmer med det klienten hydrerer.
 */
function getServerSnapshot(): Theme {
  return "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }, [theme]);

  return (
    <button
      type="button"
      onClick={toggle}
      className="font-mono text-xs border border-line-2 text-ink-2 px-2.5 py-1 rounded hover:border-accent hover:text-accent-text"
      aria-label={theme === "dark" ? "Bytt til lys modus" : "Bytt til mørk modus"}
    >
      <span aria-hidden>{theme === "dark" ? "◑" : "◐"}</span> {theme === "dark" ? "lys" : "mørk"}
    </button>
  );
}
