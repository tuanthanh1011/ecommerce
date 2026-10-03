# Build context is the monorepo root (see ../../docker-compose.yml), because
# npm workspaces keep a single package-lock.json at the root.
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci
COPY apps/api ./apps/api
RUN npm run build --workspace=api

FROM base AS production
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci --omit=dev
COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["sh", "-c", "node ../../node_modules/typeorm/cli.js migration:run -d dist/database/data-source.js && node dist/main.js"]
