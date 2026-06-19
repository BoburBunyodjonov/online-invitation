import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/queries/axios";
import type { AdminStats } from "@/lib/server/stats";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get<AdminStats>("/admin/stats");
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
