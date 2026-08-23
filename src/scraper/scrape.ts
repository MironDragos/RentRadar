import type { Listing } from "../types/listing.js";
import { userAgents } from "./userAgents.js";

const randomUA =
  userAgents[Math.floor(Math.random() * userAgents.length)] ?? userAgents[0]!;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rooms = ["1", "2", "3", "4", "5"];
const offerType = ["Vând", "De închiriat lunar", "De închiriat pe zi"];
function extractPrice(currency: string, price: number) {
  if (currency === "MDL") {
    return price / 20;
  } else if (currency === "USD") {
    return price / 1.17;
  } else {
    return price;
  }
}
function extractRoom(str: string): string | null {
  const pattern = new RegExp(`\\b(${rooms.join("|")})\\b`, "i");
  let match = str.match(pattern);

  return match ? match[0] : "0";
}
function extractOfferType(str: string): string | null {
  const pattern = new RegExp(`\\b(${offerType.join("|")})\\b`, "i");
  let match = str.match(pattern);

  return match ? match[0] : null;
}
function extractFloor(str: string): string {
  const match = str.match(/\d+/);
  return match ? match[0] : "0";
}

export async function scrape(link: string) {
  const response = await fetch(link, {
    headers: { "User-Agent": randomUA },
  });

  if (
    response.url.includes("999.md_request_limit.html") ||
    response.status === 429
  ) {
    throw new Error("RATE_LIMITED");
  }

  const html = await response.text();
  const startJSON = html.indexOf("adView");
  const arrayJSON = html.substring(startJSON);
  let endJSON = 0;
  let counter = 0;
  for (let i = 9; i < arrayJSON.length; i++) {
    if (arrayJSON[i] === "{") {
      counter++;
    } else if (arrayJSON[i] === "}") {
      counter--;
    }
    if (counter === 0) {
      endJSON = i + startJSON;
      break;
    }
  }

  let preTextJSON = html.substring(startJSON + 9, endJSON + 1);
  let textJSON = JSON.parse(`"${preTextJSON}"`);
  const extras = JSON.parse(textJSON);

  const caracteristici = extras.groups.find(
    (g: any) => g.title === "Caracteristici",
  );
  if (!caracteristici) {
    console.log("SKIP ANUNT");
    return;
  }
  const surface = caracteristici.controls.find(
    (c: any) => c.title === "Suprafață totală",
  );
  const m2 = surface.feature.value.value;
  const floor = caracteristici.controls.find((c: any) => c.title === "Etaj");
  const rooms = caracteristici.controls.find(
    (c: any) => c.title === "Număr de camere",
  );
  const price = extractPrice(
    extras.price.value.unit.replace("UNIT_", "") || null,
    extras.price.value.value,
  );
  let zone;
  if (extras.city.value.translated === "Chișinău") {
    zone = extras.district.value.translated;
  } else {
    zone = extras.city.value.translated;
  }
  if (!surface || !floor || !rooms || m2 < 10 || m2 > 500) {
    console.log("SKIP ANUNT");
    return;
  }

  const listing: Listing = {
    id_extern: extras.id,
    offer_type: extractOfferType(extras.offerType.value.translated),
    title: extras.title,
    price: price,
    zone: zone,
    m2: m2,
    rooms: Number(extractRoom(rooms.feature.value.translated)),
    floor: Number(extractFloor(floor.feature.value.translated)),
  };
  await sleep(randomDelay(400, 1000));
  return listing;
}
