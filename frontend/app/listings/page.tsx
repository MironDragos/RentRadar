"use client";

import { useState, useEffect } from "react";
import { Listing } from "../../../src/types/listing";


const SECTORS = [
  "Toate",
  "Centru",
  "Botanica",
  "Buiucani",
  "Rîșcani",
  "Ciocana",
];

const OFFER_TYPES: Array<{ label: string; value: string | "Toate" }> = [
  { label: "Toate", value: "Toate" },
  { label: "Vânzare", value: "Vând" },
  { label: "Chirie lunară", value: "De închiriat lunar" },
  { label: "Chirie zilnică", value: "De închiriat pe zi" },
];
const PAGE_SIZE = 12;

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [offerType, setOfferType] = useState<string | "Toate">("Toate");
  const [sector, setSector] = useState("Toate");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [page, setPage] = useState(1);
  const priceCeiling = offerType === "Vând" || offerType==="Toate"? 500000 : offerType === "De închiriat lunar" ? 5000 : 2000

  useEffect(() => {
    async function getData() {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));
      if (offerType !== "Toate") params.set("offer_type", offerType);
      if (sector !== "Toate") params.set("zone", sector);
      params.set("maxPrice", String(maxPrice));

      const res = await fetch(`http://localhost:3001/listings?${params}`);
      const data = await res.json();
      setListings(data.listing);
      setTotal(Number(data.total[0].count));
    }
    getData();
  }, [page, offerType, sector, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function updateOfferType(next: string | "Toate") {
    setOfferType(next);
    setMaxPrice(next === "Vând" || next === "Toate"? 500000 : next === "De închiriat lunar" ? 5000 : 2000);
    setPage(1);
  }

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
          {total.toLocaleString("ro-RO")} rezultate
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wide md:text-5xl">
          ANUNȚURI
        </h1>
      </div>

      <div className="mb-8 flex flex-wrap items-end gap-8 border border-line bg-panel p-6">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
            Tip
          </span>
          <div className="flex gap-px bg-line">
            {OFFER_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => updateOfferType(t.value)}
                className={`px-3 py-2 font-mono text-xs uppercase tracking-widest ${
                  offerType === t.value
                    ? "bg-accent text-bg"
                    : "bg-bg text-text/70 hover:text-text"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

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
            Preț maxim: {maxPrice.toLocaleString("ro-RO")} €
          </span>
          <input
            type="range"
            min={offerType === "vanzare" ? 10000 : 100}
            max={priceCeiling}
            step={offerType === "vanzare" ? 1000 : 10}
            value={maxPrice}
            onChange={(e) => updateMaxPrice(Number(e.target.value))}
            className="w-56 accent-accent"
          />
        </div>
      </div>

      <div className="border border-line">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-line px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-text/50">
          <span>Anunț</span>
          <span>Tip</span>
          <span>Sector</span>
          <span>Suprafață</span>
          <span className="text-right">Preț</span>
        </div>

        {listings.map((l, i) => (
          <div
            key={l.id_extern}
            className={`grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-4 ${
              i !== 0 ? "border-t border-line" : ""
            }`}
          >
            <span className="font-body text-sm">{l.title}</span>
            <span className="font-mono text-xs uppercase tracking-widest text-text/60">
              {l.offer_type === "chirie" ? "chirie" : "vânzare"}
            </span>
            <span className="font-mono text-xs text-text/60">{l.zone}</span>
            <span className="font-mono text-xs text-text/60">{l.m2} m²</span>
            <span className="text-right font-mono text-lg">
              {l.price.toLocaleString("ro-RO")} €
            </span>
          </div>
        ))}

        {listings.length === 0 && (
          <div className="px-6 py-12 text-center font-body text-sm text-text/50">
            Niciun anunț nu corespunde filtrelor alese.
          </div>
        )}
      </div>

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
