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
    const total = await DB.query("SELECT COUNT(*) FROM listing");
    const avarage = await DB.query(
      "SELECT offer_type,AVG(price) FROM listing GROUP BY offer_type",
    );
    const avaragem2 = await DB.query(
      "SELECT offer_type,AVG(price)/AVG(m2) as price_for_m2 FROM listing GROUP BY offer_type",
    );

    res.json({
      total: total.rows,
      avgPrice: avarage.rows,
      avgPricePerM2: avaragem2.rows,
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ error: "failed" });
  }
});
/*
COUNT(*) — total listări active
AVG(price) — preț mediu
AVG(price / m2) — preț mediu per m²
*/
