import { scrape } from "./scraper/scrape.js";
import type { Listing } from "./types/listing.js";
import { collectLinks } from "./scraper/collectLinks.js";
import { saveListing } from "./services/serviceListings.js";

async function run() {
  const links: string[] = await collectLinks(30);
  var total_links = links.length;
  for (const link of links) {
    total_links--;
    try {
      const list: Listing | undefined = await scrape(link);
      if (list) {
        await saveListing(list);
      }
      console.log(`It worked: ${link}. ${total_links} left`);
    } catch (error: any) {
      if (error.message === "RATE_LIMITED") {
        console.log("RATE LIMIT detected — stoped the proccess.");
        break;
      }
      console.log(`Eroare la ${link} deoarece ${error}`);
    }
  }
}
await run();
