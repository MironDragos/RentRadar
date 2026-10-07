"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/listings", label: "Anunțuri" },
  { href: "/deals", label: "Oferte bombă" },
  { href: "/stats", label: "Statistici" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="relative border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-text sm:text-2xl"
          onClick={() => setMenuOpen(false)}
        >
          RENT<span className="text-accent">RADAR</span>
        </Link>

        <button
          type="button"
          className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-text/80 transition-colors hover:border-accent hover:text-accent sm:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Închide" : "Meniu"}</span>
          <span aria-hidden="true" className="flex w-3 flex-col gap-0.5 text-accent">
            {menuOpen ? (
              <span className="text-xs leading-none">X</span>
            ) : (
              <>
                <span className="h-px w-3 bg-current" />
                <span className="h-px w-3 bg-current" />
                <span className="h-px w-3 bg-current" />
              </>
            )}
          </span>
        </button>

        <nav
          id="mobile-navigation"
          className={`${menuOpen ? "flex" : "hidden"} absolute inset-x-4 top-18 z-10 flex-col border border-line bg-panel p-3 font-mono text-xs uppercase tracking-widest text-text/80 shadow-lg sm:static sm:flex sm:flex-row sm:items-center sm:gap-8 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:text-xs lg:gap-10`}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line px-3 py-3 transition-colors last:border-b-0 hover:text-accent sm:border-0 sm:px-0 sm:py-0 sm:last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}