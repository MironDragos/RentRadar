import "dotenv/config";
import { DB } from "../db/db.js";

const ZONE_MAP: Record<string, string> = {
  Sîngera: "Botanica",
  Aeroport: "Botanica",
  Bacioi: "Botanica",
  Băcioi: "Botanica",
  Durlești: "Buiucani",
  Vatra: "Buiucani",
  Ghidighici: "Buiucani",
  Sculeni: "Buiucani",
  Codru: "Centru",
  Telecentru: "Centru",
  Râșcani: "Rîșcani",
  "Poșta Veche": "Rîșcani",
  Cricova: "Rîșcani",
  Ciorescu: "Rîșcani",
  Stăuceni: "Rîșcani",
  "Vadul lui Vodă": "Ciocana",
  Bubuieci: "Ciocana",
  Colonița: "Ciocana",
  Tohatin: "Ciocana",
  "5 cartier": "Bălți",
  "6 cartier": "Bălți",
  "7 cartier": "Bălți",
  "8 cartier": "Bălți",
  "9 cartier": "Bălți",
  "10 cartier": "Bălți",
  Bam: "Bălți",
  BAM: "Bălți",
  Molodova: "Bălți",
  Autogara: "Bălți",
  "Gara de nord": "Bălți",
  Paminteni: "Bălți",
  "Podul Chișinăului": "Bălți",
  "Bălții Noi": "Bălți",
  Periferie: "Bălți",
  Tineret: "Bălți",
  Balca: "Bălți",
  Steluța: "Bălți",
  Dănuțeni: "Bălți",
};

const OFFICIAL_ZONES = [
  "Centru",
  "Botanica",
  "Buiucani",
  "Rîșcani",
  "Ciocana",
  "Bălți",
  "Orhei",
  "Cahul",
  "Soroca",
  "Ungheni",
  "Comrat",
  "Edineț",
  "Drochia",
  "Strășeni",
  "Ialoveni",
  "Hîncești",
  "Căușeni",
  "Cimișlia",
  "Criuleni",
  "Florești",
  "Fălești",
  "Sîngerei",
  "Anenii Noi",
  "Dubăsari",
  "Rîbnița",
  "Călărași",
  "Briceni",
  "Dondușeni",
  "Leova",
  "Ceadîr-Lunga",
  "Ştefan Vodă",
];

async function run() {
  for (const [raw, mapped] of Object.entries(ZONE_MAP)) {
    const r = await DB.query("UPDATE listing SET zone = $1 WHERE zone = $2", [
      mapped,
      raw,
    ]);
    console.log(raw, "->", mapped, r.rowCount);
  }

  const deleted = await DB.query(
    "DELETE FROM listing WHERE zone <> ALL($1::text[]) RETURNING zone",
    [OFFICIAL_ZONES],
  );
  console.log("deleted", deleted.rowCount);
  console.log([...new Set(deleted.rows.map((r) => r.zone))]);
}

run().then(() => process.exit(0));
