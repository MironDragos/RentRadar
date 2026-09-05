"use client";
import { useEffect, useState } from "react";
import PriceChartSection from "./components/PriceChartSection";

type Deal = {
  id: string;
  zone: string;
  rooms: number;
  m2: number;
  price_per_m2: number;
  price: number;
};

export default function Home() {
  const [stats, setStats] = useState({
    totalListings: "",
    avgPriceChirie: "",
    avgPriceVanzare: "",
    avgPricem2History: [],
    dealsFirstPage: [],
  });
  useEffect(() => {
    async function getData() {
      const res = await fetch(`http://localhost:3001/stats`);
      const data = await res.json();
      setStats(data);
    }
    getData();
  }, []);
  const totalListings = stats.totalListings;
  const avgRent = stats.avgPriceChirie;
  const avgSale = stats.avgPriceVanzare;
  const dealsFirstPage = stats.dealsFirstPage;

  return (
    <main className="mx-auto max-w-6xl px-6">
      <section className="grid grid-cols-1 gap-px border border-line bg-line py-20 md:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col justify-center gap-4 bg-bg px-8 py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            999.md · urmărit zilnic
          </p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-wide md:text-6xl">
            PIAȚA
            <br />
            IMOBILIARĂ
            <br />
            CHIȘINĂU.
          </h1>
          <p className="max-w-xs font-body text-sm text-text/70">
            {totalListings
              ? `${Number(totalListings).toLocaleString("ro-RO")} anunțuri urmărite`
              : "Anunțuri urmărite"}
            , actualizate în fiecare noapte. Fără estimări.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-line">
          <StatWindow
            label="Anunțuri active"
            value={
              totalListings
                ? Number(totalListings).toLocaleString("ro-RO")
                : "—"
            }
            lit
          />
          <StatWindow label="Preț mediu — chirie" value={avgRent} />
          <StatWindow label="Preț mediu — vânzare" value={avgSale} />
          <StatWindow label="Azi" value="Live" lit accent="alt" />
        </div>
      </section>

      <section className="border border-t-0 border-line px-8 py-12">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl tracking-wide">
            EVOLUȚIA PREȚULUI MEDIU
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-text/50">
            ultimele 7 zile
          </span>
        </div>
        <PriceChartSection data={stats.avgPricem2History.toReversed()} />
      </section>
      <section className="border border-t-0 border-line px-8 py-12">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl tracking-wide">OFERTE BOMBĂ</h2>
          <a
            href="/deals"
            className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
          >
            Vezi toate →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
          {dealsFirstPage.map((deal: Deal) => (
            <a href={`/listings/${deal.id}`}>
              <div key={deal.id} className="bg-panel hover:bg-bg transition p-6">
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
                  {deal.price_per_m2} €/m²
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatWindow({
  label,
  value,
  lit = false,
  accent = "primary",
}: {
  label: string;
  value: string;
  lit?: boolean;
  accent?: "primary" | "alt";
}) {
  return (
    <div
      className={`flex flex-col justify-between p-6 ${
        lit ? "bg-panel" : "bg-bg"
      }`}
    >
      <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
        {label}
      </span>
      <span
        className={`font-mono text-3xl ${
          lit
            ? accent === "alt"
              ? "text-accent-alt"
              : "text-accent"
            : "text-text/40"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
