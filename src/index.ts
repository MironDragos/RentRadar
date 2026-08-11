import { scrape } from "./scraper/scrape.js";

const links: string[] = [
  "https://999.md/ro/105033292",
  "https://999.md/ro/105036301",
  "https://999.md/ro/103385519",
  "https://999.md/ro/104986113",
  "https://999.md/ro/89762245",
  "https://999.md/ro/104375752",
  "https://999.md/ro/104468652",
  "https://999.md/ro/104290378",
  "https://999.md/ro/105083072",
  "https://999.md/ro/104698758",
  "https://999.md/ro/104087143",
  "https://999.md/ro/104018855",
  "https://999.md/ro/105013890",
  "https://999.md/ro/89830370",
  "https://999.md/ro/103861505",
];

async function run() {
  for (const link of links) {
    console.log(await scrape(link));
  }
}
run();
