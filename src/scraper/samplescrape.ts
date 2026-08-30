import { chromium } from "playwright";
import { userAgents } from "./userAgents.js";
import { scrape } from "./scrape.js";
import type { Listing } from "../types/listing.js";
import { saveListing } from "../services/serviceListings.js";
import { markInactiveSince } from "../repositories/repositoryListings.js";

function simultanios(startIndex: number, count: number, links: string[]) {
  var list = [];
  for (var i = startIndex; i < startIndex + count; i++) {
    list.push(scrape(links[i]));
  }
  return list;
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sampleScrape() {
  const randomUA =
    userAgents[Math.floor(Math.random() * userAgents.length)] ?? userAgents[0]!;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ userAgent: randomUA });

  let preTotalLinks: string[][] = [];
  let maxBlankPages = 3;
  for (var i = 0; i < 2; i++) {
    try {
      await page.goto(
        `https://999.md/ro/list/real-estate/apartments-and-rooms?page=${i + 1}`,
      );
      await page.waitForSelector("a h4");

      const links = (await page.evaluate(() => {
        const container = document.querySelector(
          '[data-testid="infinite-ads-list"]',
        );
        if (!container) {
          return [];
        }
        const ads = new Set();
        container.querySelectorAll("a").forEach((a) => {
          const href = a.getAttribute("href");

          if (href && href.startsWith("/ro/")) {
            const id = href.split("/ro/")[1]?.split("?")[0];

            if (id && String(Number(id)) === id) {
              ads.add("https://999.md/ro/" + id);
            }
          }
        });
        return Array.from(ads);
      })) as string[];
      if (links.length === 0) {
        maxBlankPages--;
        if (maxBlankPages <= 0) {
          console.log("3 tries have failed");
          break;
        }
        await sleep(randomDelay(1000, 3000));
        continue;
      }

      maxBlankPages = 3;
      preTotalLinks.push(links);
      console.log(
        `Am colectat cu succes ${links.length} linkuri. Am colectat pana acum: ${i} de pagini`,
      );
    } catch (error: any) {
      console.log(`Eroare la pagina ${i + 1}: ${error.message}`);
      maxBlankPages--;
      if (maxBlankPages <= 0) {
        console.log("3 erori consecutive. Oprim colectarea.");
        break;
      }
      await sleep(randomDelay(1000, 3000));
      continue;
    }

    await sleep(randomDelay(400, 100));
  }
  const totalLinks: string[] = [...new Set(preTotalLinks.flat())];

  await browser.close();

  const runStartDate = new Date();
  const links: string[] = totalLinks;
  var total_links = links.length;
  const N = 7;
  for (var i = 0; i < links.length; i += N) {
    total_links -= N;
    try {
      const list: Listing[] = await Promise.all(simultanios(i, N, links));

      if (list.length === N && list.every((l) => l !== undefined)) {
        await Promise.all(list.map((l) => saveListing(l)));
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
await sampleScrape();
