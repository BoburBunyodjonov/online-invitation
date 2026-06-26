import type { ZodError } from "zod";

const FIELD_LABELS: Record<string, string> = {
  thumbnail: "Thumbnail",
  slug: "Slug",
  name: "Name",
  category: "Category",
  fieldsSchema: "Editable fields",
  themeDefaults: "Theme",
  previewImages: "Preview images",
};

export function formatZodError(error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Validation failed";

  const key = String(issue.path[0] ?? "");
  const label = FIELD_LABELS[key] ?? key;
  const message =
    issue.message === "Invalid input" && label
      ? `${label} is invalid or missing`
      : issue.message;

  return label && issue.path.length === 1 ? `${label}: ${message}` : message;
}
