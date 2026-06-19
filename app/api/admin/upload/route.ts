import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError, badRequest } from "@/lib/server/api-error";
import { getSiteUrl } from "@/lib/seo/site-url";

export const runtime = "nodejs";

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/** Upload to Vercel Blob, or to local disk when self-hosting without Blob. */
export async function POST(req: Request) {
  try {
    await requireAdmin();

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      throw badRequest("No file provided");
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return NextResponse.json({ url: blob.url });
    }

    const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${safeName(file.name)}`;
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const url = `${getSiteUrl()}/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    return handleApiError(error);
  }
}
