import { prisma } from "./db";
import { notFound } from "./api-error";
import type { TemplateInput, TemplateUpdate } from "@/lib/validation/template";
import type { Prisma } from "@/lib/generated/prisma";

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

export async function getTemplateById(id: string) {
  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) throw notFound("Template not found");
  return template;
}

/** Increments views for a template preview page (/templates/[slug]/preview). */
export async function recordTemplatePreviewView(slug: string): Promise<void> {
  const template = await getTemplateBySlug(slug);
  await prisma.template.update({
    where: { id: template.id },
    data: { views: { increment: 1 } },
  });
}

export async function createTemplate(input: TemplateInput) {
  const { previewImages, fieldsSchema, themeDefaults, ...rest } = input;
  return prisma.template.create({
    data: {
      ...rest,
      previewImages: previewImages as unknown as Prisma.InputJsonValue,
      fieldsSchema: fieldsSchema as unknown as Prisma.InputJsonValue,
      themeDefaults: themeDefaults as unknown as Prisma.InputJsonValue,
    },
  });
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
