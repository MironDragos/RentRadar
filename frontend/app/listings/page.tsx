"use client";

import { useState, useEffect } from "react";
import { Listing } from "../../../src/types/listing";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Ambele", value: "all" },
] as const;
const SORT_OPTIONS = [
  { label: "Cele mai noi", value: "newest" },
  { label: "Preț crescător", value: "price_asc" },
  { label: "Preț descrescător", value: "price_desc" },
  { label: "Suprafață crescătoare", value: "area_asc" },
  { label: "Suprafață descrescătoare", value: "area_desc" },
] as const;
const PAGE_SIZE = 12;

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [offerType, setOfferType] = useState<string | "Toate">("Toate");
  const [sector, setSector] = useState("Toate");
  const [status, setStatus] =
    useState<(typeof STATUS_OPTIONS)[number]["value"]>("all");
  const [sort, setSort] =
    useState<(typeof SORT_OPTIONS)[number]["value"]>("newest");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [displayPrice, setDisplayPrice] = useState(500000);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const priceCeiling =
    offerType === "Vând" || offerType === "Toate"
      ? 500000
      : offerType === "De închiriat lunar"
        ? 5000
        : 2000;

  useEffect(() => {
    const controller = new AbortController();

    async function getData() {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
          maxPrice: String(maxPrice),
          sort,
        });
        if (offerType !== "Toate") params.set("offer_type", offerType);
        if (sector !== "Toate") params.set("zone", sector);
        if (status !== "all") params.set("active", String(status === "active"));

        const res = await fetch(`${API_URL}/listings?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Listings request failed");

        const data = await res.json();
        if (!Array.isArray(data.listing) || !Array.isArray(data.total)) {
          throw new Error("Invalid listings response");
        }
        setListings(data.listing);
        setTotal(Number(data.total[0]?.count) || 0);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        console.error("Failed to load listings", requestError);
        setError("Anunțurile nu au putut fi încărcate. Încearcă din nou.");
        setListings([]);
        setTotal(0);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    getData();
    return () => controller.abort();
  }, [page, offerType, sector, status, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function updateOfferType(next: string | "Toate") {
    setOfferType(next);
    const reset =
      next === "Vând" || next === "Toate"
        ? 500000
        : next === "De închiriat lunar"
          ? 5000
          : 2000;
    setMaxPrice(reset);
    setDisplayPrice(reset);
    setPage(1);
  }

  function updateSector(next: string) {
    setSector(next);
    setPage(1);
  }

  function updateStatus(next: (typeof STATUS_OPTIONS)[number]["value"]) {
    setStatus(next);
    setPage(1);
  }

  function updateSort(next: (typeof SORT_OPTIONS)[number]["value"]) {
    setSort(next);
    setPage(1);
  }

  function updateMaxPrice(next: number) {
    setMaxPrice(next);
    setPage(1);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {total.toLocaleString("ro-RO")} rezultate
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl md:text-5xl">
          ANUNȚURI
        </h1>
      </div>

      <div className="mb-8 flex min-w-0 flex-col items-stretch gap-5 border border-line bg-panel p-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6 sm:p-6 md:gap-8">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
            Tip
          </span>
          <div className="grid grid-cols-2 gap-px bg-line sm:flex sm:flex-wrap">
            {OFFER_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => updateOfferType(t.value)}
                className={`px-2 py-2 font-mono text-[10px] uppercase tracking-widest sm:px-3 sm:text-xs ${
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

        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
            Sector
          </span>
          <div className="grid grid-cols-3 gap-px bg-line sm:flex sm:flex-wrap">
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => updateSector(s)}
                className={`px-2 py-2 font-mono text-[10px] uppercase tracking-widest sm:px-3 sm:text-xs ${
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

        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
            Status
          </span>
          <div className="grid grid-cols-3 gap-px bg-line sm:flex sm:flex-wrap">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateStatus(option.value)}
                className={`px-2 py-2 font-mono text-[10px] uppercase tracking-widest sm:px-3 sm:text-xs ${
                  status === option.value
                    ? "bg-accent text-bg"
                    : "bg-bg text-text/70 hover:text-text"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
            Preț maxim: {displayPrice.toLocaleString("ro-RO")} €
          </span>
          <input
            type="range"
            min={offerType === "Vând" ? 10000 : 100}
            max={priceCeiling}
            step={offerType === "Vând" ? 1000 : 10}
            value={displayPrice}
            onChange={(e) => {
              const value = Number(e.currentTarget.value);
              setDisplayPrice(value);
              updateMaxPrice(value);
            }}
            className="w-full accent-accent sm:w-56"
          />
        </div>

        <label className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
            Sortează
          </span>
          <select
            value={sort}
            onChange={(event) =>
              updateSort(
                event.target.value as (typeof SORT_OPTIONS)[number]["value"],
              )
            }
            className="min-h-9 w-full border border-line bg-bg px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-text sm:w-56 sm:text-xs"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="border border-line">
        <div className="hidden grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-line px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-text/50 md:grid">
          <span>Anunț</span>
          <span>Tip</span>
          <span>Sector</span>
          <span>Suprafață</span>
          <span className="text-right">Preț</span>
        </div>

        {loading && (
          <div className="px-6 py-12 text-center font-mono text-xs uppercase tracking-widest text-text/50">
            Se încarcă anunțurile...
          </div>
        )}

        {!loading &&
          listings.map((l, i) => (
          <a
            key={l.id_extern}
            href={`/listings/${l.id}`}
            className={`grid grid-cols-2 items-center gap-x-4 gap-y-2 px-4 py-4 transition hover:bg-panel md:grid-cols-[1fr_auto_auto_auto_auto] md:gap-4 md:px-6 md:py-4 ${
              i !== 0 ? "border-t border-line" : ""
            }`}
          >
            <span className="col-span-2 font-body text-sm md:col-span-1">{l.title}</span>
            <span className="font-mono text-xs uppercase tracking-widest text-text/60">
              <span className="mr-1 text-text/40 md:hidden">Tip:</span>
              {l.offer_type}
            </span>
            <span className="font-mono text-xs text-text/60">{l.zone}</span>
            <span className="font-mono text-xs text-text/60">
              <span className="mr-1 text-text/40 md:hidden">Suprafață:</span>
              {l.m2} m²
            </span>
            <span className="text-right font-mono text-lg">
              {l.price.toLocaleString("ro-RO")} €
            </span>
          </a>
          ))}

        {!loading && error && (
          <div className="px-6 py-12 text-center font-body text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
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
