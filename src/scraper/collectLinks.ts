import { chromium } from "playwright";
import { writeFile } from "fs/promises";
import { userAgents } from "./userAgents.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomUA =
  userAgents[Math.floor(Math.random() * userAgents.length)] ?? userAgents[0]!;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ userAgent: randomUA });

let preTotalLinks: unknown[] = [];
for (var i = 1; i < 30; i++) {
  await page.goto(
    `https://999.md/ro/list/real-estate/apartments-and-rooms?page=${i}`,
  );
  await page.waitForSelector("a h4");

  const links = await page.evaluate(() => {
    const ads = new Set();

    document.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href");

      if (href && href.startsWith("/ro/")) {
        const id = href.split("/ro/")[1]?.split("?")[0];

        if (id && String(Number(id)) === id) {
          ads.add("https://999.md/ro/" + id);
        }
      }
    });

    return Array.from(ads);
  });

  preTotalLinks.push(links);
  console.log(`Am colectat cu succes ${links.length} linkuri`);
  await sleep(randomDelay(1000, 3000));
}
const totalLinks = [...new Set(preTotalLinks.flat())];

await writeFile("links.json", JSON.stringify(totalLinks, null, 2));
await browser.close();
