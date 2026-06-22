import { ImageResponse } from "next/og";
import { getPublishedInvitationBySlug } from "@/lib/server/invitations";
import type { InvitationData } from "@/lib/validation/invitation-data";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Wedding invitation";

/** Dynamically generated OpenGraph image: couple names + date on a styled bg. */
export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let names = "Wedding Invitation";
  let dateLabel = "";
  let accent = "#c79a6b";
  let background = "#fbf7f2";

  try {
    const { invitation, theme } = await getPublishedInvitationBySlug(slug);
    const data = invitation.data as unknown as InvitationData;
    const groom = data.groomName[data.defaultLocale] ?? "";
    const bride = data.brideName[data.defaultLocale] ?? "";
    names = `${groom} & ${bride}`;
    dateLabel = data.weddingDate;
    accent = theme.accentColor ?? accent;
    background = theme.backgroundColor ?? background;
  } catch {
    // fall back to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background,
          color: "#3a2f28",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 8, color: accent, marginBottom: 24 }}>
          WEDDING INVITATION
        </div>
        <div style={{ fontSize: 84, fontWeight: 700 }}>{names}</div>
        <div style={{ fontSize: 36, marginTop: 24, color: "#6f6259" }}>
          {dateLabel}
        </div>
      </div>
    ),
    { ...size },
  );
}
