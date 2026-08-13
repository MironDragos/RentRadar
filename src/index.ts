import { scrape } from "./scraper/scrape.js";
import { links } from "../links.js";
import type { Listing } from "./types/listing.js";
import { writeFile } from "fs/promises";

let listings: (Listing | undefined)[] = [];
async function run() {
  for (const link of links) {
    try {
      const list: Listing | undefined = await scrape(link);
      if (list) {
        listings.push(list);
      }
      console.log(`O mers: ${link}`);
    } catch (error: any) {
      console.log(`Eroare la ${link} deoarece ${error}`);
    }
  }
}
await run();
console.log(listings);
await writeFile("listings.json", JSON.stringify(listings, null, 2));
