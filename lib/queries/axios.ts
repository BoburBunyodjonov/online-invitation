import axios from "axios";

/** Shared axios instance. All client-side calls to /api/* go through this. */
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { error?: string } | undefined)?.error ??
      error.message
    );
  }
  return error instanceof Error ? error.message : "Something went wrong";
}
