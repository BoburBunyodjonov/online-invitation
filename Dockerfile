# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
# postinstall runs prisma generate — schema is copied later in builder stage
RUN npm install --no-audit --no-fund --ignore-scripts

FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Production Docker uses PostgreSQL; local dev keeps sqlite in the repo.
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs --home-dir /app nextjs

# Standalone already includes traced node_modules — do not copy the full deps tree again.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib/generated ./lib/generated
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/lib/site-settings ./lib/site-settings
COPY deploy/docker-entrypoint.sh /docker-entrypoint.sh
# Entrypoint only: prisma db push + optional tsx seed (not bundled in standalone).
RUN npm install --no-save --no-audit --no-fund prisma@6.19.3 tsx@4.22.4 && \
    chmod +x /docker-entrypoint.sh && \
    mkdir -p /data/uploads && \
    chown -R nextjs:nodejs /app /data

USER nextjs
ENV HOME=/app
ENV PATH="/app/node_modules/.bin:${PATH}"
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "server.js"]
