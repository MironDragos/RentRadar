import { scrape } from "./scraper/scrape.js";
import type { Listing } from "./types/listing.js";
import { collectLinks } from "./scraper/collectLinks.js";
import { saveListing } from "./services/serviceListings.js";

function simultanios(startIndex: number, count: number, links: string[]) {
  var list = [];
  for (var i = startIndex; i < startIndex + count; i++) {
    list.push(scrape(links[i]));
  }
  return list;
}
async function run() {
  const links: string[] = await collectLinks();
  var total_links = links.length;
  const N = 5;
  for (var i = 0; i < links.length; i += N) {
    total_links -= N;
    try {
      const list: Listing[] = await Promise.all(simultanios(i, N, links));

      if (list.length === N && list.every((l) => l !== undefined)) {
        for (const l of list) {
          await saveListing(l);
        }
      }
      console.log(`It worked for a batch of ${N}. ${total_links} left`);
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
