import { useMutation } from "@tanstack/react-query";
import { api } from "./axios";

/** Upload a single file to Vercel Blob via the admin upload route. */
export function useUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post<{ url: string }>("/admin/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.url;
    },
  });
}
