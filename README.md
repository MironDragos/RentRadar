# RentRadar

A real estate price tracker for the Chișinău / Moldova market. RentRadar scrapes listings from [999.md](https://999.md) every day, stores them in Postgres, and surfaces price trends, below-market deals, and per-listing price history through a web UI.

**Live:**
- Frontend: [rent-radar-front.vercel.app](https://rent-radar-front.vercel.app)
- API: [rentradar-api.vercel.app](https://rentradar-api.vercel.app)

> Built as a portfolio project, not a commercial product — see [Notes on scope](#notes-on-scope) below.

## How it works

```mermaid
flowchart LR
    subgraph Daily["GitHub Actions — daily cron"]
        CL[collectLinks.ts<br/>Playwright] --> SC[scrape.ts<br/>fetch + JSON parse]
        SC --> SV[saveListing<br/>insert / update / dedupe]
    end

    SV --> DB[(Postgres<br/>Supabase)]

    DB --> API[Express API<br/>Vercel serverless]
    API --> FE[Next.js frontend<br/>Vercel]
    FE --> User((Browser))
```

1. **Link collection** (`collectLinks.ts`) — Playwright drives a headless Chromium browser through 999.md's paginated apartment listings and collects every listing URL currently live on the site.
2. **Scraping** (`scrape.ts`) — for each URL, a plain `fetch` request pulls the page HTML. 999.md embeds the full listing data as a JSON blob inside the page (`adView`), so the scraper extracts and parses that directly instead of parsing the rendered DOM. A sanity-check filter rejects listings with implausible values (e.g. price/m² wildly out of range) before they reach the database.
3. **Persistence** (`saveListing`) — each listing is matched by its external 999.md ID first; if it's genuinely new, a secondary duplicate check matches on normalized street + house number + rooms + floor + m² range + price range, since re-posted ads on 999.md get a new external ID but describe the same apartment. Price changes are recorded in a `price_history` table.
4. **Inactive tracking** — after each run, any listing not seen in that run gets marked `active = false`; if it reappears later, it's marked `active = true` again.
5. **API** — a thin Express layer reads from Postgres and serves listings, aggregate stats, and "deals" (listings priced well below the average €/m² for their zone).
6. **Frontend** — Next.js App Router pages consume the API: a browsable listings feed with filters, a deals page, a stats/trends page, and an individual listing page with full price history.

The scraper runs independently of the API/frontend, on a daily [GitHub Actions cron job](.github/workflows/scrape.yml) — it writes straight to Supabase and has no dependency on the web app being deployed or awake.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| API | Express 5 + TypeScript, deployed as Vercel serverless functions |
| Database | PostgreSQL (Supabase, free tier) |
| Scraping | Playwright (link discovery) + native `fetch` (listing data) |
| Scheduling | GitHub Actions cron (daily) |
| Hosting | Vercel (frontend + API, two separate projects from one repo) |

## Why these choices

**Postgres over a document store.** Listings reference a `price_history` table, and most of the value of the project comes from aggregate SQL — average price per zone, price/m² percentiles, joins between a listing and its price history. That's a relational access pattern, so a relational database was a better fit than schema-less storage.

**Playwright *and* plain `fetch`, not one or the other.** Playwright is only used for the listing index pages, which load results via client-side JS and need a real browser to paginate through. Individual listing pages don't need a browser at all — 999.md ships the full listing data as inline JSON in the raw HTML, so a plain `fetch` + JSON extraction is far cheaper and faster than spinning up a browser tab per listing, which matters at the scale of ~14k listings re-checked per run.

**Dedup by address, not just by external ID.** 999.md listings can be re-posted with a new external ID for the same physical apartment. Matching only on ID would let the same apartment accumulate as multiple "different" rows over time, so a second pass matches on normalized street name (diacritics stripped, common prefixes like "str." removed) + house number + rooms + floor + a tolerance band on size and price.

**Two separate Vercel projects instead of a single deployment.** The Express API and the Next.js frontend are deployed as two independent Vercel projects from the same monorepo (root directory pointed at the repo root for the API, at `frontend/` for the UI). This keeps the API a plain Express app importable as a Vercel serverless function (`api/index.ts`) without coupling its lifecycle to the frontend's build.

**`/stats` uses `AVG(price/m²)`, not a median.** This was a deliberate simplification — the dataset doesn't currently have enough volume per zone for percentile queries to be meaningfully more accurate than the average, so the average was kept.

## API reference

| Endpoint | Description |
|---|---|
| `GET /listings` | Paginated listings. Query params: `page`, `limit`, `offer_type`, `zone`, `maxPrice` |
| `GET /listings/:id` | Single listing by internal ID |
| `GET /listings/:id/price_history` | Chronological price changes for a listing |
| `GET /stats` | Aggregate stats: totals, averages by offer type, per-zone averages, 7-day trend |
| `GET /deals` | Listings priced well below the average €/m² for their zone (sale + rent) |

## Running locally

**Requirements:** Node.js 20+, a Postgres database (Docker Compose file included for local Postgres).

```bash
# 1. Clone and install
git clone https://github.com/MironDragos/RentRadar.git
cd RentRadar
npm install
cd frontend && npm install && cd ..

# 2. Database
docker compose up -d          # local Postgres, or point DATABASE_URL at Supabase
# run the SQL files in src/db/migration/ in order against your database

# 3. Environment variables
# root .env
DATABASE_URL=postgres://user:password@localhost:5432/rentradar
PORT=3001
FRONTEND_URL=http://localhost:3000

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# 4. Run
npm start            # API on http://localhost:3001
npm run scrape        # one-off scrape run (needs Playwright browsers: npx playwright install)
cd frontend && npm run dev   # frontend on http://localhost:3000
```

The scraper is meant to run on a schedule (see `.github/workflows/scrape.yml`), not continuously — `npm run scrape` does a single full pass and exits.

## Notes on scope

This is a portfolio project, not a production service — a few things are intentionally left as-is or deferred:

- No automated tests yet (Vitest is installed but unused) — a targeted set of unit tests around the scraper's sanity filters and `saveListing`'s branches is the plan, not full coverage.
- No alerting if a scrape run silently fails or returns near-zero results (a past bug went undetected for several days for this reason) — a Telegram/email alert on low success counts is on the roadmap.
- API query params aren't validated beyond basic parsing.
- Vercel's free tier serverless functions can have a brief cold start after a period of inactivity — not a bug if the first request after a while feels slow.

## License

Personal/portfolio project — no license file yet.