import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

declare global {
  var __slowPokerDb: ReturnType<typeof drizzle> | undefined;
}

export function getDb() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.__slowPokerDb) {
    const client = postgres(connectionString, { prepare: false });
    globalThis.__slowPokerDb = drizzle(client);
  }

  return globalThis.__slowPokerDb;
}
