import "dotenv/config";
import { Pool } from "pg";

export const DB = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

DB.on("error", (err) => {
  console.error("DB pool error:", err);
});

DB.connect()
  .then((client) => {
    console.log("DB connected OK");
    client.release();
  })
  .catch((err) => {
    console.error("DB connect FAILED:", err);
    if ("errors" in err) console.error("Sub-errors:", err.errors);
  });
