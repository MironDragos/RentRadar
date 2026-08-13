import type { Listing } from "../types/listing.js";
import { findByExternalId } from "../repositories/repositoryListings.js";
import { insertListing } from "../repositories/repositoryListings.js";
import { updatePrice } from "../repositories/repositoryListings.js";
import { updateLastCheck } from "../repositories/repositoryListings.js";
import { DB } from "../db/db.js";

export async function saveListing(listing: Listing) {
  const pre_old_listing = await findByExternalId(listing.id_extern);
  const old_listing = pre_old_listing[0];
  if (old_listing === undefined) {
    await insertListing(listing);
    console.log("was insereted");
  } else if (old_listing.price != listing.price) {
    await updatePrice(listing.price, listing.id_extern);
    await DB.query(
      "INSERT INTO price_history (property_id, old_price, new_price) VALUES (($1),($2),($3))",
      [old_listing.id, old_listing.price, listing.price],
    );
    console.log("price changed");
  } else {
    console.log("last check changed");
    await updateLastCheck(listing.id_extern);
  }
}
