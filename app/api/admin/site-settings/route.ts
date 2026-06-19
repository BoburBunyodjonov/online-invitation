import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server/require-admin";
import { handleApiError } from "@/lib/server/api-error";
import {
  getSiteSettings,
  updateSiteSettings,
} from "@/lib/server/site-settings";
import { siteSettingsInputSchema } from "@/lib/validation/site-settings";
import { LOCALES } from "@/config/locales";
import { getLocalizedPath } from "@/lib/seo/locale-url";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const input = siteSettingsInputSchema.parse(body);
    const settings = await updateSiteSettings(input);
    revalidatePath("/", "layout");
    for (const locale of LOCALES) {
      revalidatePath(getLocalizedPath(locale));
    }
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
