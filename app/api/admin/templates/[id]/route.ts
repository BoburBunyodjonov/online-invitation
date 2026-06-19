import { NextResponse } from "next/server";
import { updateTemplate, deleteTemplate } from "@/lib/server/templates";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";
import { templateUpdateSchema } from "@/lib/validation/template";

export const runtime = "nodejs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const input = templateUpdateSchema.parse(body);
    const template = await updateTemplate(id, input);
    return NextResponse.json(template);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteTemplate(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
