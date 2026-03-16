import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

type AppUserSyncInput = {
  clerkId: string;
  username?: string | null;
  primaryEmail?: string | null;
};

export function buildUsername(clerkId: string, username?: string | null, email?: string | null) {
  if (username && username.length > 1) {
    return username;
  }

  if (email) {
    const emailPrefix = email
      .split("@")[0]
      ?.replace(/[^a-zA-Z0-9_]/g, "")
      .toLowerCase();
    if (emailPrefix && emailPrefix.length > 2) {
      return `${emailPrefix}_${clerkId.slice(-4)}`;
    }
  }

  return `player_${clerkId.slice(-8)}`;
}

export async function upsertAppUser({ clerkId, username, primaryEmail }: AppUserSyncInput) {
  const db = getDb();
  const normalizedUsername = buildUsername(clerkId, username, primaryEmail);

  await db
    .insert(users)
    .values({
      clerkId,
      username: normalizedUsername,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        username: normalizedUsername,
      },
    });

  const [storedUser] = await db
    .select({
      id: users.id,
      clerkId: users.clerkId,
      username: users.username,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return storedUser;
}
