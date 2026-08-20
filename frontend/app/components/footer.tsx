export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="font-display text-xl">
            RENT<span className="text-accent">RADAR</span>
          </p>
          <p className="mt-2 max-w-sm font-body text-sm text-text/70">
            Date culese zilnic de pe 999.md prin scraper automat. Fără
            estimări, fără interpolări, doar ce e listat public.
          </p>
        </div>

        <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-text/60 md:items-end">
          <span>Sursă: 999.md</span>
          <span>Actualizat zilnic, ora 04:00</span>
          <span>Chișinău, Moldova</span>
        </div>
      </div>
    </footer>
  );
}