import express from "express";
import { DB } from "../db/db.js";

export const app = express();

app.use(express.json());

app.get("/listings", async (req, res) => {
  const rezultat = await DB.query("SELECT * FROM listing");
  res.json(rezultat.rows);
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
});
/*
COUNT(*) — total listări active
AVG(price) — preț mediu
AVG(price / m2) — preț mediu per m²
*/
