"use client";

import { useEffect, useMemo, useState } from "react";

type OfferType = "De închiriat lunar" | "Vând";

type Deal = {
  id: string;
  zone: string;
  rooms: number;
  m2: number;
  price_per_m2: number;
  price: number;
};

const FILTERS: Array<{ label: string; value: OfferType }> = [
  { label: "Chirie", value: "De închiriat lunar" },
  { label: "Vânzare", value: "Vând" },
];

export default function DealsPage() {
  const [filter, setFilter] = useState<OfferType | "Vând">("Vând");
  const [deals, setDeals] = useState({
    averageVanzare: "",
    averageChirie: "",
    dealsVanzare: [],
    dealsChirie: [],
  });
  useEffect(() => {
    async function getData() {
      const res = await fetch(`http://localhost:3001/deals`);
      const data = await res.json();
      setDeals(data);
    }
    getData();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "De închiriat lunar") {
      return deals.dealsChirie;
    }
    return deals.dealsVanzare;
  }, [filter, deals]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          actualizat zilnic
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wide md:text-5xl">
          OFERTE BOMBĂ
        </h1>
        <p className="mt-3 max-w-md font-body text-sm text-text/70">
          Anunțuri de chirie și vânzare unde prețul a scăzut față de ultima
          verificare. Sortate după mărimea scăderii.
        </p>
      </div>

      <div className="mb-8 flex gap-px bg-line">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest ${
              filter === f.value
                ? "bg-accent text-bg"
                : "bg-panel text-text/70 hover:text-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((deal: Deal) => (
          <a href={`/listings/${deal.id}`}>
            <div key={deal.id} className="bg-panel hover:bg-bg transition p-6">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-text/40">
                  {filter}
                </p>
              </div>
              <h3 className="mt-2 font-body text-lg font-bold">
                {deal.rooms === 0
                  ? "Garsoniera"
                  : deal.rooms === 1
                    ? "O camera"
                    : deal.rooms + " camere"}
                , {deal.zone}
              </h3>
              <p className="mt-4 font-mono text-2xl">{deal.price} €</p>
              <p className="font-mono text-xs text-text/50">
                {deal.price_per_m2} €/m² · {deal.m2} m²
              </p>
            </div>
          </a>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full px-6 py-12 text-center font-body text-sm text-text/50">
            Nicio ofertă în această categorie momentan.
          </div>
        )}
      </div>
    </main>
  );
}
