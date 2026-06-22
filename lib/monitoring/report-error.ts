type ErrorContext = Record<string, unknown>;

function serializeError(error: unknown): {
  message: string;
  stack?: string;
  name?: string;
} {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack, name: error.name };
  }
  return { message: String(error) };
}

/** Best-effort error reporting — webhook in production. Never throws. */
export async function reportError(
  error: unknown,
  context?: ErrorContext,
): Promise<void> {
  const payload = {
    ...serializeError(error),
    context,
    environment: process.env.NODE_ENV,
    runtime: process.env.NEXT_RUNTIME,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== "production") {
    console.error("[monitoring]", payload);
    return;
  }

  const webhook = process.env.MONITORING_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });
    } catch (e) {
      console.error("[monitoring] webhook failed", e);
    }
    return;
  }

  console.error("[monitoring]", payload);
}
