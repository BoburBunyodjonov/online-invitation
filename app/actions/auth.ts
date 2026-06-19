"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/server/auth";

/** Server-side credentials login (reliable with Auth.js v5 App Router). */
export async function loginAdmin(
  email: string,
  password: string,
  callbackUrl?: string,
): Promise<{ error?: string } | void> {
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
