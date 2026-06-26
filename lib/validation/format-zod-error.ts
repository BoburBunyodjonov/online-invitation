import type { ZodError } from "zod";

const DEFAULT_FIELD_LABELS: Record<string, string> = {
  thumbnail: "Thumbnail",
  slug: "Slug",
  name: "Name",
  category: "Category",
  fieldsSchema: "Editable fields",
  themeDefaults: "Theme",
  previewImages: "Preview images",
};

export type ZodErrorFormatOptions = {
  fieldLabels?: Record<string, string>;
  invalidOrMissing?: (field: string) => string;
  fallback?: string;
};

export function formatZodError(
  error: ZodError,
  options?: ZodErrorFormatOptions,
): string {
  const issue = error.issues[0];
  if (!issue) return options?.fallback ?? "Validation failed";

  const labels = { ...DEFAULT_FIELD_LABELS, ...options?.fieldLabels };
  const key = String(issue.path[0] ?? "");
  const label = labels[key] ?? key;
  const message =
    issue.message === "Invalid input" && label
      ? (options?.invalidOrMissing?.(label) ?? `${label} is invalid or missing`)
      : issue.message;

  return label && issue.path.length === 1 ? `${label}: ${message}` : message;
}
