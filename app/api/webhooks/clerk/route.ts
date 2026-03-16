import { NextRequest, NextResponse } from "next/server";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { upsertAppUser } from "@/lib/auth/app-user-sync";

export const runtime = "nodejs";

function extractPrimaryEmail(event: WebhookEvent) {
  if (!(event.type === "user.created" || event.type === "user.updated")) {
    return null;
  }

  const primaryEmailId = event.data.primary_email_address_id;
  const primaryEmail = event.data.email_addresses.find((email) => email.id === primaryEmailId);

  return primaryEmail?.email_address ?? null;
}

export async function POST(request: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return NextResponse.json({ error: "Missing CLERK_WEBHOOK_SIGNING_SECRET" }, { status: 500 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Missing DATABASE_URL" }, { status: 500 });
  }

  let event: WebhookEvent;

  try {
    event = await verifyWebhook(request);
  } catch {
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      await upsertAppUser({
        clerkId: event.data.id,
        username: event.data.username,
        primaryEmail: extractPrimaryEmail(event),
      });

      return NextResponse.json({ ok: true, type: event.type, clerkId: event.data.id });
    }
    case "user.deleted": {
      return NextResponse.json({ ok: true, type: event.type, ignored: true, reason: "preserve-game-history" });
    }
    default: {
      return NextResponse.json({ ok: true, type: event.type, ignored: true });
    }
  }
}