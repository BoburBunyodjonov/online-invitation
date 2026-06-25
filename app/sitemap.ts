import type { MetadataRoute } from "next";
import { prisma } from "@/lib/server/db";
import { getSiteUrl } from "@/lib/seo/site-url";
import { DEFAULT_LOCALE, LOCALES } from "@/config/locales";
import { getLocalizedUrl } from "@/lib/seo/locale-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: getLocalizedUrl(locale),
    changeFrequency: "weekly",
    priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
    lastModified: new Date(),
  }));

  entries.push({
    url: siteUrl,
    changeFrequency: "weekly",
    priority: 1,
    lastModified: new Date(),
  });

  try {
    const [templates, invitations] = await Promise.all([
      prisma.template.findMany({ where: { isPublished: true } }),
      prisma.invitation.findMany({ where: { isPublished: true } }),
    ]);

    for (const tpl of templates) {
      entries.push({
        url: `${siteUrl}/templates/${tpl.slug}/preview`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const inv of invitations) {
      entries.push({
        url: `${siteUrl}/i/${inv.slug}`,
        lastModified: inv.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch (e) {
    console.error("[sitemap] DB unavailable, returning base entries", e);
  }

  return entries;
}
