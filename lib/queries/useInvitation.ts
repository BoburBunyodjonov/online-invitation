import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import type { InvitationDTO } from "@/lib/types";
import type {
  InvitationCreate,
  InvitationUpdate,
} from "@/lib/validation/invitation";
import { orderKeys } from "./useOrders";

export function useCreateInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: InvitationCreate) => {
      const { data } = await api.post<InvitationDTO>("/admin/invitations", input);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(data.orderId) });
      qc.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: InvitationUpdate;
    }) => {
      const { data } = await api.put<InvitationDTO>(
        `/admin/invitations/${id}`,
        input,
      );
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(data.orderId) });
    },
  });
}

export function usePublishInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<InvitationDTO>(
        `/admin/invitations/${id}/publish`,
      );
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(data.orderId) });
      qc.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
