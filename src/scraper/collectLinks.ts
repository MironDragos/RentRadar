import { chromium } from "playwright";
import { writeFile } from "fs/promises";
import { userAgents } from "./userAgents.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function collectLinks(pages: number) {
  const randomUA =
    userAgents[Math.floor(Math.random() * userAgents.length)] ?? userAgents[0]!;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ userAgent: randomUA });

  let preTotalLinks: string[][] = [];

  for (var i = 0; i < pages; i++) {
    await page.goto(
      `https://999.md/ro/list/real-estate/apartments-and-rooms?page=${i + 1}`,
    );
    await page.waitForSelector("a h4");

    const links = (await page.evaluate(() => {
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
    })) as string[];

    preTotalLinks.push(links);
    console.log(`Am colectat cu succes ${links.length} linkuri`);
    await sleep(randomDelay(1000, 3000));
  }

  const totalLinks: string[] = [...new Set(preTotalLinks.flat())];

  await browser.close();
  return totalLinks;
}
