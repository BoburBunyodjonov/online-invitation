import { useQuery } from "@tanstack/react-query";
import { api } from "./axios";
import type { RsvpSummary } from "@/lib/validation/rsvp";

export type RsvpResponseDTO = {
  id: string;
  invitationId: string;
  guestName: string;
  phone: string | null;
  status: "ATTENDING" | "NOT_ATTENDING" | "MAYBE";
  guestCount: number;
  message: string | null;
  createdAt: string;
  updatedAt: string;
};

export function useInvitationRsvps(invitationId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "rsvps", invitationId],
    queryFn: async () => {
      const { data } = await api.get<{
        responses: RsvpResponseDTO[];
        summary: RsvpSummary;
      }>(`/admin/invitations/${invitationId}/rsvps`);
      return data;
    },
    enabled: !!invitationId,
  });
}

export function rsvpExportUrl(invitationId: string): string {
  return `/api/admin/invitations/${invitationId}/rsvps/export`;
}
