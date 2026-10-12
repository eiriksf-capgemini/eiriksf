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
#   sed 's|^FROM node:26-alpine|FROM node:27-alpine|' Dockerfile > /tmp/Dockerfile.test
#   docker build -f /tmp/Dockerfile.test .

# Nyere node-images har ikke corepack forhåndsinstallert lenger, så
# "corepack enable" feiler med exit 127 (esf-07k.9). npm er derimot alltid med
# i node-imagene uavhengig av corepack, så vi bootstrapper pnpm med npm i
# stedet. Det sparer oss også for curl og det offisielle install-scriptet bare
# for å installere én npm-pakke.
#
# Versjonen leses ut av packageManager i package.json under selve bygget, ikke
# skrevet av som et tall her. Står den to steder, kan de gli fra hverandre uten
# at noe sier fra: CI henter sin pnpm via pnpm/action-setup, som leser
# package.json, mens Docker-bygget ville holdt på sin egen kopi - og da bygger
# du med en annen pnpm enn lockfilen er generert med, som er nettopp det K3 i
# esf-07k.9 skal hindre.
#
# Regexen stopper ved +. corepack, pnpm self-update og de fleste editorer
# skriver feltet som pnpm@10.12.1+sha512-..., og tar man integritetssuffikset
# med videre, leser npm hele strengen som en GitHub-snarvei og feiler med at
# det ikke er et gyldig repository-navn. Verre: er det ingen skråstrek i
# hashen, sier npm «added 1 package» uten å legge igjen noen pnpm-binær, og
# det smeller først på neste linje med «pnpm: not found» (esf-07k.14). Finner
# vi ingen versjon, stopper bygget med en gang i stedet.

# ---------- 1. Avhengigheter ----------
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm_version="$(node -p "(require('./package.json').packageManager.match(/^pnpm@([^+]+)/)||[])[1]||''")" \
  && [ -n "$pnpm_version" ] || { echo "Fant ingen pnpm-versjon i packageManager" >&2; exit 1; } \
  && npm install -g "pnpm@$pnpm_version" \
  && pnpm --version
# --frozen-lockfile når pnpm-lock.yaml er sjekket inn (anbefalt)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

# ---------- 2. Bygg (statisk eksport → /app/out) ----------
FROM node:26-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json ./
RUN pnpm_version="$(node -p "(require('./package.json').packageManager.match(/^pnpm@([^+]+)/)||[])[1]||''")" \
  && [ -n "$pnpm_version" ] || { echo "Fant ingen pnpm-versjon i packageManager" >&2; exit 1; } \
  && npm install -g "pnpm@$pnpm_version" \
  && pnpm --version
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---------- 3. Runtime: kun nginx + statiske filer ----------
FROM nginxinc/nginx-unprivileged:1.29-alpine-slim AS runtime
# Snippeten legges rett i /etc/nginx, ikke i en ny underkatalog: COPY --chmod
# setter samme modus på kataloger den oppretter, og 644 på en katalog betyr
# ingen x-bit, altså ingen gjennomgang - nginx som uprivilegert bruker fikk
# 'Permission denied' på include. Den kan heller ikke ligge i conf.d/, som
# auto-inkluderes som server-kontekst.
COPY --chmod=644 docker/security-headers.conf /etc/nginx/security-headers.conf
COPY --chmod=644 docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
