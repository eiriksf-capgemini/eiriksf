# Ingen syntax=-direktiv med vilje: det får BuildKit til å hente
# docker/dockerfile-imaget fra Docker Hub anonymt før bygget i det hele tatt
# starter, og et 504 derfra gjorde Docker-jobben rød to kjøringer på rad
# (esf-07k.5). Den innebygde frontenden dekker alt denne filen bruker,
# inkludert COPY --chmod.

# Base-imaget står med vilje som en bokstavelig tag i hver FROM, ikke bak en
# ARG. Dependabots Dockerfile-parser hopper over FROM-linjer der imaget er en
# variabel (dependabot-core#4597, lukket som "not planned"), så en
# FROM med variabel ville stilltiende slått av base-image-oppdateringene vi
# satte opp i esf-8hh – nettopp mekanismen som fant denne feilen. Vil du teste
# mot en annen tag, bygg fra en midlertidig kopi:
#   sed 's|^FROM node:22-alpine|FROM node:25-alpine|' Dockerfile > /tmp/Dockerfile.test
#   docker build -f /tmp/Dockerfile.test .

# Nyere node-images (f.eks. node:25-alpine) har ikke corepack forhåndsinstallert
# lenger, så "corepack enable" feiler med exit 127 (esf-07k.9). npm er derimot
# alltid med i node-imagene, uavhengig av corepack, så vi bootstrapper pnpm med
# "npm install -g pnpm@<versjon>" i stedet. Versjonen pinnes eksplisit til
# packageManager-feltet i package.json (ikke en flytende "latest"), slik at vi
# aldri risikerer en annen pnpm-versjon enn den lockfilen er generert med. Dette
# unngår også en ekstra avhengighet (curl + det offisielle install-scriptet)
# bare for å installere ett npm-pakke.
ARG PNPM_VERSION=10.12.1

# ---------- 1. Avhengigheter ----------
FROM node:22-alpine AS deps
WORKDIR /app
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION} && pnpm --version
COPY package.json pnpm-lock.yaml* ./
# --frozen-lockfile når pnpm-lock.yaml er sjekket inn (anbefalt)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

# ---------- 2. Bygg (statisk eksport → /app/out) ----------
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION} && pnpm --version
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---------- 3. Runtime: kun nginx + statiske filer ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine-slim AS runtime
COPY --chmod=644 docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
