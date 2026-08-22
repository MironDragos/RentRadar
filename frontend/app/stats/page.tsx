import PriceChartSection from "../components/PriceChartSection";

// TODO: înlocuiește cu fetch către Express /stats
const OVERVIEW = {
  totalListings: 26140,
  avgPrice: 412,
  avgPricePerM2: 8.6,
  activeToday: 187,
  medianPrice: 380,
  avgArea: 52,
};

// TODO: înlocuiește cu fetch către Express /stats/history
const HISTORY = [
  { label: "Lun", value: 398 },
  { label: "Mar", value: 402 },
  { label: "Mie", value: 395 },
  { label: "Joi", value: 410 },
  { label: "Vin", value: 405 },
  { label: "Sâm", value: 418 },
  { label: "Dum", value: 412 },
];

// TODO: înlocuiește cu fetch către Express /stats/by-sector (GROUP BY sector)
const BY_SECTOR = [
  { sector: "Centru", avgPrice: 520, count: 3120 },
  { sector: "Botanica", avgPrice: 390, count: 5840 },
  { sector: "Buiucani", avgPrice: 410, count: 4210 },
  { sector: "Rîșcani", avgPrice: 375, count: 4890 },
  { sector: "Ciocana", avgPrice: 340, count: 3960 },
  { sector: "Telecentru", avgPrice: 395, count: 2100 },
];

export default function StatsPage() {
  const maxSectorPrice = Math.max(...BY_SECTOR.map((s) => s.avgPrice));

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          date live · 999.md
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wide md:text-5xl">
          STATISTICI
        </h1>
      </div>

      {/* GRID GENERAL — 6 ferestre */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3">
        <StatWindow label="Anunțuri active" value={OVERVIEW.totalListings.toLocaleString("ro-RO")} lit />
        <StatWindow label="Preț mediu" value={`${OVERVIEW.avgPrice} €`} />
        <StatWindow label="Preț median" value={`${OVERVIEW.medianPrice} €`} />
        <StatWindow label="Preț mediu / m²" value={`${OVERVIEW.avgPricePerM2} €`} />
        <StatWindow label="Suprafață medie" value={`${OVERVIEW.avgArea} m²`} />
        <StatWindow label="Azi" value={`+${OVERVIEW.activeToday}`} lit accent="alt" />
      </div>

      {/* GRAFIC EVOLUȚIE */}
      <div className="mt-16">
        <h2 className="mb-8 font-display text-2xl tracking-wide">
          EVOLUȚIA PREȚULUI MEDIU
        </h2>
        <PriceChartSection data={HISTORY} />
      </div>

      {/* PE SECTOARE */}
      <div className="mt-16">
        <h2 className="mb-8 font-display text-2xl tracking-wide">
          PREȚ MEDIU PE SECTOR
        </h2>
        <div className="border border-line">
          {BY_SECTOR.sort((a, b) => b.avgPrice - a.avgPrice).map((s, i) => (
            <div
              key={s.sector}
              className={`flex items-center gap-4 px-6 py-4 ${
                i !== 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="w-28 shrink-0 font-body text-sm">
                {s.sector}
              </span>
              <div className="h-4 flex-1 bg-bg">
                <div
                  className="h-full bg-accent"
                  style={{
                    width: `${(s.avgPrice / maxSectorPrice) * 100}%`,
                  }}
                />
              </div>
              <span className="w-16 shrink-0 text-right font-mono text-sm">
                {s.avgPrice} €
              </span>
              <span className="w-20 shrink-0 text-right font-mono text-xs text-text/40">
                {s.count.toLocaleString("ro-RO")} anunțuri
              </span>
            </div>
          ))}
        </div>
      </div>
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
        className={`mt-6 font-mono text-2xl md:text-3xl ${
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