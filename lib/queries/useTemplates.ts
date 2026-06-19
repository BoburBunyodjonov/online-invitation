import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./axios";
import type { TemplateDTO } from "@/lib/types";
import type { TemplateInput, TemplateUpdate } from "@/lib/validation/template";

export const templateKeys = {
  all: ["templates"] as const,
  list: () => [...templateKeys.all, "list"] as const,
  detail: (slug: string) => [...templateKeys.all, "detail", slug] as const,
};

/** Public list of published templates. */
export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.list(),
    queryFn: async () => {
      const { data } = await api.get<TemplateDTO[]>("/templates");
      return data;
    },
  });
}

/** Admin: all templates (published + drafts). */
export function useAdminTemplates() {
  return useQuery({
    queryKey: [...templateKeys.all, "admin"],
    queryFn: async () => {
      const { data } = await api.get<TemplateDTO[]>("/admin/templates");
      return data;
    },
  });
}

export function useTemplate(slug: string) {
  return useQuery({
    queryKey: templateKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<TemplateDTO>(`/templates/${slug}`);
      return data;
    },
    enabled: Boolean(slug),
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TemplateInput) => {
      const { data } = await api.post<TemplateDTO>("/admin/templates", input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: templateKeys.all }),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: TemplateUpdate }) => {
      const { data } = await api.put<TemplateDTO>(
        `/admin/templates/${id}`,
        input,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: templateKeys.all }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/templates/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: templateKeys.all }),
  });
}
