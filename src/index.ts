import { scrape } from "./scraper/scrape.js";
import type { Listing } from "./types/listing.js";
import { collectLinks } from "./scraper/collectLinks.js";
import { saveListing } from "./services/serviceListings.js";

async function run() {
  const links: string[] = await collectLinks(1);

  for (const link of links) {
    try {
      const list: Listing | undefined = await scrape(link);
      if (list) {
        await saveListing(list);
      }
      console.log(`O mers: ${link}`);
    } catch (error: any) {
      if (error.message === "RATE_LIMITED") {
        console.log("RATE LIMIT detectat — opresc procesul.");
        break;
      }
      console.log(`Eroare la ${link} deoarece ${error}`);
    }
  }
}
await run();
