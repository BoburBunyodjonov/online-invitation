import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@/lib/generated/prisma";
import { reportError } from "@/lib/monitoring/report-error";

/**
 * Centralized API error type + handler used by every Route Handler so they all
 * return a consistent JSON error shape with correct HTTP status codes.
 */
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (msg = "Bad request", details?: unknown) =>
  new ApiError(400, msg, details);
export const unauthorized = (msg = "Unauthorized") => new ApiError(401, msg);
export const forbidden = (msg = "Forbidden") => new ApiError(403, msg);
export const notFound = (msg = "Not found") => new ApiError(404, msg);

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.issues },
      { status: 422 },
    );
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        error:
          "Database schema mismatch. Run `npm run db:migrate` and restart the dev server.",
        details: error.message,
      },
      { status: 500 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      { error: error.message, details: { code: error.code } },
      { status: 400 },
    );
  }

  console.error("[api] Unhandled error:", error);
  void reportError(error, { source: "api" });
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 },
  );
}
