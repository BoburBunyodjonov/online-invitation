import { NextResponse } from "next/server";
import { listPublishedTemplates } from "@/lib/server/templates";
import { handleApiError } from "@/lib/server/api-error";

export const runtime = "nodejs";

export async function GET() {
  try {
    const templates = await listPublishedTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    return handleApiError(error);
  }
}
