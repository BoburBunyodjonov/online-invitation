import { NextResponse } from "next/server";
import { getTemplateBySlug } from "@/lib/server/templates";
import { handleApiError } from "@/lib/server/api-error";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const template = await getTemplateBySlug(slug);
    return NextResponse.json(template);
  } catch (error) {
    return handleApiError(error);
  }
}
