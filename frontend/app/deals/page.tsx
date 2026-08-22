// TODO: înlocuiește cu fetch către Express /listings/deals (sau echivalent)
const DEALS = [
  { title: "2 camere, Botanica", price: 240, pricePerM2: 5.1, drop: -18, area: 47 },
  { title: "1 cameră, Ciocana", price: 175, pricePerM2: 6.9, drop: -12, area: 25 },
  { title: "3 camere, Centru", price: 480, pricePerM2: 6.4, drop: -9, area: 75 },
  { title: "1 cameră, Botanica", price: 165, pricePerM2: 6.1, drop: -15, area: 27 },
  { title: "2 camere, Rîșcani", price: 220, pricePerM2: 4.9, drop: -11, area: 45 },
  { title: "Studio, Centru", price: 190, pricePerM2: 7.6, drop: -14, area: 25 },
  { title: "3 camere, Buiucani", price: 390, pricePerM2: 5.3, drop: -8, area: 74 },
  { title: "2 camere, Ciocana", price: 210, pricePerM2: 4.7, drop: -13, area: 44 },
  { title: "1 cameră, Centru", price: 230, pricePerM2: 8.2, drop: -10, area: 28 },
];

export default function DealsPage() {
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
          Anunțuri unde prețul a scăzut față de ultima verificare. Sortate
          după mărimea scăderii.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {DEALS.map((deal) => (
          <div key={deal.title} className="bg-panel p-6">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {deal.drop}%
              </p>
              <p className="font-mono text-[11px] text-text/40">
                {deal.area} m²
              </p>
            </div>
            <h3 className="mt-2 font-body text-lg font-bold">
              {deal.title}
            </h3>
            <p className="mt-4 font-mono text-2xl">{deal.price} €</p>
            <p className="font-mono text-xs text-text/50">
              {deal.pricePerM2} €/m²
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}