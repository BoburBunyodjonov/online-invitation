import { NextResponse } from "next/server";
import { handleUpdate } from "@/lib/server/telegram";
import type { Update } from "grammy/types";

// Telegram bot must run on the Node.js runtime (grammy + Prisma).
export const runtime = "nodejs";

export async function POST(req: Request) {
  // Verify the secret token Telegram echoes back on every webhook call.
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  const got = req.headers.get("x-telegram-bot-api-secret-token");
  if (expected && got !== expected) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const update = (await req.json()) as Update;
    await handleUpdate(update);
  } catch (error) {
    // Always 200 so Telegram does not retry forever on a transient app error.
    console.error("[telegram] webhook error", error);
  }

  return NextResponse.json({ ok: true });
}
