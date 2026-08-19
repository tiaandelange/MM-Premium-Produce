import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "@/db/schema";

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and add the Neon connection string.");
  }
  return url;
}

export function getDb() {
  if (cached) return cached;
  cached = drizzle(
    neon(getDatabaseUrl(), {
      fetchOptions: { cache: "no-store" },
    }),
    { schema },
  );
  return cached;
}

export type Database = ReturnType<typeof getDb>;
