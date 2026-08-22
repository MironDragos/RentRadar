// TODO: înlocuiește cu fetch către Express /stats
const STATS = {
  totalListings: 26140,
  avgPrice: 412,
  avgPricePerM2: 8.6,
  updatedToday: 187,
};

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6">
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