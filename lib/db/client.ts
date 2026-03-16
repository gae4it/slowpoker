import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Strip accidental surrounding quotes that some env parsers preserve
const connectionString = (process.env.DATABASE_URL ?? "").replace(/^['"]|['"]$/g, "") || undefined;

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
