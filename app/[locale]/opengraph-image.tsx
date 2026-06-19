import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Taklifnoma — online wedding invitations";

export default async function LandingOgImage() {
  const t = await getTranslations("seo");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(145deg, #3f1e21 0%, #5d2e32 42%, #7a4549 100%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          ✦ {t("siteName")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            {t("ogTitle")}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              maxWidth: 820,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            {t("ogDescription")}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <span>Countdown</span>
          <span>·</span>
          <span>Gallery</span>
          <span>·</span>
          <span>Maps</span>
          <span>·</span>
          <span>Music</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
