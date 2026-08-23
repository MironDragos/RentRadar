"use client";

import { useMemo, useState } from "react";

type OfferType = "chirie" | "vanzare";

// TODO: înlocuiește cu fetch către Express /listings/deals (sau echivalent)
const DEALS = [
  { title: "2 camere, Botanica", offerType: "chirie", price: 240, pricePerM2: 5.1, drop: -18, area: 47 },
  { title: "1 cameră, Ciocana", offerType: "chirie", price: 175, pricePerM2: 6.9, drop: -12, area: 25 },
  { title: "3 camere, Centru", offerType: "chirie", price: 480, pricePerM2: 6.4, drop: -9, area: 75 },
  { title: "1 cameră, Botanica", offerType: "chirie", price: 165, pricePerM2: 6.1, drop: -15, area: 27 },
  { title: "2 camere, Rîșcani", offerType: "vanzare", price: 48500, pricePerM2: 1080, drop: -6, area: 45 },
  { title: "Studio, Centru", offerType: "vanzare", price: 39000, pricePerM2: 1560, drop: -8, area: 25 },
  { title: "3 camere, Buiucani", offerType: "vanzare", price: 74000, pricePerM2: 1000, drop: -5, area: 74 },
  { title: "2 camere, Ciocana", offerType: "chirie", price: 210, pricePerM2: 4.7, drop: -13, area: 44 },
  { title: "1 cameră, Centru", offerType: "vanzare", price: 45000, pricePerM2: 1607, drop: -7, area: 28 },
] satisfies Array<{
  title: string;
  offerType: OfferType;
  price: number;
  pricePerM2: number;
  drop: number;
  area: number;
}>;

const FILTERS: Array<{ label: string; value: OfferType | "toate" }> = [
  { label: "Toate", value: "toate" },
  { label: "Chirie", value: "chirie" },
  { label: "Vânzare", value: "vanzare" },
];

export default function DealsPage() {
  const [filter, setFilter] = useState<OfferType | "toate">("toate");

  const filtered = useMemo(
    () =>
      filter === "toate"
        ? DEALS
        : DEALS.filter((d) => d.offerType === filter),
    [filter],
  );

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

      {/* TOGGLE TIP OFERTĂ */}
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
        {filtered.map((deal) => (
          <div key={deal.title} className="bg-panel p-6">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {deal.drop}%
              </p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-text/40">
                {deal.offerType === "chirie" ? "chirie" : "vânzare"}
              </p>
            </div>
            <h3 className="mt-2 font-body text-lg font-bold">
              {deal.title}
            </h3>
            <p className="mt-4 font-mono text-2xl">
              {deal.price.toLocaleString("ro-RO")} €
            </p>
            <p className="font-mono text-xs text-text/50">
              {deal.pricePerM2.toLocaleString("ro-RO")} €/m² · {deal.area} m²
            </p>
          </div>
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