# Ingen syntax=-direktiv med vilje: det får BuildKit til å hente
# docker/dockerfile-imaget fra Docker Hub anonymt før bygget i det hele tatt
# starter, og et 504 derfra gjorde Docker-jobben rød to kjøringer på rad
# (esf-07k.5). Den innebygde frontenden dekker alt denne filen bruker,
# inkludert COPY --chmod.

# ---------- 1. Avhengigheter ----------
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
# --frozen-lockfile når pnpm-lock.yaml er sjekket inn (anbefalt)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

# ---------- 2. Bygg (statisk eksport → /app/out) ----------
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---------- 3. Runtime: kun nginx + statiske filer ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine-slim AS runtime
COPY --chmod=644 docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
