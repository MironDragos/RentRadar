import 'dotenv/config';
import { Pool } from "pg";



export const DB = new Pool({
    user: process.env.POSTGRES_USER,
    host: "localhost",
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: Number(process.env.PORT)
})
