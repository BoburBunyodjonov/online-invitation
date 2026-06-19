import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import { getSiteUrl } from "@/lib/seo/site-url";
import "./globals.css";
import "./landing-hero.css";
import "./landing-features.css";
import "./landing-order-cta.css";
import { Providers } from "./providers";
import { Analytics } from "@/components/Analytics";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Taklifnoma — Online Wedding Invitations",
    template: "%s · Taklifnoma",
  },
  description:
    "Beautiful ready-made wedding invitation templates. Pick one, order via Telegram, and we publish your personalized invitation page.",
  applicationName: "Taklifnoma",
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
