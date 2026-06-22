"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/server/auth";
import { rateLimit } from "@/lib/server/rate-limit";

async function loginClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip") ?? "unknown";
}

/** Server-side credentials login (reliable with Auth.js v5 App Router). */
export async function loginAdmin(
  email: string,
  password: string,
  callbackUrl?: string,
): Promise<{ error?: string } | void> {
  const ip = await loginClientIp();
  const rl = rateLimit(`login:${ip}`, 10, 15 * 60_000);
  if (!rl.allowed) {
    return { error: "Too many login attempts. Try again later." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || "/admin/orders",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password" };
      }
    }
    // signIn throws NEXT_REDIRECT on success — rethrow anything else.
    throw error;
  }
}
