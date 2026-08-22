"use client";

import { useMemo, useState } from "react";

type Listing = {
  id: string;
  title: string;
  sector: string;
  rooms: number;
  area: number;
  price: number;
};

// TODO: înlocuiește cu fetch către Express /listings (cu query params pentru filtre/paginare)
const MOCK_LISTINGS: Listing[] = Array.from({ length: 42 }).map((_, i) => {
  const sectors = ["Centru", "Botanica", "Buiucani", "Rîșcani", "Ciocana", "Telecentru"];
  const sector = sectors[i % sectors.length];
  const rooms = (i % 3) + 1;
  const area = 25 + rooms * 18 + (i % 5) * 3;
  const price = Math.round(area * (5 + (i % 4)));
  return {
    id: `${i + 1}`,
    title: `${rooms} camer${rooms === 1 ? "ă" : "e"}, ${sector}`,
    sector,
    rooms,
    area,
    price,
  };
});

const SECTORS = ["Toate", "Centru", "Botanica", "Buiucani", "Rîșcani", "Ciocana", "Telecentru"];
const PAGE_SIZE = 12;

export default function ListingsPage() {
  const [sector, setSector] = useState("Toate");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_LISTINGS.filter((l) => {
      if (sector !== "Toate" && l.sector !== sector) return false;
      if (l.price > maxPrice) return false;
      return true;
    });
  }, [sector, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateSector(next: string) {
    setSector(next);
    setPage(1);
  }

  function updateMaxPrice(next: number) {
    setMaxPrice(next);
    setPage(1);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {filtered.length.toLocaleString("ro-RO")} rezultate
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wide md:text-5xl">
          ANUNȚURI
        </h1>
      </div>

      {/* FILTRE */}
      <div className="mb-8 flex flex-wrap items-end gap-8 border border-line bg-panel p-6">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
            Sector
          </span>
          <div className="flex flex-wrap gap-px bg-line">
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => updateSector(s)}
                className={`px-3 py-2 font-mono text-xs uppercase tracking-widest ${
                  sector === s
                    ? "bg-accent text-bg"
                    : "bg-bg text-text/70 hover:text-text"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
            Preț maxim: {maxPrice} €
          </span>
          <input
            type="range"
            min={100}
            max={1000}
            step={10}
            value={maxPrice}
            onChange={(e) => updateMaxPrice(Number(e.target.value))}
            className="w-56 accent-accent"
          />
        </div>
      </div>

      {/* TABEL */}
      <div className="border border-line">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-line px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-text/50">
          <span>Anunț</span>
          <span>Sector</span>
          <span>Suprafață</span>
          <span className="text-right">Preț</span>
        </div>

        {paged.map((l, i) => (
          <div
            key={l.id}
            className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-4 ${
              i !== 0 ? "border-t border-line" : ""
            }`}
          >
            <span className="font-body text-sm">{l.title}</span>
            <span className="font-mono text-xs text-text/60">{l.sector}</span>
            <span className="font-mono text-xs text-text/60">{l.area} m²</span>
            <span className="text-right font-mono text-lg">{l.price} €</span>
          </div>
        ))}

        {paged.length === 0 && (
          <div className="px-6 py-12 text-center font-body text-sm text-text/50">
            Niciun anunț nu corespunde filtrelor alese.
          </div>
        )}
      </div>

      {/* PAGINARE */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between font-mono text-xs uppercase tracking-widest">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-text/70 hover:text-accent disabled:opacity-30"
          >
            ← Anterior
          </button>
          <span className="text-text/50">
            Pagina {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-text/70 hover:text-accent disabled:opacity-30"
          >
            Următor →
          </button>
        </div>
      )}
    </main>
  );
}