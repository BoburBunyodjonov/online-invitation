import { PrismaClient } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";
import {
  SAMPLE_DATA,
  DEFAULT_FIELDS_SCHEMA,
  STANDARD_FIELDS_SCHEMA,
  BLUE_ENVELOPE_FIELDS_SCHEMA,
  UZB_STYLE_FIELDS_SCHEMA,
  GOLD_ELEGANCE_FIELDS_SCHEMA,
  BEACH_THEME,
  ISLAMIC_THEME,
  BLUE_ENVELOPE_THEME,
  UZB_STYLE_THEME,
  GOLD_ELEGANCE_THEME,
} from "../templates/sample-data";
import {
  DEFAULT_LANDING_TEXTS,
  DEFAULT_SITE_SETTINGS,
} from "../lib/site-settings/defaults";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, role: "admin" },
  });
  console.log(`✓ Admin user ready: ${email} / ${password}`);

  // --- Templates ---
  await prisma.template.upsert({
    where: { slug: "beach-romantic" },
    update: {
      priceAmount: 250_000,
      currency: "UZS",
      badgePopular: true,
      thumbnail:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85",
    },
    create: {
      slug: "beach-romantic",
      name: "Beach Romantic",
      category: "beach",
      thumbnail:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85",
      previewImages: SAMPLE_DATA.gallery,
      componentKey: "beach-romantic",
      fieldsSchema: STANDARD_FIELDS_SCHEMA as object,
      themeDefaults: BEACH_THEME as object,
      priceAmount: 250_000,
      currency: "UZS",
      isPublished: true,
      badgePopular: true,
    },
  });

  await prisma.template.upsert({
    where: { slug: "islamic-elegant" },
    update: {
      priceAmount: 300_000,
      currency: "UZS",
      thumbnail:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85",
    },
    create: {
      slug: "islamic-elegant",
      name: "Islamic Elegant",
      category: "islamic",
      thumbnail:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85",
      previewImages: SAMPLE_DATA.gallery,
      componentKey: "islamic-elegant",
      fieldsSchema: STANDARD_FIELDS_SCHEMA as object,
      themeDefaults: ISLAMIC_THEME as object,
      priceAmount: 300_000,
      currency: "UZS",
      isPublished: true,
    },
  });

  await prisma.template.upsert({
    where: { slug: "blue-envelope" },
    update: {
      componentKey: "blue-envelope",
      fieldsSchema: BLUE_ENVELOPE_FIELDS_SCHEMA as object,
      isPublished: true,
      priceAmount: 450_000,
      currency: "UZS",
      badgeNew: true,
    },
    create: {
      slug: "blue-envelope",
      name: "Blue Envelope",
      category: "classic",
      thumbnail: "/templates/blue-envelope/assets/blue%20ornament%20.png",
      previewImages: [
        "/templates/blue-envelope/assets/blue%20ornament%20.png",
        "/templates/blue-envelope/assets/rings%20blue.png",
      ],
      componentKey: "blue-envelope",
      fieldsSchema: BLUE_ENVELOPE_FIELDS_SCHEMA as object,
      themeDefaults: BLUE_ENVELOPE_THEME as object,
      priceAmount: 450_000,
      currency: "UZS",
      isPublished: true,
      badgeNew: true,
    },
  });
  console.log("✓ Templates seeded: beach-romantic, islamic-elegant, blue-envelope, uzb-style, gold-elegance");

  await prisma.template.upsert({
    where: { slug: "gold-elegance" },
    update: {
      componentKey: "gold-elegance",
      fieldsSchema: GOLD_ELEGANCE_FIELDS_SCHEMA as object,
      isPublished: true,
      priceAmount: 550_000,
      currency: "UZS",
      badgeNew: true,
    },
    create: {
      slug: "gold-elegance",
      name: "Gold Elegance",
      category: "classic",
      thumbnail: "/templates/gold-elegance/assets/wedding-hero.jpg",
      previewImages: [
        "/templates/gold-elegance/assets/wedding-hero.jpg",
        "/templates/gold-elegance/assets/hands.png",
      ],
      componentKey: "gold-elegance",
      fieldsSchema: GOLD_ELEGANCE_FIELDS_SCHEMA as object,
      themeDefaults: GOLD_ELEGANCE_THEME as object,
      priceAmount: 550_000,
      currency: "UZS",
      isPublished: true,
      badgeNew: true,
    },
  });

  await prisma.template.upsert({
    where: { slug: "uzb-style" },
    update: {
      componentKey: "uzb-style",
      fieldsSchema: UZB_STYLE_FIELDS_SCHEMA as object,
      isPublished: true,
      priceAmount: 500_000,
      currency: "UZS",
      badgeNew: true,
    },
    create: {
      slug: "uzb-style",
      name: "Uzbek Heritage",
      category: "classic",
      thumbnail: "/templates/uzb-style/assets/couple.png",
      previewImages: [
        "/templates/uzb-style/assets/couple.png",
        "/templates/uzb-style/assets/border%20ornament.png",
      ],
      componentKey: "uzb-style",
      fieldsSchema: UZB_STYLE_FIELDS_SCHEMA as object,
      themeDefaults: UZB_STYLE_THEME as object,
      priceAmount: 500_000,
      currency: "UZS",
      isPublished: true,
      badgeNew: true,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      contactPhone: DEFAULT_SITE_SETTINGS.contactPhone,
      telegramUsername: DEFAULT_SITE_SETTINGS.telegramUsername,
      texts: DEFAULT_LANDING_TEXTS as object,
    },
  });
  console.log("✓ Site settings seeded");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
