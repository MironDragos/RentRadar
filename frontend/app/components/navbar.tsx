import Link from "next/link";

const LINKS = [
  { href: "/listings", label: "Anunțuri" },
  { href: "/deals", label: "Oferte bombă" },
  { href: "/stats", label: "Statistici" },
];

export default function Navbar() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-text"
        >
          RENT<span className="text-accent">RADAR</span>
        </Link>

        <nav className="flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-text/80">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}