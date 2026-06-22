const RESERVED_SLUGS = new Set(["-", "opengraph-image"]);

export function slugify(input: string): string {
  const result = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!result || RESERVED_SLUGS.has(result) || result.length < 2) return "";
  return result;
}

export function isValidInvitationSlug(slug: string): boolean {
  return (
    slug.length >= 2 &&
    /^[a-z0-9-]+$/.test(slug) &&
    !RESERVED_SLUGS.has(slug)
  );
}
