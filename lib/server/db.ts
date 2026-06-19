import { PrismaClient } from "@/lib/generated/prisma";

/**
 * Single shared PrismaClient instance.
 * In dev, Next.js hot-reload caches this on globalThis — after `prisma generate`
 * the cached client can be stale (missing new schema fields). We detect that and
 * recreate the client automatically.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getRuntimeModels(client: PrismaClient) {
  return (
    client as unknown as {
      _runtimeDataModel?: {
        models: Record<string, { fields: { name: string }[] }>;
      };
    }
  )._runtimeDataModel?.models;
}

function isPrismaClientStale(client: PrismaClient): boolean {
  const models = getRuntimeModels(client);
  if (!models) return false;

  const templateFields = models.Template?.fields ?? [];
  const hasPriceField = templateFields.some((f) => f.name === "priceAmount");
  const hasSiteSettings = Boolean(models.SiteSettings);

  return !hasPriceField || !hasSiteSettings;
}

function getPrismaClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  const staleInDev =
    process.env.NODE_ENV === "development" && cached && isPrismaClientStale(cached);

  if (cached && !staleInDev) {
    return cached;
  }

  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrismaClient();
