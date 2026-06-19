import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError, badRequest } from "@/lib/server/api-error";

export const runtime = "nodejs";

/** Upload a file (image/audio) to Vercel Blob and return its public URL. */
export async function POST(req: Request) {
  try {
    await requireAdmin();

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      throw badRequest("No file provided");
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw badRequest(
        "BLOB_READ_WRITE_TOKEN is not configured. Add it to your environment to enable uploads.",
      );
    }

    const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return handleApiError(error);
  }
}
