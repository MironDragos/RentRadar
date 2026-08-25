import { DB } from "../db/db.js";
import type { Listing } from "../types/listing.js";

export async function updateListingData(listing: Listing) {
  const rezultat = await DB.query(
    "UPDATE listing SET zone = ($1), street = ($2), title = ($3), m2 = ($4), rooms = ($5), floor = ($6) WHERE id_extern = ($7)",
    [listing.zone, listing.street, listing.title, listing.m2, listing.rooms, listing.floor, listing.id_extern],
  );
  return rezultat.rowCount;
}

export async function findByExternalId(id: string) {
  const rezultat = await DB.query(
    "SELECT * FROM listing WHERE id_extern = ($1)",
    [id],
  );
  return rezultat.rows;
}
export async function insertListing(listing: Listing) {
  const rezultat = await DB.query(
    "INSERT INTO listing (id_extern, offer_type, title, price, zone, street, m2, rooms, floor, link) VALUES (($1),($2),($3),($4),($5),($6),($7),($8),($9),($10))",
    [
      listing.id_extern,
      listing.offer_type,
      listing.title,
      listing.price,
      listing.zone,
      listing.street,
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
export async function markInactiveSince(runStartDate: Date) {
    const rezultat = await DB.query(
        "UPDATE listing SET active = false WHERE last_check < $1 AND active = true",
        [runStartDate]
    );
    return rezultat.rowCount;
}
export async function findPotentialDuplicate(listing: Listing) {
    const rezultat = await DB.query(
        `SELECT id_extern FROM listing 
         WHERE lower(street) = lower($1)
           AND rooms = $2 
           AND floor = $3 
           AND m2 BETWEEN $4 - 2 AND $4 + 2 
           AND offer_type = $5 
           AND active = true 
           AND id_extern != $6 
         LIMIT 1`,
        [listing.street, listing.rooms, listing.floor, listing.m2, listing.offer_type, listing.id_extern]
    );
    return rezultat.rows[0]?.id_extern || null;
}