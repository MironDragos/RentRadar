"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type ListingDetail = {
  id: number;
  id_extern: string;
  offer_type: string;
  title: string;
  price: number;
  m2: number;
  zone: string;
  street: string | null;
  house_number: string | null;
  rooms: number;
  floor: number;
  housing_type: string | null;
  link: string;
  first_date: string;
  last_check: string | null;
  active: boolean;
};

type PriceChange = {
  id: number;
  property_id: number;
  old_price: string;
  new_price: string;
  date_change: string;
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const [listingRes, historyRes] = await Promise.all([
        fetch(`http://localhost:3001/listings/${id}`),
        fetch(`http://localhost:3001/listings/${id}/price_history`),
      ]);
      const listingData = await listingRes.json();
      const historyData = await historyRes.json();

      if (!listingData[0]) {
        setNotFound(true);
      } else {
        setListing(listingData[0]);
        setPriceHistory(
          [...historyData].sort(
            (a, b) =>
              new Date(a.date_change).getTime() -
              new Date(b.date_change).getTime(),
          ),
        );
      }
      setLoading(false);
    }
    if (id) getData();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-text/50">
          Se încarcă...
        </p>
      </main>
    );
  }

  if (notFound || !listing) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-text/50">
          Anunțul nu a fost găsit.
        </p>
        <Link
          href="/listings"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          ← Înapoi la anunțuri
        </Link>
      </main>
    );
  }

  const pricePerM2 = listing.price / listing.m2;

  const details: Array<[string, string]> = [
    ["Sector", listing.zone],
    [
      "Adresă",
      listing.street
        ? `${listing.street}${listing.house_number ? ", " + listing.house_number : ""}`
        : "—",
    ],
    ["Suprafață", `${listing.m2} m²`],
    ["Camere", String(listing.rooms)],
    ["Etaj", String(listing.floor)],
    ["Fond locativ", listing.housing_type || "—"],
    ["Tip anunț", listing.offer_type],
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/listings"
        className="font-mono text-xs uppercase tracking-widest text-text/50 hover:text-accent"
      >
        ← Înapoi la anunțuri
      </Link>

      <div className="mt-6 mb-10 flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {listing.offer_type}
            {!listing.active && (
              <span className="ml-3 text-text/40">· Inactiv</span>
            )}
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-wide md:text-4xl">
            {listing.title}
          </h1>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-3xl text-accent">
            {listing.price.toLocaleString("ro-RO")} €
          </p>
          <p className="font-mono text-xs text-text/50">
            {pricePerM2.toFixed(0)} €/m²
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
        {details.map(([label, value]) => (
          <div key={label} className="bg-bg p-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text/40">
              {label}
            </span>
            <p className="mt-1 font-body text-sm">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-text/50">
          Istoricul prețului
        </h2>

        {priceHistory.length === 0 ? (
          <p className="mt-4 border border-line bg-panel p-6 font-body text-sm text-text/60">
            Niciun preț schimbat de când urmărim acest anunț.
          </p>
        ) : (
          <div className="mt-4 border border-line">
            {priceHistory.map((change, i) => {
              const went_up =
                Number(change.new_price) > Number(change.old_price);
              return (
                <div
                  key={change.id}
                  className={`flex items-center justify-between px-6 py-3 ${
                    i !== 0 ? "border-t border-line" : ""
                  }`}
                >
                  <span className="font-mono text-xs text-text/50">
                    {new Date(change.date_change).toLocaleDateString("ro-RO")}
                  </span>
                  <span className="font-mono text-sm">
                    {Number(change.old_price).toLocaleString("ro-RO")} €
                    <span
                      className={
                        went_up
                          ? "mx-2 text-red-400"
                          : "mx-2 text-emerald-400"
                      }
                    >
                      {went_up ? "↑" : "↓"}
                    </span>
                    {Number(change.new_price).toLocaleString("ro-RO")} €
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <a
        href={listing.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
      >
        Vezi anunțul original ↗
      </a>
    </main>
  );
}