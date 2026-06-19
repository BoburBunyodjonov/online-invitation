import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./axios";
import type { SiteSettingsDTO } from "@/lib/site-settings/types";
import type { SiteSettingsInput } from "@/lib/validation/site-settings";

export const siteSettingsKeys = {
  all: ["site-settings"] as const,
};

export function useAdminSiteSettings() {
  return useQuery({
    queryKey: siteSettingsKeys.all,
    queryFn: async () => {
      const { data } = await api.get<SiteSettingsDTO>("/admin/site-settings");
      return data;
    },
  });
}

export function useUpdateSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SiteSettingsInput) => {
      const { data } = await api.put<SiteSettingsDTO>(
        "/admin/site-settings",
        input,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: siteSettingsKeys.all }),
  });
}
