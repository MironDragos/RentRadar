import { chromium } from "playwright";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
let preTotalLinks: unknown[] = [];
for (var i = 1; i < 10; i++) {
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

  await sleep(randomDelay(1500, 4000));
}
const totalLinks = [...new Set(preTotalLinks.flat())];

console.log(totalLinks);
await browser.close();
