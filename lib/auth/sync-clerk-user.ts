import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

function buildUsername(clerkId: string, username?: string | null, email?: string | null) {
  if (username && username.length > 1) {
    return username;
  }

  if (email) {
    const emailPrefix = email.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    if (emailPrefix && emailPrefix.length > 2) {
      return `${emailPrefix}_${clerkId.slice(-4)}`;
    }
  }

  return `player_${clerkId.slice(-8)}`;
}

export async function syncClerkUser() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  if (!process.env.DATABASE_URL) {
    return {
      synced: false as const,
      reason: "missing_database_url" as const,
      clerkId: clerkUser.id,
    };
  }

  const db = getDb();
  const username = buildUsername(
    clerkUser.id,
    clerkUser.username,
    clerkUser.primaryEmailAddress?.emailAddress ?? null,
  );

  await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      username,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        username,
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
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  return {
    synced: true as const,
    user: storedUser,
  };
}
