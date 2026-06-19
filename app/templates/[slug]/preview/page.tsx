import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTemplateBySlug } from "@/lib/server/templates";
import { InvitationRenderer } from "@/components/InvitationRenderer";
import { SAMPLE_DATA, BLUE_ENVELOPE_SAMPLE } from "@/templates/sample-data";
import type { ThemeDefaults } from "@/lib/validation/template";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const template = await getTemplateBySlug(slug);
    return {
      title: `${template.name} — Preview`,
      robots: { index: false },
    };
  } catch {
    return { title: "Preview" };
  }
}

/**
 * Full-screen, chrome-free preview that renders the REAL template component with
 * realistic placeholder data — what the visitor's finished invitation will look
 * like. Placed outside the (public) group so the site header/footer don't show.
 */
export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let template;
  try {
    template = await getTemplateBySlug(slug);
  } catch {
    notFound();
  }

  const previewData =
    template.componentKey === "blue-envelope" ? BLUE_ENVELOPE_SAMPLE : SAMPLE_DATA;

  return (
    <InvitationRenderer
      componentKey={template.componentKey}
      data={previewData}
      theme={template.themeDefaults as ThemeDefaults}
    />
  );
}
