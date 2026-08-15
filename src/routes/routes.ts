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
