import type { Listing } from "../types/listing.js";
import {
  findByExternalId,
  updateListingData,
  insertListing,
  updatePrice,
  updateLastCheck,
  findPotentialDuplicate,
  updateActiveStatus
} from "../repositories/repositoryListings.js";

export async function saveListing(listing: Listing) {
  const pre_old_listing = await findByExternalId(listing.id_extern);
  const old_listing = pre_old_listing[0];
  //listing inserted
  if (old_listing === undefined) {
    const duplicate = await findPotentialDuplicate(listing);
    if (duplicate) {
      console.log(
        `SKIP: Duplicat pentru ${listing.id_extern}. Păstrăm ID-ul: ${duplicate}`,
      );
      await updateLastCheck(duplicate);
      return;
    }
    await insertListing(listing);
    console.log("was insereted");
     //price changed
  } else if (old_listing.price != listing.price) {
    await updatePrice(listing.price, listing.id_extern);
    await updateListingData(listing);
    await updateLastCheck(listing.id_extern);
    await updateActiveStatus(listing.id_extern)
    console.log("price changed");
    //listing changed
  } else {
    await updateListingData(listing);
    await updateLastCheck(listing.id_extern);
    await updateActiveStatus(listing.id_extern)
    console.log("last check changed");
  }
}
