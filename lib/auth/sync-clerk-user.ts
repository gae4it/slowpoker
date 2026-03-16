import { auth, clerkClient } from "@clerk/nextjs/server";
import { upsertAppUser } from "@/lib/auth/app-user-sync";

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

  const storedUser = await upsertAppUser({
    clerkId: clerkUser.id,
    username: clerkUser.username,
    primaryEmail: clerkUser.primaryEmailAddress?.emailAddress ?? null,
  });

  return {
    synced: true as const,
    user: storedUser,
  };
}
