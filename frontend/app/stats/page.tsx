import PriceChartSection from "../components/PriceChartSection";

// TODO: înlocuiește cu fetch către Express /stats
const OVERVIEW = {
  totalListings: 26140,
  totalChirie: 15820,
  totalVanzare: 10320,
  avgPriceChirie: 412,
  avgPriceVanzare: 42500,
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

// TODO: înlocuiește cu fetch către Express /stats/by-sector (GROUP BY sector, offer_type)
const BY_SECTOR = [
  { sector: "Centru", avgChirie: 520, avgVanzare: 62000 },
  { sector: "Botanica", avgChirie: 390, avgVanzare: 44000 },
  { sector: "Buiucani", avgChirie: 410, avgVanzare: 47000 },
  { sector: "Rîșcani", avgChirie: 375, avgVanzare: 41000 },
  { sector: "Ciocana", avgChirie: 340, avgVanzare: 36500 },
  { sector: "Telecentru", avgChirie: 395, avgVanzare: 43000 },
];

export default function StatsPage() {
  const maxChirie = Math.max(...BY_SECTOR.map((s) => s.avgChirie));
  const maxVanzare = Math.max(...BY_SECTOR.map((s) => s.avgVanzare));

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          date live · 999.md
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wide md:text-5xl">
          STATISTICI
        </h1>
        <p className="mt-3 max-w-md font-body text-sm text-text/70">
          Piața imobiliară din Chișinău — chirii și vânzări, urmărite zilnic.
        </p>
      </div>

      {/* GRID GENERAL — 6 ferestre */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3">
        <StatWindow
          label="Anunțuri active"
          value={OVERVIEW.totalListings.toLocaleString("ro-RO")}
          lit
        />
        <StatWindow
          label="Anunțuri chirie"
          value={OVERVIEW.totalChirie.toLocaleString("ro-RO")}
        />
        <StatWindow
          label="Anunțuri vânzare"
          value={OVERVIEW.totalVanzare.toLocaleString("ro-RO")}
        />
        <StatWindow
          label="Preț mediu chirie"
          value={`${OVERVIEW.avgPriceChirie} €`}
          lit
          accent="alt"
        />
        <StatWindow
          label="Preț mediu vânzare"
          value={`${OVERVIEW.avgPriceVanzare.toLocaleString("ro-RO")} €`}
          lit
          accent="alt"
        />
        <StatWindow label="Suprafață medie" value={`${OVERVIEW.avgArea} m²`} />
      </div>

      {/* GRAFIC EVOLUȚIE */}
      <div className="mt-16">
        <h2 className="mb-8 font-display text-2xl tracking-wide">
          EVOLUȚIA PREȚULUI MEDIU LA CHIRIE
        </h2>
        <PriceChartSection data={HISTORY} />
      </div>

      {/* PE SECTOARE — chirie + vânzare una lângă alta */}
      <div className="mt-16">
        <h2 className="mb-8 font-display text-2xl tracking-wide">
          PREȚ MEDIU PE SECTOR
        </h2>
        <div className="border border-line">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-line px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-text/50">
            <span>Sector</span>
            <span>Chirie · Vânzare</span>
          </div>
          {BY_SECTOR.sort((a, b) => b.avgVanzare - a.avgVanzare).map(
            (s, i) => (
              <div
                key={s.sector}
                className={`grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-4 ${
                  i !== 0 ? "border-t border-line" : ""
                }`}
              >
                <div>
                  <span className="font-body text-sm">{s.sector}</span>
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="h-2 bg-bg">
                      <div
                        className="h-full bg-accent-alt"
                        style={{
                          width: `${(s.avgChirie / maxChirie) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="h-2 bg-bg">
                      <div
                        className="h-full bg-accent"
                        style={{
                          width: `${(s.avgVanzare / maxVanzare) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono text-sm">
                  <p className="text-accent-alt">{s.avgChirie} €</p>
                  <p className="text-accent">
                    {s.avgVanzare.toLocaleString("ro-RO")} €
                  </p>
                </div>
              </div>
            ),
          )}
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