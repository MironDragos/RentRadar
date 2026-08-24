import express from "express";
import { DB } from "../db/db.js";
import cors from "cors";

export const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/listings", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const offer_type = req.query.offer_type as string | undefined;
    const zone = req.query.zone as string | undefined;
    const maxPrice = req.query.maxPrice as string | undefined;

    const conditions: string[] = [];
    const params: any[] = [];

    if (offer_type) {
      params.push(offer_type);
      conditions.push(`offer_type = $${params.length}`);
    }
    if (zone) {
      params.push(zone);
      conditions.push(`zone = $${params.length}`);
    }
    if (maxPrice) {
      params.push(maxPrice);
      conditions.push(`price <= $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const totalQuery = `SELECT COUNT(*) FROM listing ${where}`;
    const total = await DB.query(totalQuery, params);

    params.push(limit, offset);
    const dataQuery = `SELECT * FROM listing ${where} LIMIT $${params.length - 1} OFFSET $${params.length}`;
    const rezultat = await DB.query(dataQuery, params);

    res.json({ listing: rezultat.rows, total: total.rows });
  } catch (err) {
    console.error("LISTINGS ERROR:", err);
    res.status(500).json({ error: "failed" });
  }
});

app.get("/listings/:id", async (req, res) => {
  const id = req.params.id;
  const rezultat = await DB.query("SELECT * FROM listing WHERE id = ($1)", [
    id,
  ]);
  res.json(rezultat.rows);
});
app.get("/listings/:id/price_history", async (req, res) => {
  const id = req.params.id;
  const rezultat = await DB.query(
    "SELECT * FROM price_history WHERE property_id = ($1)",
    [id],
  );
  res.json(rezultat.rows);
});
app.get("/stats", async (req, res) => {
  try {
    const totalListings = await DB.query("SELECT COUNT(*) FROM listing");
    const totalChirie = await DB.query(
      "SELECT COUNT(*) FROM listing WHERE offer_type IN ('De închiriat lunar', 'De închiriat pe zi');",
    );
    const totalVanzare = await DB.query(
      "SELECT COUNT(*) FROM listing WHERE offer_type ='Vând';",
    );
    const avgPriceChirie = await DB.query(
      "SELECT AVG(price) FROM listing WHERE offer_type IN ('De închiriat lunar', 'De închiriat pe zi');",
    );
    const avgPriceVanzare = await DB.query(
      "SELECT AVG(price) FROM listing WHERE offer_type ='Vând';",
    );
    const avgArea = await DB.query("SELECT AVG(m2) FROM listing;");
    const avgPricesPerSector = await DB.query(
      "SELECT zone, CEIL(AVG(CASE WHEN offer_type = 'De închiriat lunar' THEN price END)) AS avgChirie, CEIL(AVG(CASE WHEN offer_type = 'Vând' THEN price END)) AS avgVanzare FROM listing WHERE zone IN ('Botanica', 'Ciocana', 'Centru', 'Râșcani', 'Buiucani') AND offer_type IN ('Vând', 'De închiriat lunar') GROUP BY zone;",
    );
    res.json({
      totalListings: Number(totalListings.rows[0].count),
      totalChirie: Number(totalChirie.rows[0].count),
      totalVanzare: Number(totalVanzare.rows[0].count),
      avgPriceChirie: Math.round(Number(avgPriceChirie.rows[0].avg)),
      avgPriceVanzare: Math.round(Number(avgPriceVanzare.rows[0].avg)),
      avgArea: Math.round(Number(avgArea.rows[0].avg)),
      avgPricesPerSector: avgPricesPerSector.rows,
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ error: "failed" });
  }
});
/*
  sector: "Centru", avgChirie: 520, avgVanzare: 62000 
  totalListings: 26140,
  totalChirie: 15820,
  totalVanzare: 10320,
  avgPriceChirie: 412,
  avgPriceVanzare: 42500,
  avgArea: 52,
*/
