import { DB } from "../db/db.js";
import type { Listing } from "../types/listing.js";
import { listings } from "../../listings.js";
// findByExternalId(), insertListing(), updatePrice(), updateLastCheck()

export async function findByExternalId(id: string) {
  const rezultat = await DB.query(
    "SELECT * FROM listing WHERE id_extern = ($1)",
    [id],
  );
  return rezultat.rows;
}
export async function insertListing(listing: Listing) {
  const rezultat = await DB.query(
    "INSERT INTO listing (id_extern, offer_type, title, price, zone, m2, rooms, floor, link) VALUES (($1),($2),($3),($4),($5),($6),($7),($8),($9))",
    [
      listing.id_extern,
      listing.offer_type,
      listing.title,
      listing.price,
      listing.zone,
      listing.m2,
      listing.rooms,
      listing.floor,
      `www.999.md/ro/${listing.id_extern}`,
    ],
  );
  return rezultat.rowCount;
}

export async function updatePrice(price: number, id: string) {
  const rezultat = await DB.query(
    "UPDATE listing SET price = ($1) WHERE id_extern = ($2)",
    [price, id],
  );
  return rezultat.rowCount;
}
export async function updateLastCheck(id: string) {
  const rezultat = await DB.query(
    "UPDATE listing SET last_check = NOW() WHERE id_extern = ($1)",
    [id],
  );
  return rezultat.rowCount;
}

/* 
findByExternalId("104945499");
if (listings[30]) {
  insertListing(listings[30]);
} 
updatePrice(166000, "104907787");

updateLastCheck("105048065");
*/
