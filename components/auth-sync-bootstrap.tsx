import { syncClerkUser } from "@/lib/auth/sync-clerk-user";

export async function AuthSyncBootstrap() {
  try {
    await syncClerkUser();
  } catch {
    // Ignore sync failures in layout bootstrap so public pages keep rendering.
  }

  return null;
}
