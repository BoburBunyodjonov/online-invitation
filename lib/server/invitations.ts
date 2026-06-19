import { prisma } from "./db";
import { notFound, badRequest } from "./api-error";
import type { InvitationData } from "@/lib/validation/invitation-data";
import type {
  InvitationCreate,
  InvitationUpdate,
} from "@/lib/validation/invitation";
import type { Prisma } from "@/lib/generated/prisma";

const RESERVED_SLUGS = new Set(["-", "opengraph-image"]);

function slugify(input: string): string {
  const result = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!result || RESERVED_SLUGS.has(result) || result.length < 2) return "";
  return result;
}

export function isValidInvitationSlug(slug: string): boolean {
  return (
    slug.length >= 2 &&
    /^[a-z0-9-]+$/.test(slug) &&
    !RESERVED_SLUGS.has(slug)
  );
}

function slugBaseFromData(data: InvitationData): string {
  const groom = Object.values(data.groomName ?? {})
    .map((v) => v.trim())
    .find(Boolean);
  const bride = Object.values(data.brideName ?? {})
    .map((v) => v.trim())
    .find(Boolean);
  return [groom, bride].filter(Boolean).join("-");
}

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "invitation";
  let candidate = root;
  let n = 1;
  // Loop until we find a free slug.
  while (await prisma.invitation.findUnique({ where: { slug: candidate } })) {
    n += 1;
    candidate = `${root}-${n}`;
  }
  return candidate;
}

export async function getPublishedInvitationBySlug(slug: string) {
  const invitation = await prisma.invitation.findUnique({ where: { slug } });
  if (!invitation || !invitation.isPublished) {
    throw notFound("Invitation not found");
  }
  const template = await prisma.template.findUnique({
    where: { id: invitation.templateId },
  });
  if (!template) throw notFound("Template not found");
  return { invitation, template };
}

export async function getInvitationById(id: string) {
  const invitation = await prisma.invitation.findUnique({ where: { id } });
  if (!invitation) throw notFound("Invitation not found");
  return invitation;
}

export async function getInvitationByOrderId(orderId: string) {
  return prisma.invitation.findUnique({ where: { orderId } });
}

/** Increments views for a published invitation slug. */
export async function recordInvitationView(slug: string): Promise<void> {
  const { invitation } = await getPublishedInvitationBySlug(slug);
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { views: { increment: 1 } },
  });
}

export async function createInvitation(input: InvitationCreate) {
  const existing = await prisma.invitation.findUnique({
    where: { orderId: input.orderId },
  });
  if (existing) throw badRequest("This order already has an invitation");

  const slug =
    input.slug && isValidInvitationSlug(input.slug)
      ? input.slug
      : await uniqueSlug(slugBaseFromData(input.data) || input.orderId);

  return prisma.invitation.create({
    data: {
      orderId: input.orderId,
      templateId: input.templateId,
      slug,
      data: input.data as unknown as Prisma.InputJsonValue,
      isPublished: input.isPublished ?? false,
    },
  });
}

export async function updateInvitation(id: string, input: InvitationUpdate) {
  await getInvitationById(id);
  const slug =
    input.slug === undefined
      ? undefined
      : isValidInvitationSlug(input.slug)
        ? input.slug
        : undefined;
  return prisma.invitation.update({
    where: { id },
    data: {
      slug,
      data: input.data as unknown as Prisma.InputJsonValue | undefined,
      isPublished: input.isPublished,
    },
  });
}

export async function publishInvitation(id: string) {
  const invitation = await getInvitationById(id);
  const data = invitation.data as unknown as InvitationData;
  let slug = invitation.slug;
  if (!isValidInvitationSlug(slug)) {
    slug = await uniqueSlug(slugBaseFromData(data) || id);
  }
  return prisma.invitation.update({
    where: { id },
    data: { isPublished: true, slug },
  });
}
