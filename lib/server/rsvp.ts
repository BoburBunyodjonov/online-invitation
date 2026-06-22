import { prisma } from "./db";
import { notFound } from "./api-error";
import { getPublishedInvitationBySlug } from "./invitations";
import type { RsvpCreate, RsvpSummary } from "@/lib/validation/rsvp";
import type { RsvpResponse } from "@/lib/generated/prisma";

export async function createRsvpResponse(
  slug: string,
  input: RsvpCreate,
): Promise<RsvpResponse> {
  const { invitation } = await getPublishedInvitationBySlug(slug);
  return prisma.rsvpResponse.create({
    data: {
      invitationId: invitation.id,
      guestName: input.guestName,
      phone: input.phone || null,
      status: input.status,
      guestCount: input.status === "ATTENDING" ? input.guestCount : 0,
      message: input.message || null,
    },
  });
}

export async function listRsvpResponses(invitationId: string) {
  await prisma.invitation.findUniqueOrThrow({ where: { id: invitationId } });
  return prisma.rsvpResponse.findMany({
    where: { invitationId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRsvpSummary(invitationId: string): Promise<RsvpSummary> {
  const rows = await listRsvpResponses(invitationId);
  const attending = rows.filter((r) => r.status === "ATTENDING");
  const notAttending = rows.filter((r) => r.status === "NOT_ATTENDING");
  const maybe = rows.filter((r) => r.status === "MAYBE");
  return {
    total: rows.length,
    attending: attending.length,
    notAttending: notAttending.length,
    maybe: maybe.length,
    totalGuests: attending.reduce((sum, r) => sum + r.guestCount, 0),
  };
}

export async function getRsvpResponsesByInvitationId(invitationId: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });
  if (!invitation) throw notFound("Invitation not found");
  const [responses, summary] = await Promise.all([
    listRsvpResponses(invitationId),
    getRsvpSummary(invitationId),
  ]);
  return { responses, summary };
}

export function rsvpResponsesToCsv(
  responses: RsvpResponse[],
): string {
  const header = "Name,Phone,Status,Guest Count,Message,Created At";
  const lines = responses.map((r) =>
    [
      csvEscape(r.guestName),
      csvEscape(r.phone ?? ""),
      r.status,
      String(r.guestCount),
      csvEscape(r.message ?? ""),
      r.createdAt.toISOString(),
    ].join(","),
  );
  return [header, ...lines].join("\n");
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
