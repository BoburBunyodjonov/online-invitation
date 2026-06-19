import { auth } from "./auth";
import { unauthorized } from "./api-error";

/** Throws ApiError(401) if there is no authenticated admin session. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw unauthorized("Admin authentication required");
  }
  return session;
}
