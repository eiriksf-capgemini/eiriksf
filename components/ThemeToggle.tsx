"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

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
