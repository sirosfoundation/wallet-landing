FROM --platform=$BUILDPLATFORM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . ./
RUN pnpm build


FROM ghcr.io/nginx/nginx-unprivileged:alpine AS deploy

WORKDIR /usr/share/nginx/

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder --chown=nginx:nginx /app/dist/ ./html/

EXPOSE 8080
