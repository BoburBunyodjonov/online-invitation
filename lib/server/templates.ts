import { prisma } from "./db";
import { badRequest, notFound } from "./api-error";
import type { TemplateInput, TemplateUpdate } from "@/lib/validation/template";
import type { Prisma } from "@/lib/generated/prisma";
import { Prisma as PrismaRuntime } from "@/lib/generated/prisma";
import {
  getViewRequestContext,
  shouldCountView,
} from "./view-tracking";
import {
  clientIp,
  rateLimit,
  tooManyRequests,
} from "./rate-limit";

/**
 * Framework-agnostic template business logic. Called from API Route Handlers
 * AND directly from Server Components (no need to round-trip through HTTP).
 */

export async function listPublishedTemplates() {
  return prisma.template.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listAllTemplates() {
  return prisma.template.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getTemplateBySlug(slug: string) {
  const template = await prisma.template.findUnique({ where: { slug } });
  if (!template) throw notFound("Template not found");
  return template;
}

/** Public preview — only published templates. */
export async function getPublishedTemplateBySlug(slug: string) {
  const template = await prisma.template.findFirst({
    where: { slug, isPublished: true },
  });
  if (!template) throw notFound("Template not found");
  return template;
}

export async function getTemplateById(id: string) {
  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) throw notFound("Template not found");
  return template;
}

/** Increments views for a published template preview page. */
export async function recordTemplatePreviewView(
  slug: string,
  req?: Request,
): Promise<{ counted: boolean }> {
  if (req) {
    const ip = clientIp(req);
    const rl = rateLimit(`view:template:${ip}`, 120, 60_000);
    if (!rl.allowed) throw tooManyRequests(rl.retryAfterSec);

    const ctx = getViewRequestContext(req);
    if (!shouldCountView(ctx, "template", slug)) {
      return { counted: false };
    }
  }

  const template = await getPublishedTemplateBySlug(slug);
  await prisma.template.update({
    where: { id: template.id },
    data: { views: { increment: 1 } },
  });
  return { counted: true };
}

export async function createTemplate(input: TemplateInput) {
  const { previewImages, fieldsSchema, themeDefaults, ...rest } = input;
  try {
    return await prisma.template.create({
      data: {
        ...rest,
        previewImages: previewImages as unknown as Prisma.InputJsonValue,
        fieldsSchema: fieldsSchema as unknown as Prisma.InputJsonValue,
        themeDefaults: themeDefaults as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (
      error instanceof PrismaRuntime.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw badRequest("A template with this slug already exists");
    }
    throw error;
  }
}

export async function updateTemplate(id: string, input: TemplateUpdate) {
  await getTemplateById(id);
  const { previewImages, fieldsSchema, themeDefaults, ...rest } = input;
  return prisma.template.update({
    where: { id },
    data: {
      ...rest,
      previewImages: previewImages as unknown as
        | Prisma.InputJsonValue
        | undefined,
      fieldsSchema: fieldsSchema as unknown as
        | Prisma.InputJsonValue
        | undefined,
      themeDefaults: themeDefaults as unknown as
        | Prisma.InputJsonValue
        | undefined,
    },
  });
}

export async function deleteTemplate(id: string) {
  await getTemplateById(id);
  await prisma.template.delete({ where: { id } });
}
