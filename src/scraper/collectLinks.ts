import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto("https://999.md/ro/list/real-estate/apartments-and-rooms");
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

console.log(links);
await browser.close();
