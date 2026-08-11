type listing = {
  title: string;
  price: number;
  zone: string;
  m2: number;
  rooms: number;
  floor: number;
  id_extern: string;
};

let listings: listing[] = [];

const sectoare = [
  "Botanica",
  "Buiucani",
  "Centru",
  "Ciocana",
  "Râșcani",
  "Rîșcani",
  "Riscani",
  "Poșta Veche",
  "Posta Veche",
];
const camere = ["1", "2", "3", "4"];

function extrageSector(str: string): string | null {
  const pattern = new RegExp(`\\b(${sectoare.join("|")})\\b`, "i");
  const match = str.match(pattern);

  return match ? match[0] : null;
}
function extrageCamere(str: string): string | null {
  const pattern = new RegExp(`\\b(${camere.join("|")})\\b`, "i");
  const match = str.match(pattern);

  return match ? match[0] : null;
}

async function scrape() {
  const response = await fetch("https://999.md/ro/102555457");
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
  const floor = caracteristici.controls.find((c: any) => c.title === "Etaj");
  const rooms = caracteristici.controls.find(
    (c: any) => c.title === "Număr de camere",
  );
  if (!surface || !floor || !rooms) {
    console.log("SKIP ANUNT");
    return;
  }

  console.log(extras.id); //external_id
  console.log(extras.title); //title
  console.log(extras.isExpired); //active
  console.log(extras.price.value.value); //price
  console.log(extras.district.value.translated); //zone
  console.log(extrageCamere(rooms.feature.value.translated)); //rooms
  console.log(surface.feature.value.value); //m2
  console.log(floor.feature.value.translated); //floor

  /*listings.push({
    title: "ion",
    price: 12,
    zone: "",
    m2: 12,
    rooms: 12,
    floor: 2,
    id_extern: 135233
  })*/
}

scrape();
