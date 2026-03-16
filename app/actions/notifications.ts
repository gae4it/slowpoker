"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db/client";
import { notifications } from "@/lib/db/schema";
import { syncClerkUser } from "@/lib/auth/sync-clerk-user";

export async function markNotificationReadAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const notificationId = String(formData.get("notificationId") ?? "").trim();
  const gameId = String(formData.get("gameId") ?? "").trim();

  if (!notificationId) {
    redirect("/dashboard?error=missing-notification");
  }

  const syncState = await syncClerkUser();
  if (!syncState?.synced || !syncState.user) {
    redirect("/dashboard?error=db-sync");
  }

  const db = getDb();

  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, syncState.user.id),
        isNull(notifications.readAt),
      ),
    );

  revalidatePath("/dashboard");

  if (gameId) {
    redirect(`/game/${gameId}`);
  }

  redirect("/dashboard");
}

export async function markAllNotificationsReadAction() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const syncState = await syncClerkUser();
  if (!syncState?.synced || !syncState.user) {
    redirect("/dashboard?error=db-sync");
  }

  const db = getDb();

  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, syncState.user.id), isNull(notifications.readAt)));

  revalidatePath("/dashboard");
  redirect("/dashboard");
}