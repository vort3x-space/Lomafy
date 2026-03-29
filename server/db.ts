import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "NEON_DATABASE_URL veya DATABASE_URL tanımlanmamış. Veritabanı yapılandırmasını kontrol edin.",
  );
}

const isNeon = connectionString.includes("neon.tech");

export const pool = new Pool({
  connectionString,
  ssl: isNeon ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
