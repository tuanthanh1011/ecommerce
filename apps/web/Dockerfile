# Build context is the monorepo root (see ../../docker-compose.yml), because
# npm workspaces keep a single package-lock.json at the root.
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
# The committed lockfile was generated on a non-Linux host and is missing the
# linux-musl native binary entries (lightningcss, @next/swc). Drop it here so
# npm re-resolves fresh and fetches the binaries matching this container's
# platform; versions stay constrained by each package.json's semver ranges.
RUN rm -f package-lock.json && npm install
COPY apps/web ./apps/web
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
RUN npm run build --workspace=web

FROM nginx:1.27-alpine AS production
COPY --from=builder /app/apps/web/out /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
