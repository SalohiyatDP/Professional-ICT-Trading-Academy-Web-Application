# syntax=docker/dockerfile:1

# ---- Build bosqichi ----
FROM node:22-alpine AS builder
WORKDIR /app

# Bog'liqliklarni keshlash uchun avval manifestlarni ko'chiramiz
COPY package.json package-lock.json ./
RUN npm ci

# Manba kodini ko'chirib, production build qilamiz
COPY . .
RUN npm run build

# ---- Runtime bosqichi (statik fayllarni nginx orqali tarqatish) ----
FROM nginx:1.27-alpine AS runtime

# SPA fallback + keshlash sozlamalari
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build natijasini nginx web-root'iga ko'chiramiz
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Konteyner sog'lig'ini tekshirish
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
