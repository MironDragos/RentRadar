import { scrape } from "./scraper/scrape.js";
import type { Listing } from "./types/listing.js";
import { collectLinks } from "./scraper/collectLinks.js";
import { saveListing } from "./services/serviceListings.js";

async function run() {
  const links: string[] = await collectLinks(350);
  var total_links = links.length;
  for (var i = 0; i < links.length; i += 3) {
    total_links -= 3;
    try {
      const list: Listing[] = await Promise.all([
        scrape(links[i]),
        scrape(links[i + 1]),
        scrape(links[i + 2]),
      ]);

      if (list[0] && list[1]) {
        await saveListing(list[0]);
        await saveListing(list[1]);
        await saveListing(list[2]);
      }
      console.log(
        `It worked for: ${links[i]}, ${links[i + 1]}, ${links[i + 2]}. ${total_links} left`,
      );
    } catch (error: any) {
      if (error.message === "RATE_LIMITED") {
        console.log("RATE LIMIT detected — stoped the proccess.");
        break;
      }
      console.log(`Eroare la ${links[i]} deoarece ${error}`);
    }
  }
}
await run();
