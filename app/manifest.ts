import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site-url";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Taklifnoma — Online Wedding Invitations",
    short_name: "Taklifnoma",
    description:
      "Premium online wedding invitation templates for Uzbekistan — order via Telegram.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#5D2E32",
    lang: "uz",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
