import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./axios";
import type { OrderDTO } from "@/lib/types";
import type { OrderUpdate, OrderCreate } from "@/lib/validation/order";

export const orderKeys = {
  all: ["orders"] as const,
  list: (status?: string) => [...orderKeys.all, "list", status ?? "all"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export function useOrders(status?: string) {
  return useQuery({
    queryKey: orderKeys.list(status),
    queryFn: async () => {
      const { data } = await api.get<OrderDTO[]>("/admin/orders", {
        params: status ? { status } : undefined,
      });
      return data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<OrderDTO>(`/admin/orders/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: OrderCreate) => {
      const { data } = await api.post<OrderDTO>("/admin/orders", input);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      qc.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
    },
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: OrderUpdate }) => {
      const { data } = await api.put<OrderDTO>(`/admin/orders/${id}`, input);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      qc.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
    },
  });
}
