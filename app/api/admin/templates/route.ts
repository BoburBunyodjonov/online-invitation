import { NextResponse } from "next/server";
import { listAllTemplates, createTemplate } from "@/lib/server/templates";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";
import { templateInputSchema } from "@/lib/validation/template";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const templates = await listAllTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const input = templateInputSchema.parse(body);
    const template = await createTemplate(input);
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
