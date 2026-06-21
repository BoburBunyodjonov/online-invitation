import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedInvitationBySlug } from "@/lib/server/invitations";
import { InvitationRenderer } from "@/components/InvitationRenderer";
import { ViewBeacon } from "@/components/ViewBeacon";
import type { InvitationData } from "@/lib/validation/invitation-data";
import type { ThemeDefaults } from "@/lib/validation/template";

/**
 * ISR: the page is statically generated and revalidated every 30s, so admin
 * edits appear within seconds WITHOUT a redeploy. This single mechanism is what
 * gives every customer "their own hosted invitation" for free — we never create
 * a new Vercel project per customer, just a new row + a new /i/[slug] path.
 */
export const revalidate = 30;
export const dynamicParams = true;

function pick(data: InvitationData, field: "groomName" | "brideName") {
  const v = data[field];
  return v[data.defaultLocale] ?? Object.values(v)[0] ?? "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { invitation } = await getPublishedInvitationBySlug(slug);
    const data = invitation.data as unknown as InvitationData;
    const names = `${pick(data, "groomName")} & ${pick(data, "brideName")}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const url = `${siteUrl}/i/${slug}`;
    return {
      title: names,
      description: `${names} — ${data.weddingDate}`,
      alternates: { canonical: url },
      openGraph: {
        title: names,
        description: `${names} — ${data.weddingDate}`,
        url,
        type: "website",
      },
    };
  } catch {
    return { title: "Invitation" };
  }
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let result;
  try {
    result = await getPublishedInvitationBySlug(slug);
  } catch {
    notFound();
  }

  const { invitation, template } = result;
  const data = invitation.data as unknown as InvitationData;

  const names = `${pick(data, "groomName")} & ${pick(data, "brideName")}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Wedding of ${names}`,
    startDate: `${data.weddingDate}T${data.startTime || "00:00"}`,
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: data.venue?.name?.[data.defaultLocale] ?? "",
      address: data.venue?.address?.[data.defaultLocale] ?? "",
    },
  };

  return (
    <>
      <ViewBeacon src={`/api/i/${encodeURIComponent(slug)}/view`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InvitationRenderer
        componentKey={template.componentKey}
        data={data}
        theme={template.themeDefaults as ThemeDefaults}
      />
    </>
  );
}
