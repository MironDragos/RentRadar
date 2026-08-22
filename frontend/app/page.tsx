import PriceChartSection from "./components/PriceChartSection";

// TODO: înlocuiește cu fetch către Express /stats
const STATS = {
  totalListings: 26140,
  avgPrice: 412,
  avgPricePerM2: 8.6,
  updatedToday: 187,
};

// TODO: înlocuiește cu fetch către Express /stats/history (sau echivalent)
const HISTORY = [
  { label: "Lun", value: 398 },
  { label: "Mar", value: 402 },
  { label: "Mie", value: 395 },
  { label: "Joi", value: 410 },
  { label: "Vin", value: 405 },
  { label: "Sâm", value: 418 },
  { label: "Dum", value: 412 },
];

// TODO: înlocuiește cu fetch către Express /listings/deals (sau echivalent)
const DEALS = [
  { title: "2 camere, Botanica", price: 240, pricePerM2: 5.1, drop: -18 },
  { title: "1 cameră, Ciocana", price: 175, pricePerM2: 6.9, drop: -12 },
  { title: "3 camere, Centru", price: 480, pricePerM2: 6.4, drop: -9 },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* HERO — grid asimetric de "ferestre" */}
      <section className="grid grid-cols-1 gap-px border border-line bg-line py-20 md:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col justify-center gap-4 bg-bg px-8 py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            999.md · urmărit zilnic
          </p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-wide md:text-6xl">
            PIAȚA DE
            <br />
            CHIRII DIN
            <br />
            CHIȘINĂU.
          </h1>
          <p className="max-w-xs font-body text-sm text-text/70">
            {STATS.totalListings.toLocaleString("ro-RO")} anunțuri urmărite,
            actualizate în fiecare noapte. Fără estimări.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-line">
          <StatWindow
            label="Anunțuri active"
            value={STATS.totalListings.toLocaleString("ro-RO")}
            lit
          />
          <StatWindow label="Preț mediu" value={`${STATS.avgPrice} €`} />
          <StatWindow
            label="Preț mediu / m²"
            value={`${STATS.avgPricePerM2} €`}
          />
          <StatWindow
            label="Azi"
            value={`+${STATS.updatedToday}`}
            lit
            accent="alt"
          />
        </div>
      </section>

      {/* EVOLUȚIE PREȚ */}
      <section className="border border-t-0 border-line px-8 py-12">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl tracking-wide">
            EVOLUȚIA PREȚULUI MEDIU
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-text/50">
            ultimele 7 zile
          </span>
        </div>
        <PriceChartSection data={HISTORY} />
      </section>

      {/* OFERTE BOMBĂ */}
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
          {DEALS.map((deal) => (
            <div key={deal.title} className="bg-panel p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {deal.drop}%
              </p>
              <h3 className="mt-2 font-body text-lg font-bold">{deal.title}</h3>
              <p className="mt-4 font-mono text-2xl">{deal.price} €</p>
              <p className="font-mono text-xs text-text/50">
                {deal.pricePerM2} €/m²
              </p>
            </div>
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
